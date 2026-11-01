"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/common";
import { course } from "../data";

export default function FeedPage() {
  const [liked, setLiked] = useState(false);
  return <main className="relative flex min-h-dvh flex-col bg-[linear-gradient(180deg,#283246,#111316_55%)] px-5 pb-6 pt-4">
    <header className="flex items-center justify-between"><Link href="/learner" aria-label="닫기" className="text-xl">×</Link><span className="text-xs">무료 OT</span><button onClick={() => setLiked(!liked)} aria-label="좋아요" className="text-xl text-accent">{liked ? "♥" : "♡"}</button></header>
    <div className="flex flex-1 flex-col justify-end pb-5"><p className="mb-3 text-xs text-accent">▶ 1,248</p><h1 className="text-xl font-medium leading-8">보고서는 결론부터 쓰세요.<br />읽는 사람은 바쁩니다.</h1><div className="mt-5 flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-selected">이</span><div><p className="text-xs font-medium">{course.instructor}</p><p className="mt-1 text-[10px] text-muted">{course.bio}</p></div></div><div className="mt-5 rounded-[4px] border border-line bg-panel/80 p-4"><p className="text-sm font-medium">{course.title}</p><p className="mt-1 text-[10px] text-muted">기획·PM · 초급 · 29,000원</p><Link href="/learner/courses/course-1" className="mt-4 block"><Button fullWidth variant="outline">강좌 보러 가기</Button></Link></div><p className="mt-5 text-center text-[10px] text-muted">위로 넘기면 다음 OT <span aria-hidden="true">↑</span></p></div>
  </main>;
}
