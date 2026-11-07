"use client";

import { useCallback, useEffect, useRef } from "react";
import useSaveVideoProgress from "@/api/learning/useSaveVideoProgress";

/** 재생 중에는 이 간격마다, 그 밖에는 일시정지·끝남·구간 이동·화면 이탈 때 저장한다. */
const AUTO_SAVE_INTERVAL_MS = 15_000;

/**
 * 플레이어를 연 동안을 학습 세션 하나로 보고 진도를 자동 저장한다.
 * - 같은 sessionKey로 여러 번 보내면 백엔드가 세션을 갱신하므로 학습 시간이 중복으로 쌓이지 않는다.
 * - watchedRange는 실제로 끊김 없이 본 구간만 보낸다. 구간을 건너뛰면 그 전까지 본 구간을 먼저 저장한다.
 */
export default function useVideoProgressAutoSave(videoId: number, durationSeconds: number | undefined) {
  const save = useSaveVideoProgress(videoId);
  const mutateRef = useRef(save.mutate);
  useEffect(() => {
    mutateRef.current = save.mutate;
  }, [save.mutate]);

  const sessionRef = useRef<{ key: string; startedAt: Date } | null>(null);
  const activeMsRef = useRef(0);
  const playingSinceRef = useRef<number | null>(null);
  const rangeStartRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const lastSavedRef = useRef("");

  const flush = useCallback(() => {
    const duration = durationSeconds ?? 0;
    const session = sessionRef.current;
    const rangeStart = rangeStartRef.current;
    if (!session || rangeStart === null || duration <= 0) return;
    const now = Date.now();
    if (playingSinceRef.current !== null) {
      activeMsRef.current += now - playingSinceRef.current;
      playingSinceRef.current = now;
    }
    const position = Math.min(Math.floor(positionRef.current), duration);
    const start = Math.min(Math.floor(rangeStart), duration);
    if (position <= start) return;
    const signature = `${start}-${position}-${Math.floor(activeMsRef.current / 1000)}`;
    if (signature === lastSavedRef.current) return;
    lastSavedRef.current = signature;
    const elapsedSeconds = Math.floor((now - session.startedAt.getTime()) / 1000);
    mutateRef.current({
      lastPositionSeconds: position,
      watchedRange: [start, position],
      activitySession: {
        sessionKey: session.key,
        startedAt: session.startedAt.toISOString(),
        endedAt: new Date(now).toISOString(),
        activeSeconds: Math.min(Math.floor(activeMsRef.current / 1000), elapsedSeconds),
      },
    });
  }, [durationSeconds]);

  const onPlay = useCallback((currentTime: number) => {
    if (!sessionRef.current) sessionRef.current = { key: `video-${videoId}-${Date.now()}`, startedAt: new Date() };
    if (rangeStartRef.current === null) rangeStartRef.current = currentTime;
    positionRef.current = currentTime;
    playingSinceRef.current = Date.now();
  }, [videoId]);

  const onTime = useCallback((currentTime: number) => {
    positionRef.current = currentTime;
  }, []);

  const onStop = useCallback(() => {
    flush();
    playingSinceRef.current = null;
  }, [flush]);

  /** 구간 이동 전 위치까지 저장하고, 이동한 위치부터 새 구간을 센다. */
  const onSeeking = useCallback((targetTime: number) => {
    flush();
    rangeStartRef.current = targetTime;
    positionRef.current = targetTime;
  }, [flush]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (playingSinceRef.current !== null) flush();
    }, AUTO_SAVE_INTERVAL_MS);
    const onHidden = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onHidden);
      flush();
    };
  }, [flush]);

  return { onPlay, onTime, onStop, onSeeking, isSaving: save.isPending, error: save.error };
}
