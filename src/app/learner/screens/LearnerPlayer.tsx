"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/common";
import useVideoDetail from "@/api/learning/useVideoDetail";
import useVideoLike from "@/api/learning/useVideoLike";
import useVideoUnlike from "@/api/learning/useVideoUnlike";
import useVideoView from "@/api/learning/useVideoView";
import useSaveVideoProgress from "@/api/learning/useSaveVideoProgress";
import { getErrorMessage } from "@/_lib/fetcher";
import { ProgressBar } from "../components/shared/LearnerUI";

export function LearnerPlayer() {
  const params = useParams<{ lessonId: string }>();
  const videoId = Number(params.lessonId);
  const query = useVideoDetail(videoId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [position, setPosition] = useState(0);
  const [playedView, setPlayedView] = useState(false);
  const view = useVideoView(videoId);
  const save = useSaveVideoProgress(videoId);
  const like = useVideoLike(videoId);
  const unlike = useVideoUnlike(videoId);
  const video = query.data;
  if (query.isLoading) return <main className="p-8 text-center text-sm text-muted">영상을 불러오는 중이에요.</main>;
  if (!video) return <main className="p-8 text-center text-sm text-muted">영상을 불러오지 못했습니다.</main>;
  const pct = video.durationSeconds ? Math.min(100, Math.round((position / video.durationSeconds) * 100)) : 0;
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  const saveProgress = () => {
    const now = new Date();
    save.mutate({ lastPositionSeconds: position, watchedRange: [0, position], activitySession: { sessionKey: `video-${videoId}-${now.getTime()}`, startedAt: new Date(now.getTime() - Math.max(position, 1) * 1000).toISOString(), endedAt: now.toISOString(), activeSeconds: Math.max(position, 1) } });
  };
  return <main className="flex min-h-dvh flex-col bg-bg">
    <header className="flex h-[60px] items-center justify-between px-5"><Link href={`/learner/courses/${video.courseId}`} aria-label="뒤로" className="text-xl">‹</Link><span className="truncate px-3 text-center text-[10px] text-muted">{video.courseTitle}{video.sectionTitle ? ` · ${video.sectionTitle}` : ""}</span><button type="button" onClick={() => (video.isLiked ? unlike.mutate() : like.mutate())} className="text-accent" aria-label="좋아요">{video.isLiked ? "♥" : "♡"}</button></header>
    <div className="relative flex min-h-[230px] items-center justify-center bg-black"><video ref={videoRef} src={video.videoUrl ?? undefined} controls playsInline className="max-h-[45vh] w-full" onTimeUpdate={(event) => { const current = Math.floor(event.currentTarget.currentTime); setPosition(current); if (current >= 3 && !playedView) { setPlayedView(true); view.mutate({ playedSeconds: current }); } }} onPause={saveProgress} /><div className="absolute inset-x-5 bottom-3 pointer-events-none text-[10px] text-white">{video.title}</div></div>
    <div className="flex flex-1 flex-col px-5 pb-6 pt-5"><div className="flex items-center justify-between"><h1 className="text-sm font-medium">대본</h1><span className="text-[10px] text-muted">{pct}% 시청</span></div><div className="mt-3 space-y-3">{video.segments.map((line) => { const start = Math.floor(line.startMs / 1000); return <button key={line.id} type="button" onClick={() => { if (videoRef.current) videoRef.current.currentTime = start; }} className={`flex w-full gap-3 text-left text-xs leading-5 ${position >= start ? "text-text" : "text-muted"}`}><span className="shrink-0 font-mono text-[10px] text-dim">{formatTime(start)}</span>{line.content}</button>; })}{video.segments.length === 0 && <p className="text-xs text-muted">등록된 대본이 없습니다.</p>}</div><div className="mt-auto pt-6"><ProgressBar value={pct} /><p className="mt-2 text-[10px] text-muted">90% 이상 시청하면 다음 학습이 열려요.</p>{save.isError && <p role="alert" className="mt-2 text-xs text-danger">{getErrorMessage(save.error)}</p>}{video.navigation.nextItemType === "QUIZ" && video.navigation.nextItemId && video.navigation.isNextUnlocked ? <Link href={`/learner/quiz/${video.sectionId}`} className="mt-4 block"><Button fullWidth>단위 퀴즈 풀기</Button></Link> : video.navigation.nextItemType === "VIDEO" && video.navigation.nextItemId && video.navigation.isNextUnlocked ? <Link href={`/learner/learn/${video.navigation.nextItemId}`} className="mt-4 block"><Button fullWidth>다음 강의</Button></Link> : <Button fullWidth className="mt-4" variant="outline" onClick={saveProgress} disabled={save.isPending}>{save.isPending ? "저장 중…" : "진도 저장"}</Button>}</div></div>
  </main>;
}
