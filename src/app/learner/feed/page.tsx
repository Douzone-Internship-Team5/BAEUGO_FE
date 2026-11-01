"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { FeedDto } from "@/types/learning";
import useFeed from "@/api/learning/useFeed";
import useVideoLike from "@/api/learning/useVideoLike";
import useVideoUnlike from "@/api/learning/useVideoUnlike";
import useVideoView from "@/api/learning/useVideoView";

type FeedItem = FeedDto["items"][number];

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
    <main ref={scrollRef} className="mx-auto h-dvh w-full max-w-[430px] snap-y snap-mandatory overflow-y-auto overscroll-y-contain bg-black text-white">
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
  const [active, setActive] = useState(false);
  const [liked, setLiked] = useState(item.isLiked);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
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
  }, [active]);

  const toggleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    const mutation = nextLiked ? like : unlike;
    mutation.mutate(undefined, { onError: () => setLiked(!nextLiked) });
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
        src={item.videoUrl}
        poster={item.thumbnailUrl ?? undefined}
        autoPlay
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onClick={togglePlayback}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (!viewedRef.current && video.currentTime >= 3) {
            viewedRef.current = true;
            view.mutate({ playedSeconds: Math.floor(video.currentTime) });
          }
        }}
        className="absolute inset-0 size-full cursor-pointer object-contain"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link href="/learner" aria-label="닫기" className="cursor-pointer text-2xl leading-none">×</Link>
        <span className="text-xs font-medium">무료 OT · {index + 1}</span>
        <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "소리 켜기" : "소리 끄기"} className="cursor-pointer rounded-full bg-black/40 px-3 py-2 text-xs">{muted ? "음소거" : "소리 켬"}</button>
      </header>
      {!playing && <button type="button" onClick={togglePlayback} aria-label="재생" className="absolute left-1/2 top-1/2 z-10 grid size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/45 text-2xl">▶</button>}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end gap-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs text-white/80">▶ {item.viewCount.toLocaleString()}회</p>
          <h1 className="text-lg font-semibold leading-7">{item.title}</h1>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm">{item.instructor.name.slice(0, 1)}</span>
            <div className="min-w-0"><p className="text-xs font-medium">{item.instructor.name}</p><p className="truncate text-[10px] text-white/65">{item.instructor.bio}</p></div>
          </div>
          <div className="mt-4 rounded-xl border border-white/15 bg-black/45 p-3 backdrop-blur-sm">
            <p className="truncate text-sm font-semibold">{item.course.title}</p>
            <p className="mt-1 text-[10px] text-white/65">{item.course.categoryName} · {item.course.difficulty} · {item.course.priceKrw === 0 ? "무료" : `${item.course.priceKrw.toLocaleString()}원`}</p>
            <Link href={`/learner/courses/${item.course.courseId}`} className="mt-3 inline-flex cursor-pointer text-xs font-medium text-white underline underline-offset-4">강좌 보러 가기 →</Link>
          </div>
        </div>
        <button type="button" onClick={toggleLike} aria-label={liked ? "좋아요 취소" : "좋아요"} className="mb-2 flex shrink-0 cursor-pointer flex-col items-center gap-1 text-2xl text-white drop-shadow"><span>{liked ? "♥" : "♡"}</span><span className="text-[10px]">{item.likeCount + (liked === item.isLiked ? 0 : liked ? 1 : -1)}</span></button>
      </div>
    </article>
  );
}
