"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useVideoDetail from "@/api/learning/useVideoDetail";
import useCourseDetail from "@/api/learning/useCourseDetail";
import useVideoLike from "@/api/learning/useVideoLike";
import useVideoUnlike from "@/api/learning/useVideoUnlike";
import useVideoView from "@/api/learning/useVideoView";
import postPlaybackUrl from "@/api/learning/postPlaybackUrl";
import { getErrorMessage } from "@/_lib/fetcher";
import type { CourseDetailDto } from "@/types/learning";
import useVideoProgressAutoSave from "./useVideoProgressAutoSave";
import { finalQuizHref, unitQuizHref } from "../_lib/learningHref";

/** 서명 재생 URL은 5분 동안 유효해서 4분마다 새로 받는다. */
const PLAYBACK_URL_REFRESH_MS = 4 * 60 * 1000;

type ShortformItem =
  | { kind: "VIDEO"; key: string; videoId: number; title: string; sectionTitle: string | null; isLocked: boolean; isCompleted: boolean }
  | { kind: "UNIT_QUIZ" | "FINAL_QUIZ"; key: string; title: string; href: string; isLocked: boolean; isCompleted: boolean };

/** 강좌 커리큘럼을 숏폼 순서로 편다: 섹션별 학습 영상 → 단위 퀴즈, 마지막에 종합 퀴즈. */
const buildCourseItems = (course: CourseDetailDto): ShortformItem[] => {
  const items: ShortformItem[] = [];
  for (const section of [...course.sections].sort((a, b) => a.sortOrder - b.sortOrder)) {
    for (const video of [...section.videos].sort((a, b) => a.sortOrder - b.sortOrder)) {
      items.push({ kind: "VIDEO", key: `v-${video.videoId}`, videoId: video.videoId, title: video.title, sectionTitle: section.title, isLocked: video.isLocked, isCompleted: video.isCompleted });
    }
    if (section.unitQuiz) {
      items.push({ kind: "UNIT_QUIZ", key: `q-${section.sectionId}`, title: `${section.title} 단위 퀴즈`, href: unitQuizHref(section.sectionId, course.courseId), isLocked: section.unitQuiz.isLocked, isCompleted: section.unitQuiz.isCompleted });
    }
  }
  if (course.finalQuiz) {
    items.push({ kind: "FINAL_QUIZ", key: "final", title: "코스 종합 퀴즈", href: finalQuizHref(course.courseId), isLocked: course.finalQuiz.isLocked, isCompleted: course.finalQuiz.isCompleted });
  }
  return items;
};

/**
 * 수강 화면. 기획서의 "위아래 스와이프로 강의를 넘기는 숏폼 학습"을 따른다.
 * 학습 영상은 강좌의 커리큘럼 순서대로 세로로 넘기고, 섹션이 끝나면 단위 퀴즈 카드가 이어진다.
 * 무료 OT는 커리큘럼 밖의 영상이라 한 장만 보여 준다.
 */
