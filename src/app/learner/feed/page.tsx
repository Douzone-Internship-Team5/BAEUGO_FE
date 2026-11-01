"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { FeedDto } from "@/types/learning";
import useFeed from "@/api/learning/useFeed";
import useVideoLike from "@/api/learning/useVideoLike";
import useVideoUnlike from "@/api/learning/useVideoUnlike";
import useVideoView from "@/api/learning/useVideoView";

type FeedItem = FeedDto["items"][number];
const SAMPLE_VIDEO_URLS = [
  "/sample/KakaoTalk_Video_2024-11-22-21-13-11.mp4",
  "/sample/KakaoTalk_Video_2024-11-22-21-13-15.mp4",
  "/sample/KakaoTalk_Video_2024-11-22-21-13-24.mp4",
];

export default function FeedPage() {
  const feed = useFeed();
  const scrollRef = useRef<HTMLElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const items = feed.data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    const root = scrollRef.current;
    const target = loadMoreRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && feed.hasNextPage && !feed.isFetchingNextPage) {
        void feed.fetchNextPage();
      }
    }, { root, rootMargin: "100% 0px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [feed.fetchNextPage, feed.hasNextPage, feed.isFetchingNextPage]);

  return (
    <main ref={scrollRef} className="shortform-feed-scrollbar-hidden mx-auto h-dvh w-full max-w-[430px] snap-y snap-mandatory overflow-y-auto overscroll-y-contain bg-black text-white">
      {feed.isLoading && <div className="grid h-dvh place-items-center text-sm text-white/70">OT를 불러오는 중이에요.</div>}
      {!feed.isLoading && items.length === 0 && <div className="grid h-dvh place-items-center text-sm text-white/70">재생할 무료 OT가 없습니다.</div>}
      {items.map((item, index) => <FeedVideoCard key={`${item.videoId}-${index}`} item={item} index={index} rootRef={scrollRef} />)}
      {items.length > 0 && <div ref={loadMoreRef} className="grid h-16 place-items-center text-xs text-white/60">{feed.isFetchingNextPage ? "다음 OT를 불러오는 중이에요." : feed.isError ? "목록을 불러오지 못했어요." : ""}</div>}
    </main>
  );
}

