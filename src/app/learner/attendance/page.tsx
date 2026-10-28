"use client";

import { useState } from "react";
import { Card, Header } from "@/components/common";
import { Stat } from "../components/shared/LearnerUI";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export default function AttendancePage() {
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const attended = new Set([1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13]);
  const changeMonth = (step: number) => setMonth(new Date(year, monthIndex + step, 1));
  return <>
    <Header title="출석 · 목표 달성" backHref="/learner" bordered className="px-5" />
    <main className="space-y-5 px-5 py-5">
      <div className="flex gap-2"><Stat label="연속 출석" value="4일" /><Stat label="최장 기록" value="12일" /><Stat label="이번 달" value="11일" /></div>
      <Card padding="md" className="border border-line bg-panel">
        <div className="flex items-center justify-between"><button type="button" onClick={() => changeMonth(-1)} aria-label="이전 달" className="size-9 text-xl text-muted">‹</button><h1 className="text-sm font-medium">{year}년 {monthIndex + 1}월</h1><button type="button" onClick={() => changeMonth(1)} aria-label="다음 달" className="size-9 text-xl text-muted">›</button></div>
        <div className="mt-4 grid grid-cols-7 text-center">{weekdays.map((day) => <span key={day} className="py-2 text-[10px] text-muted">{day}</span>)}{Array.from({ length: firstDay }, (_, i) => <span key={`empty-${i}`} />)}{Array.from({ length: daysInMonth }, (_, i) => { const day = i + 1; const present = attended.has(day); return <span key={day} className="flex aspect-square items-center justify-center"><span className={`flex size-8 items-center justify-center rounded-full text-xs ${present ? "bg-success-soft-bg text-success" : "text-text-sub"}`}>{present ? "✓" : day}</span></span>; })}</div>
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[10px] text-muted"><span className="size-2 rounded-full bg-success" />목표 달성(출석)<span className="ml-auto text-text-sub">오늘</span></div>
      </Card>
      <Card padding="md" className="border border-accent/30 bg-selected"><div className="flex items-center justify-between"><div><p className="text-xs font-medium">10월 28일 (오늘)</p><p className="mt-1.5 text-[10px] text-muted">10분 20초 / 20분</p></div><span className="text-lg text-accent">◷</span></div><p className="mt-4 border-t border-line pt-3 text-[10px] text-accent">9분 40초 더 하면 5일 연속 출석이에요</p></Card>
    </main>
  </>;
}
