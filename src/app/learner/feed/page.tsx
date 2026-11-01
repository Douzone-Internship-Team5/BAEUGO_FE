"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/common";
import useFeed from "@/api/learning/useFeed";
import useVideoLike from "@/api/learning/useVideoLike";
import useVideoUnlike from "@/api/learning/useVideoUnlike";

export default function FeedPage() {
  const feed = useFeed();
  const [index, setIndex] = useState(0);
  const item = feed.data?.items[index];
  const like = useVideoLike(item?.videoId ?? 0);
  const unlike = useVideoUnlike(item?.videoId ?? 0);
  if (feed.isLoading) return <main className="p-8 text-center text-sm text-muted">OT를 불러오는 중이에요.</main>;
  if (!item) return <main className="p-8 text-center text-sm text-muted">재생할 무료 OT가 없습니다.</main>;
  const liked = item.isLiked;
  const toggleLike = () => (liked ? unlike.mutate() : like.mutate());
  return <main className="relative flex min-h-dvh flex-col bg-[linear-gradient(180deg,#283246,#111316_55%)] px-5 pb-6 pt-4">
    <header className="flex items-center justify-between"><Link href="/learner" aria-label="닫기" className="text-xl">×</Link><span className="text-xs">무료 OT · {index + 1}/{feed.data?.items.length ?? 0}</span><button onClick={toggleLike} aria-label="좋아요" className="text-xl text-accent">{liked ? "♥" : "♡"}</button></header>
    <div className="flex flex-1 flex-col justify-end pb-5"><video src={item.videoUrl} controls playsInline className="mb-5 max-h-[44vh] w-full rounded-md bg-black" /><p className="mb-3 text-xs text-accent">▶ {item.viewCount.toLocaleString()}</p><h1 className="text-xl font-medium leading-8">{item.title}</h1><div className="mt-5 flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-selected">{item.instructor.name.slice(0, 1)}</span><div><p className="text-xs font-medium">{item.instructor.name}</p><p className="mt-1 text-[10px] text-muted">{item.instructor.bio}</p></div></div><div className="mt-5 rounded-[4px] border border-line bg-panel/80 p-4"><p className="text-sm font-medium">{item.course.title}</p><p className="mt-1 text-[10px] text-muted">{item.course.categoryName} · {item.course.difficulty} · {item.course.priceKrw === 0 ? "무료" : `${item.course.priceKrw.toLocaleString()}원`}</p><Link href={`/learner/courses/${item.course.courseId}`} className="mt-4 block"><Button fullWidth variant="outline">강좌 보러 가기</Button></Link></div><button type="button" onClick={() => setIndex((value) => (value + 1) % (feed.data?.items.length ?? 1))} className="mt-5 text-center text-[10px] text-muted">다음 OT 보기 ↑</button></div>
  </main>;
}
