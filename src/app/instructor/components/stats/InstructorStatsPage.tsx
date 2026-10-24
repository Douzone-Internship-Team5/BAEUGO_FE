"use client";

import { useState } from "react";
import { INSTRUCTOR_COURSES } from "../../data/courses";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";
import { StudioHeader } from "../shared/InstructorScreenHeader";

type Metric = "조회수" | "신규 수강생" | "예상 매출";
interface Props { className?: string }

const METRICS: Array<{ label: string; value: string; change: string }> = [
  { label: "공개 강좌", value: "2개", change: "지난달 대비 +1" },
  { label: "강의 조회수", value: "2,906회", change: "지난달 대비 +12%" },
  { label: "신규 수강생", value: "34명", change: "지난달 대비 +8%" },
  { label: "예상 매출", value: "1,240,000원", change: "지난달 대비 +5%" },
  { label: "퀴즈 응답률", value: "78%", change: "지난달 대비 +3%" },
  { label: "퀴즈 정답률", value: "82%", change: "지난달 대비 +2%" },
];

export const InstructorStatsPage = ({ className = "" }: Props) => {
  const [metric, setMetric] = useState<Metric>("조회수");
  const [courseId, setCourseId] = useState("all");
  const bars = metric === "조회수" ? [26, 38, 32, 48, 41, 66, 54, 72, 63, 88, 74, 96] : metric === "신규 수강생" ? [18, 24, 28, 20, 35, 42, 36, 50, 46, 58, 68, 82] : [15, 22, 20, 34, 30, 42, 48, 45, 61, 64, 80, 91];
  return <div className={`min-h-dvh pb-20 ${className}`}>
    <StudioHeader />
    <main className="mx-auto max-w-5xl px-4 pt-5 md:px-8 md:pt-8">
      <div className="flex items-end justify-between"><div><h1 className="text-xl font-medium">통계</h1><p className="mt-1.5 text-xs text-muted">2026년 10월</p></div><select aria-label="통계 강좌 선택" value={courseId} onChange={(event) => setCourseId(event.target.value)} className="h-9 max-w-36 rounded-[4px] border border-line bg-panel px-2 text-[11px] text-text-sub"><option value="all">전체 강좌</option>{INSTRUCTOR_COURSES.map((course) => <option key={course.courseId} value={course.courseId}>{course.title}</option>)}</select></div>
      <section aria-label="주요 지표" className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-3">{METRICS.map((item) => <article key={item.label} className="rounded-[4px] border border-line bg-panel p-3.5"><p className="text-[10px] text-muted">{item.label}</p><p className="mt-2 text-[17px] font-medium tabular-nums md:text-xl">{item.value}</p><p className="mt-1.5 text-[9px] text-accent">{item.change}</p></article>)}</section>
      <section className="mt-7 rounded-[4px] border border-line bg-panel p-4 md:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-medium">월간 추이</h2><div className="flex gap-3">{(["조회수", "신규 수강생", "예상 매출"] as Metric[]).map((item) => <button key={item} type="button" aria-pressed={metric === item} onClick={() => setMetric(item)} className={`cursor-pointer text-[10px] ${metric === item ? "text-accent" : "text-muted"}`}>{item}</button>)}</div></div><div className="mt-5 flex h-40 items-end justify-between gap-1 border-b border-line px-1">{bars.map((height, index) => <div key={index} className="flex h-full flex-1 items-end justify-center"><div className={`w-full max-w-7 rounded-t-[2px] ${index === 11 ? "bg-accent" : "bg-selected"}`} style={{ height: `${height}%` }} title={`${index + 1}월 ${metric}`} /></div>)}</div><div className="mt-2 flex justify-between text-[9px] text-dim"><span>1월</span><span>4월</span><span>7월</span><span>10월</span></div></section>
      <section className="mt-7"><h2 className="text-sm font-medium">강좌별 통계</h2><div className="mt-3 divide-y divide-line border-y border-line">{INSTRUCTOR_COURSES.filter((course) => courseId === "all" || String(course.courseId) === courseId).map((course) => <article key={course.courseId} className="flex items-center justify-between gap-3 py-4"><div className="min-w-0"><h3 className="truncate text-xs font-medium">{course.title}</h3><p className="mt-1 text-[10px] text-muted">수강생 {course.enrollmentCount}명</p></div><div className="shrink-0 text-right"><strong className="block text-xs tabular-nums">{course.lessonViews.toLocaleString("ko-KR")}회</strong><span className="mt-1 block text-[10px] text-muted">조회수</span></div></article>)}</div></section>
      <p className="mt-6 text-[10px] text-dim">통계는 예시 데이터입니다. 실제 값은 강사 통계 API 연동 후 표시됩니다.</p>
    </main><InstructorMobileNav active="stats" />
  </div>;
};