export function LearnerPlayer() {
  const params = useParams<{ lessonId: string }>();
  const startVideoId = Number(params.lessonId);
  const start = useVideoDetail(startVideoId);
  const isLesson = start.data ? start.data.sectionId !== null : false;
  const course = useCourseDetail(isLesson ? start.data?.courseId ?? 0 : 0);

  const items = useMemo<ShortformItem[]>(() => {
    if (!start.data) return [];
    if (!isLesson) return [{ kind: "VIDEO", key: `v-${start.data.videoId}`, videoId: start.data.videoId, title: start.data.title, sectionTitle: null, isLocked: false, isCompleted: start.data.progress.isCompleted }];
    return course.data ? buildCourseItems(course.data) : [];
  }, [course.data, isLesson, start.data]);

  const scrollRef = useRef<HTMLElement>(null);
  // 방해금지 모드: 무료 OT 피드처럼 영상 위의 화면 요소를 숨긴다. 넘겨도 유지된다.
  const [focusMode, setFocusMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const startIndex = items.findIndex((item) => item.kind === "VIDEO" && item.videoId === startVideoId);
  const currentIndex = activeIndex >= 0 ? activeIndex : Math.max(startIndex, 0);

  // 처음 연 영상 위치로 한 번만 이동한다.
  const scrolledRef = useRef(false);
  useEffect(() => {
    const root = scrollRef.current;
    if (scrolledRef.current || !root || startIndex < 0) return;
    scrolledRef.current = true;
    root.scrollTo({ top: startIndex * root.clientHeight });
  }, [startIndex]);

  // 화면에 가장 많이 보이는 카드를 현재 카드로 본다.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || items.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) setActiveIndex(Number((entry.target as HTMLElement).dataset.index));
      }
    }, { root, threshold: [0, 0.6, 1] });
    root.querySelectorAll<HTMLElement>("[data-index]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items.length]);

  // 새로고침해도 지금 보는 영상에서 다시 시작하도록 주소를 맞춘다.
  const activeItem = items[currentIndex];
  useEffect(() => {
    if (activeItem?.kind !== "VIDEO") return;
    const path = `/learner/learn/${activeItem.videoId}`;
    if (window.location.pathname !== path) window.history.replaceState(window.history.state, "", path);
  }, [activeItem]);

  const goTo = useCallback((index: number) => {
    const root = scrollRef.current;
    if (root) root.scrollTo({ top: index * root.clientHeight, behavior: "smooth" });
  }, []);

  const backHref = start.data ? `/learner/courses/${start.data.courseId}` : "/learner";
  const headerTitle = start.data?.courseTitle ?? "";
  const loading = start.isLoading || (isLesson && course.isLoading);
  const error = start.error ?? course.error;

  return (
    <main ref={scrollRef} className="shortform-feed-scrollbar-hidden mx-auto h-dvh w-full max-w-[430px] snap-y snap-mandatory overflow-y-auto overscroll-y-contain bg-black text-white">
      {loading && <div className="grid h-dvh place-items-center text-sm text-white/70">영상을 불러오는 중이에요.</div>}
      {!loading && (error || items.length === 0) && (
        <div className="grid h-dvh place-items-center px-8 text-center text-sm text-white/70">
          <div><p role="alert">{error ? getErrorMessage(error, "영상을 불러오지 못했습니다.") : "볼 수 있는 학습 영상이 없어요."}</p><Link href={backHref} className="mt-3 inline-block text-xs text-[#9bb5ff]">강좌로 돌아가기</Link></div>
        </div>
      )}
      {items.map((item, index) => (
        <section key={item.key} data-index={index} className="relative h-dvh w-full snap-start snap-always overflow-hidden bg-[#111]">
          {item.kind === "VIDEO" ? (
            item.isLocked ? <LockedCard title={item.title} message="앞 영상을 90% 이상 보면 열려요." /> : (
              <VideoCard
                videoId={item.videoId}
                isActive={index === currentIndex}
                isNear={Math.abs(index - currentIndex) <= 1}
                focusMode={focusMode}
                onEnded={() => { if (index + 1 < items.length) goTo(index + 1); }}
              />
            )
          ) : (
            <QuizCard item={item} />
          )}
          {!focusMode && <CardHeader backHref={backHref} title={headerTitle} subtitle={item.kind === "VIDEO" ? item.sectionTitle : null} position={isLesson ? `${index + 1} / ${items.length}` : "무료 OT"} />}
          {focusMode && item.kind === "VIDEO" && <button type="button" onClick={() => setFocusMode(false)} aria-label="화면 요소 다시 표시" className="absolute inset-0 z-20 cursor-pointer bg-transparent" />}
          <button type="button" onClick={() => setFocusMode((value) => !value)} aria-label={focusMode ? "방해금지모드 해제" : "방해금지모드 켜기"} className="absolute right-4 top-[calc(max(1rem,env(safe-area-inset-top))+2.5rem)] z-30 cursor-pointer rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">{focusMode ? "방해금지 해제" : "방해금지"}</button>
          {!focusMode && isLesson && index < items.length - 1 && <p className="pointer-events-none absolute inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-10 text-center text-[10px] text-white/50">위로 넘기면 다음 {items[index + 1].kind === "VIDEO" ? "강의" : "퀴즈"}</p>}
        </section>
      ))}
    </main>
  );
}

function CardHeader({ backHref, title, subtitle, position }: { backHref: string; title: string; subtitle: string | null; position: string }) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 bg-gradient-to-b from-black/70 to-transparent px-4 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
      <Link href={backHref} aria-label="강좌로 돌아가기" className="grid size-7 shrink-0 place-items-center">
        <svg viewBox="0 0 24 24" className="size-5 fill-none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m15 4-8 8 8 8" /></svg>
      </Link>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{title}</p>
        {subtitle && <p className="mt-0.5 truncate text-[10px] text-white/60">{subtitle}</p>}
      </div>
      <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] tabular-nums text-white/80">{position}</span>
    </header>
  );
}

function LockedCard({ title, message }: { title: string; message: string }) {
  return (
    <div className="grid h-full place-items-center px-10 text-center">
      <div>
        <span aria-hidden="true" className="text-3xl">🔒</span>
        <p className="mt-4 text-base font-semibold">{title}</p>
        <p className="mt-2 text-xs text-white/60">{message}</p>
      </div>
    </div>
  );
}