function FeedVideoCard({ item, index, rootRef }: { item: FeedItem; index: number; rootRef: React.RefObject<HTMLElement | null> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const viewedRef = useRef(false);
  const sampleFallbackRef = useRef(false);
  const [active, setActive] = useState(false);
  const [videoSrc, setVideoSrc] = useState(item.videoUrl);
  const [liked, setLiked] = useState(item.isLiked);
  const [playing, setPlaying] = useState(false);
  const [distractionFree, setDistractionFree] = useState(false);
  const [progress, setProgress] = useState(0);
  const like = useVideoLike(item.videoId);
  const unlike = useVideoUnlike(item.videoId);
  const view = useVideoView(item.videoId);

  const setCardRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting && entry.intersectionRatio >= 0.65), {
      root: rootRef.current,
      threshold: [0, 0.65, 1],
    });
    observer.observe(node);
    (node as HTMLElement & { __feedObserver?: IntersectionObserver }).__feedObserver = observer;
  }, [rootRef]);

  useEffect(() => () => {
    const node = videoRef.current?.closest("article") as (HTMLElement & { __feedObserver?: IntersectionObserver }) | null;
    node?.__feedObserver?.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [active, videoSrc]);

  const toggleLike = () => {
    if (like.isPending || unlike.isPending) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    const mutation = nextLiked ? like : unlike;
    mutation.mutate(undefined, {
      onSuccess: (response) => setLiked(response.isLiked),
      onError: () => setLiked(!nextLiked),
    });
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { video.pause(); setPlaying(false); }
  };

  return (
    <article ref={setCardRef} className="relative h-dvh w-full snap-start snap-always overflow-hidden bg-[#111]">
      <video
        ref={videoRef}
        src={videoSrc}
        poster={item.thumbnailUrl ?? undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onClick={togglePlayback}
        onError={() => {
          if (sampleFallbackRef.current) return;
          sampleFallbackRef.current = true;
          setVideoSrc(SAMPLE_VIDEO_URLS[index % SAMPLE_VIDEO_URLS.length]);
        }}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
          if (!viewedRef.current && video.currentTime >= 3) {
            viewedRef.current = true;
            view.mutate({ playedSeconds: Math.floor(video.currentTime) });
          }
        }}
        className="absolute inset-0 size-full cursor-pointer object-cover"
      />
      {!distractionFree && <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(24,25,28,.86)_0%,rgba(24,25,28,.48)_25%,rgba(24,25,28,.08)_50%,rgba(15,16,18,.45)_70%,rgba(12,13,15,.97)_100%)]" />}
      {!distractionFree && <>
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link href="/learner" aria-label="뒤로 가기" className="absolute left-4 grid size-7 cursor-pointer place-items-center">
          <svg viewBox="0 0 24 24" className="size-5 fill-none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m15 4-8 8 8 8" /></svg>
        </Link>
        <span className="text-sm font-semibold tracking-wide">무료 OT</span>
      </header>
      <button type="button" onClick={togglePlayback} aria-label={playing ? "일시정지" : "재생"} className="absolute left-1/2 top-[40%] z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/55 bg-black/10 text-lg backdrop-blur-[2px]">
        {playing ? <span className="tracking-[-.25em]">Ⅱ</span> : <span className="ml-1">▶</span>}
      </button>
      <div className="absolute right-5 top-[57%] z-10 flex -translate-y-1/2 flex-col items-center gap-8">
        <button type="button" onClick={toggleLike} disabled={like.isPending || unlike.isPending} aria-label={liked ? "좋아요 취소" : "좋아요"} className="flex cursor-pointer flex-col items-center gap-1 text-white disabled:cursor-wait">
          <svg viewBox="0 0 24 24" className={`size-7 ${liked ? "fill-[#9bb5ff] text-[#9bb5ff]" : "fill-none text-white"}`} stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.7c0 4.1-8.8 10.1-8.8 10.1S3.2 12.8 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" /></svg>
          <span className="text-xs">{item.likeCount + (liked === item.isLiked ? 0 : liked ? 1 : -1)}</span>
        </button>
        <div className="flex flex-col items-center gap-1 text-white/85">
          <svg viewBox="0 0 24 24" className="size-7 fill-none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.4-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.4 6.5-9.5 6.5S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>
          <span className="text-xs">{item.viewCount.toLocaleString()}</span>
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-10">
        <p className="mb-4 text-center text-[13px] font-medium leading-5 drop-shadow">{item.course.description || item.title}</p>
        <div className="rounded-2xl bg-black/40 p-3.5 shadow-lg shadow-black/20 backdrop-blur-md">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm">{item.instructor.name.slice(0, 1)}</span>
          <div className="min-w-0"><p className="text-xs font-semibold">{item.instructor.name}</p><p className="mt-0.5 truncate text-[10px] text-white/60">{item.instructor.bio}</p></div>
        </div>
        <h1 className="text-lg font-bold leading-6">{item.course.title}</h1>
        <p className="mt-1 text-xs text-white/60">{item.course.categoryName} · {item.course.difficulty} · {item.course.priceKrw === 0 ? "무료" : `${item.course.priceKrw.toLocaleString()}원`}</p>
        <Link href={`/learner/courses/${item.course.courseId}`} className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-[#f4f3ef] text-sm font-bold text-[#171719]">강좌 보러 가기</Link>
        </div>
        <div className="mt-2.5 h-0.5 w-full bg-white/20"><div className="h-full bg-[#9bb5ff] transition-[width]" style={{ width: `${progress}%` }} /></div>
        <p className="mt-2 text-center text-[10px] text-white/55">위로 넘기면 다음 OT</p>
      </div>
      </>}
      {distractionFree && <button type="button" onClick={() => setDistractionFree(false)} aria-label="화면 요소 다시 표시" className="absolute inset-0 z-20 cursor-pointer bg-transparent" />}
      <button type="button" onClick={() => setDistractionFree((value) => !value)} aria-label={distractionFree ? "방해금지모드 해제" : "방해금지모드 켜기"} className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-30 cursor-pointer rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
        {distractionFree ? "방해금지 해제" : "방해금지"}
      </button>
    </article>
  );
}
