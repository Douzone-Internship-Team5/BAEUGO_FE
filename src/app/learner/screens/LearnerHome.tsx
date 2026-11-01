"use client";

import Link from "next/link";
import { Card } from "@/components/common";
import { BrandHeader } from "../components/shared/LearnerHeader";
import { CourseTile, ProgressBar, SectionTitle } from "../components/shared/LearnerUI";
import { myCourses, recommendations } from "../data";

export function LearnerHome() {
  return <>
    <BrandHeader right={<Link href="/learner/attendance" className="flex h-11 items-center gap-2 text-xs text-text-sub"><span className="size-1.5 rounded-full bg-accent" />4일 연속</Link>} />
    <main className="space-y-7 px-5 pb-8 pt-2">
      <section><p className="text-[13px] text-muted">김배우님, 출근길이네요</p><h1 className="mt-1 text-[23px] font-medium leading-8">오늘 <span className="text-accent">10분</span>만 더 보면<br />목표 달성이에요</h1></section>
      <Card padding="md" className="border border-line bg-panel">
        <div className="flex items-center justify-between"><div><p className="text-[13px] font-medium">오늘 학습</p><p className="mt-1 text-[10px] text-muted">목표 20분</p></div><p className="text-xl font-medium tabular-nums">10<span className="ml-1 text-xs font-normal text-muted">분 20초</span></p></div>
        <div className="mt-4 flex items-center gap-3"><ProgressBar value={52} className="flex-1" /><span className="text-xs text-accent">52%</span></div>
        <div className="mt-4 flex justify-between border-t border-line pt-3 text-[10px] text-muted"><span>선호 시간대 08:00–09:00</span><span>출석까지 9분 40초</span></div>
      </Card>
      <section><SectionTitle href="/learner/library">이어서 학습</SectionTitle><div className="space-y-2.5">{myCourses.slice(0, 2).map((item) => <Link key={item.title} href={item.pct === 100 ? "/learner/library/quiz" : "/learner/learn/lesson-2"}><Card padding="md" className="border border-line bg-panel"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-medium">{item.title}</p><p className="mt-1 text-[11px] text-muted">{item.last}</p></div><span className="text-[10px] text-accent">{item.pct}%</span></div><ProgressBar value={item.pct} className="mt-3" /></Card></Link>)}</div></section>
      <section><SectionTitle href="/learner/explore" linkLabel="더 보기">남은 10분에 딱 맞는 숏폼</SectionTitle><div className="flex gap-3 overflow-x-auto pb-1">{recommendations.map((item) => <Link key={item.title} href={item.href} className="w-[220px] shrink-0"><CourseTile title={item.title} meta={`${item.tag} · ${item.duration}`} /></Link>)}</div></section>
      <Link href="/learner/feed" className="block"><Card padding="md" className="flex items-center justify-between border border-line bg-card"><div><p className="text-sm font-medium">무료 OT 둘러보기</p><p className="mt-1 text-[11px] text-muted">관심 주제 순으로 넘겨 보세요</p></div><span className="text-xl text-accent">→</span></Card></Link>
    </main>
  </>;
}