function QuizCard({ item }: { item: Extract<ShortformItem, { kind: "UNIT_QUIZ" | "FINAL_QUIZ" }> }) {
  if (item.isLocked) {
    return <LockedCard title={item.title} message={item.kind === "UNIT_QUIZ" ? "이 섹션의 학습 영상을 모두 보면 퀴즈가 열려요." : "모든 영상과 단위 퀴즈를 마치면 종합 퀴즈가 열려요."} />;
  }
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#24314d,#111_70%)] px-8 text-center">
      <span className="rounded-full border border-[#9bb5ff]/40 px-3 py-1 text-[10px] text-[#9bb5ff]">{item.kind === "UNIT_QUIZ" ? "단위 퀴즈" : "종합 퀴즈"}</span>
      <p className="mt-5 text-xl font-bold leading-7">{item.isCompleted ? "퀴즈를 마쳤어요" : "방금 본 내용을 확인해 볼까요?"}</p>
      <p className="mt-2 text-xs text-white/60">{item.title}</p>
      <p className="mt-1 text-[11px] text-white/45">틀린 문제는 오답노트에 저장돼 다시 풀 수 있어요.</p>
      <Link href={item.href} className="mt-8 flex h-11 w-full max-w-[280px] items-center justify-center rounded-full bg-[#f4f3ef] text-sm font-bold text-[#171719]">
        {item.isCompleted ? "다시 풀기" : "퀴즈 풀기"}
      </Link>
    </div>
  );
}

