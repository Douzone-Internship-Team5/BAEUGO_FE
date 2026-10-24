"use client";

import { useState } from "react";
import useInstructorCourses from "@/api/instructor/useInstructorCourses";
import useInstructorStats from "@/api/instructor/useInstructorStats";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";
import { StudioHeader } from "../shared/InstructorScreenHeader";

type Metric = "lessonViews" | "newStudents" | "expectedRevenue";
interface Props { className?: string }

const formatNumber = (value: number) => value.toLocaleString("ko-KR");
const formatChange = (value: number, suffix = "%") => `${value > 0 ? "+" : ""}${value}${suffix}`;

export const InstructorStatsPage = ({ className = "" }: Props) => {
  const [courseId, setCourseId] = useState("all");
  const [metric, setMetric] = useState<Metric>("lessonViews");
  const params = courseId === "all" ? {} : { courseId: Number(courseId) };
  const statsQuery = useInstructorStats(params);
  const coursesQuery = useInstructorCourses();
  const stats = statsQuery.data;
  const courseStats = stats?.courseStats ?? [];
  const summary = stats?.summary;
  const comparison = summary?.comparison;
  const metricLabel = metric === "lessonViews" ? "조회수" : metric === "newStudents" ? "신규 수강생" : "예상 매출";
  const daily = stats?.dailyStats ?? [];
  const bars = daily.slice(-14).map((item) => ({
    day: item.date.slice(-2),
    value: item[metric],
  }));
  const maxValue = Math.max(1, ...bars.map((item) => item.value));
  const month = stats?.period.from ? stats.period.from.slice(0, 7).replace("-", "년 ") : "이번 달";

  const metrics = [
    { label: "공개 강좌", value: `${summary?.publishedCourseCount ?? 0}개`, change: formatChange(comparison?.publishedCourseDiff ?? 0, "개") },
    { label: "강의 조회수", value: `${formatNumber(summary?.lessonViews ?? 0)}회`, change: formatChange(comparison?.lessonViewsDiffPercent ?? 0) },
    { label: "신규 수강생", value: `${formatNumber(summary?.newStudents ?? 0)}명`, change: formatChange(comparison?.newStudentsDiffPercent ?? 0) },
    { label: "예상 매출", value: `${formatNumber(summary?.expectedRevenue ?? 0)}원`, change: formatChange(comparison?.expectedRevenueDiffPercent ?? 0) },
    { label: "퀴즈 응답률", value: summary?.quizResponseRate == null ? "—" : `${summary.quizResponseRate}%`, change: formatChange(comparison?.quizResponseRateDiffPoint ?? 0, "%p") },
    { label: "퀴즈 정답률", value: summary?.quizCorrectRate == null ? "—" : `${summary.quizCorrectRate}%`, change: formatChange(comparison?.quizCorrectRateDiffPoint ?? 0, "%p") },
  ];

  return <div className={`min-h-dvh pb-20 ${className}`}>
    <StudioHeader />
    <main className="mx-auto max-w-5xl px-4 pt-5 md:px-8 md:pt-8">
      <div className="flex items-end justify-between"><div><h1 className="text-xl font-medium">통계</h1><p className="mt-1.5 text-xs text-muted">{month}월</p></div><select aria-label="통계 강좌 선택" value={courseId} onChange={(event) => setCourseId(event.target.value)} className="h-9 max-w-36 rounded-[4px] border border-line bg-panel px-2 text-[11px] text-text-sub"><option value="all">전체 강좌</option>{(coursesQuery.data?.items ?? []).map((course) => <option key={course.courseId} value={course.courseId}>{course.title}</option>)}</select></div>
      {statsQuery.isPending && <p className="mt-5 text-sm text-muted">통계를 불러오는 중입니다.</p>}
      {statsQuery.error && <p role="alert" className="mt-5 rounded border border-danger-line bg-danger-bg p-3 text-xs text-danger">{statsQuery.error.message}</p>}
      {statsQuery.data && <>
        <section aria-label="주요 지표" className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-3">{metrics.map((item) => <article key={item.label} className="rounded-[4px] border border-line bg-panel p-3.5"><p className="text-[10px] text-muted">{item.label}</p><p className="mt-2 text-[17px] font-medium tabular-nums md:text-xl">{item.value}</p><p className="mt-1.5 text-[9px] text-accent">지난달 대비 {item.change}</p></article>)}</section>
        <section className="mt-7 rounded-[4px] border border-line bg-panel p-4 md:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-medium">일별 추이</h2><div className="flex gap-3">{([{ key: "lessonViews", label: "조회수" }, { key: "newStudents", label: "신규 수강생" }, { key: "expectedRevenue", label: "예상 매출" }] as Array<{ key: Metric; label: string }>).map((item) => <button key={item.key} type="button" aria-pressed={metric === item.key} onClick={() => setMetric(item.key)} className={`cursor-pointer text-[10px] ${metric === item.key ? "text-accent" : "text-muted"}`}>{item.label}</button>)}</div></div>{bars.length ? <><div className="mt-5 flex h-40 items-end justify-between gap-1 overflow-x-auto border-b border-line px-1">{bars.map((item) => <div key={item.day} className="flex h-full min-w-4 flex-1 items-end justify-center"><div className="w-full max-w-7 rounded-t-[2px] bg-accent" style={{ height: `${Math.max(3, item.value / maxValue * 100)}%` }} title={`${item.day}일 · ${formatNumber(item.value)} ${metricLabel}`} /></div>)}</div><div className="mt-2 flex justify-between text-[9px] text-dim"><span>{bars[0]?.day}일</span><span>{bars[Math.floor(bars.length / 2)]?.day}일</span><span>{bars.at(-1)?.day}일</span></div></> : <p className="py-12 text-center text-xs text-muted">표시할 일별 통계가 없습니다.</p>}</section>
        <section className="mt-7"><h2 className="text-sm font-medium">강좌별 통계</h2><div className="mt-3 divide-y divide-line border-y border-line">{courseStats.filter((course) => courseId === "all" || String(course.courseId) === courseId).map((course) => <article key={course.courseId} className="flex items-center justify-between gap-3 py-4"><div className="min-w-0"><h3 className="truncate text-xs font-medium">{course.title}</h3><p className="mt-1 text-[10px] text-muted">신규 수강생 {course.newStudents}명</p></div><div className="shrink-0 text-right"><strong className="block text-xs tabular-nums">{formatNumber(course.lessonViews)}회</strong><span className="mt-1 block text-[10px] text-muted">조회수 · 매출 {formatNumber(course.expectedRevenue)}원</span></div></article>)}{courseStats.length === 0 && <p className="py-8 text-center text-xs text-muted">통계가 있는 강좌가 없습니다.</p>}</div></section>
      </>}
    </main><InstructorMobileNav active="stats" />
  </div>;
};