function VideoCard({ videoId, isActive, isNear, focusMode, onEnded }: { videoId: number; isActive: boolean; isNear: boolean; focusMode: boolean; onEnded: () => void }) {
  const detail = useVideoDetail(videoId, isNear);
  const video = detail.data;
  const playback = useQuery({
    queryKey: ["playback-url", videoId],
    queryFn: () => postPlaybackUrl(videoId),
    enabled: isNear,
    staleTime: PLAYBACK_URL_REFRESH_MS,
    refetchInterval: isActive ? PLAYBACK_URL_REFRESH_MS : false,
    gcTime: 0,
    retry: false,
  });
  const playbackUrl = playback.data?.playbackUrl;
  const isOt = video?.videoType === "OT";
  const progress = useVideoProgressAutoSave(videoId, video?.durationSeconds, !!video && !isOt);
  const view = useVideoView(videoId);
  const like = useVideoLike(videoId);
  const unlike = useVideoUnlike(videoId);

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTimeRef = useRef(0);
  const viewedRef = useRef(false);
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showScript, setShowScript] = useState(false);

  // 화면에 들어오면 재생하고 벗어나면 멈춘다. 소리 있는 자동 재생이 막히면 음소거로 재생하고, 화면을 누르면 소리를 켠다.
  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    if (!isActive) {
      element.pause();
      return;
    }
    element.play().catch(() => {
      element.muted = true;
      void element.play().catch(() => undefined);
    });
  }, [isActive, playbackUrl]);

  const seconds = Math.floor(position);
  const durationSeconds = video?.durationSeconds ?? 0;
  const percent = durationSeconds ? Math.min(100, Math.round((position / durationSeconds) * 100)) : 0;
  const caption = video?.segments.find((segment) => position * 1000 >= segment.startMs && position * 1000 < segment.endMs)?.content;

  const togglePlayback = () => {
    const element = videoRef.current;
    if (!element) return;
    if (element.muted) {
      element.muted = false;
      if (!element.paused) return;
    }
    if (element.paused) void element.play().catch(() => undefined);
    else element.pause();
  };

  if (!isNear) return <div className="h-full" />;
  return (
    <div className="group relative h-full">
      {playbackUrl && (
        <video
          ref={videoRef}
          src={playbackUrl}
          playsInline
          preload="metadata"
          onClick={togglePlayback}
          onLoadedMetadata={(event) => {
            setVideoError(false);
            // 서명 URL을 새로 받아도 보던 위치에서 이어 보고, 처음 열 때는 마지막 시청 위치에서 시작한다.
            const resumeAt = lastTimeRef.current || (video && !video.progress.isCompleted ? video.progress.lastPositionSeconds : 0);
            if (resumeAt > 0 && resumeAt < event.currentTarget.duration - 1) event.currentTarget.currentTime = resumeAt;
          }}
          onPlay={(event) => { setPlaying(true); progress.onPlay(event.currentTarget.currentTime); }}
          onPause={() => { setPlaying(false); progress.onStop(); }}
          onEnded={() => { progress.onEnded(); onEnded(); }}
          onSeeking={(event) => progress.onSeeking(event.currentTarget.currentTime)}
          onTimeUpdate={(event) => {
            const current = event.currentTarget.currentTime;
            lastTimeRef.current = current;
            setPosition(current);
            progress.onTime(current);
            if (!viewedRef.current && current >= 3) {
              viewedRef.current = true;
              view.mutate({ playedSeconds: Math.floor(current) });
            }
          }}
          onError={() => {
            // 만료된 URL이면 새로 받고, 방금 받은 URL도 실패하면 안내만 한다.
            if (playback.isStale) void playback.refetch();
            else setVideoError(true);
          }}
          className="absolute inset-0 size-full cursor-pointer bg-black object-contain"
        />
      )}
      {(!playbackUrl || videoError) && (
        <p role={videoError || playback.isError ? "alert" : undefined} className="absolute inset-x-8 top-1/2 z-10 -translate-y-1/2 text-center text-xs text-white/75">
          {videoError ? "영상을 재생할 수 없어요." : playback.isError ? getErrorMessage(playback.error, "재생 URL을 발급하지 못했습니다.") : "재생 준비 중이에요."}
        </p>
      )}
      {!focusMode && <>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35)_0%,transparent_25%,transparent_55%,rgba(0,0,0,.85)_100%)]" />

      <button type="button" onClick={togglePlayback} aria-label={playing ? "일시정지" : "재생"} className="absolute left-1/2 top-1/2 z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/55 bg-black/10 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100 focus-visible:opacity-100">
        {playing
          ? <svg viewBox="0 0 24 24" className="size-4 fill-current"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          : <svg viewBox="0 0 24 24" className="size-4 fill-current"><path d="M7 4.8c0-.8.9-1.3 1.6-.9l10.2 7.2a1.1 1.1 0 0 1 0 1.8L8.6 20.1c-.7.5-1.6 0-1.6-.9V4.8Z" /></svg>}
      </button>

      <div className="absolute right-4 top-[55%] z-10 flex -translate-y-1/2 flex-col items-center gap-6">
        <button type="button" onClick={() => (video?.isLiked ? unlike.mutate() : like.mutate())} disabled={!video || like.isPending || unlike.isPending} aria-label={video?.isLiked ? "좋아요 취소" : "좋아요"} className="flex cursor-pointer flex-col items-center gap-1 disabled:cursor-wait">
          <svg viewBox="0 0 24 24" className={`size-7 ${video?.isLiked ? "fill-[#9bb5ff] text-[#9bb5ff]" : "fill-none text-white"}`} stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.7c0 4.1-8.8 10.1-8.8 10.1S3.2 12.8 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" /></svg>
          <span className="text-xs">{video?.likeCount ?? 0}</span>
        </button>
        <button type="button" onClick={() => setShowScript((value) => !value)} aria-pressed={showScript} aria-label="대본 보기" className="flex cursor-pointer flex-col items-center gap-1">
          <svg viewBox="0 0 24 24" className={`size-7 fill-none ${showScript ? "text-[#9bb5ff]" : "text-white"}`} stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" /></svg>
          <span className="text-xs">대본</span>
        </button>
      </div>

      <div className="absolute inset-x-4 bottom-[max(1.75rem,calc(env(safe-area-inset-bottom)+1.25rem))] z-10">
        {caption && !showScript && <p className="mb-3 rounded-lg bg-black/55 px-3 py-2 text-center text-[13px] leading-5">{caption}</p>}
        {showScript && video && (
          <div className="mb-3 max-h-[38dvh] space-y-2 overflow-y-auto rounded-xl bg-black/70 p-3 backdrop-blur">
            {video.segments.map((segment) => {
              const startSeconds = Math.floor(segment.startMs / 1000);
              return <button key={segment.id} type="button" onClick={() => { if (videoRef.current) videoRef.current.currentTime = startSeconds; }} className={`flex w-full gap-3 text-left text-xs leading-5 ${seconds >= startSeconds ? "text-white" : "text-white/50"}`}><span className="shrink-0 font-mono text-[10px] text-white/45">{Math.floor(startSeconds / 60)}:{String(startSeconds % 60).padStart(2, "0")}</span>{segment.content}</button>;
            })}
            {video.segments.length === 0 && <p className="text-xs text-white/60">등록된 대본이 없습니다.</p>}
          </div>
        )}
        <h1 className="text-base font-bold leading-6">{video?.title ?? ""}</h1>
        <div className="mt-2.5 h-0.5 w-full bg-white/20"><div className="h-full bg-[#9bb5ff] transition-[width]" style={{ width: `${percent}%` }} /></div>
        <p className="mt-1.5 text-[10px] text-white/55">
          {progress.error ? <span role="alert" className="text-[#ff9caa]">진도를 저장하지 못했어요. {getErrorMessage(progress.error)}</span> : isOt ? "무료 OT · 진도는 저장되지 않아요" : video?.progress.isCompleted ? "완료한 강의예요 · 진도는 자동으로 저장돼요" : `${percent}% 시청 · 90% 이상 보면 다음이 열려요`}
        </p>
      </div>
      </>}
    </div>
  );
}
