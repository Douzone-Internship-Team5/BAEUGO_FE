"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CourseStatusBadge } from "@/components/common";
import { COURSE_STATUS_FILTERS, INSTRUCTOR_COURSES } from "../../data/courses";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";
import { StudioHeader } from "../shared/InstructorScreenHeader";

type Filter = (typeof COURSE_STATUS_FILTERS)[number]["value"];

export const InstructorDashboard = () => {
  const [filter, setFilter] = useState<Filter>("ALL");
  const visibleCourses = useMemo(() => filter === "ALL" ? INSTRUCTOR_COURSES : INSTRUCTOR_COURSES.filter((course) => course.status === filter), [filter]);

  return (
    <div className="min-h-dvh pb-20 md:pb-8">
      <StudioHeader title="내 강좌" count={INSTRUCTOR_COURSES.length} />
      <main className="mx-auto max-w-5xl px-4 pt-5 md:px-8 md:pt-8">
        <section aria-label="강좌 상태" className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {COURSE_STATUS_FILTERS.slice(1).map(({ value, label }) => {
            const count = INSTRUCTOR_COURSES.filter((course) => course.status === value).length;
            return <button key={value} type="button" onClick={() => setFilter(value)} className={`cursor-pointer rounded-[4px] border p-3.5 text-left transition ${filter === value ? "border-line-focus bg-selected" : "border-line bg-panel hover:bg-card"}`}><span className="block text-[11px] text-muted">{label}</span><strong className="mt-2 block text-xl font-medium tabular-nums">{count}<span className="ml-1 text-xs font-normal text-muted">개</span></strong></button>;
          })}
        </section>
        <div className="mt-6 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex min-w-max gap-5 border-b border-line" role="tablist" aria-label="강좌 필터">
            {COURSE_STATUS_FILTERS.map((item) => <button key={item.value} type="button" role="tab" aria-selected={filter === item.value} onClick={() => setFilter(item.value)} className={`cursor-pointer border-b-2 px-0.5 pb-3 text-xs ${filter === item.value ? "border-accent text-text" : "border-transparent text-muted hover:text-text-sub"}`}>{item.label}<span className="ml-1.5 tabular-nums text-dim">{item.value === "ALL" ? INSTRUCTOR_COURSES.length : INSTRUCTOR_COURSES.filter((course) => course.status === item.value).length}</span></button>)}
          </div>
        </div>
        <section aria-label="강좌 목록" className="mt-3 divide-y divide-line">
          {visibleCourses.map((course) => <Link key={course.courseId} href={`/instructor/courses/${course.courseId}`} className="block cursor-pointer py-5 transition hover:bg-panel/50">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-[15px] font-medium leading-6">{course.title}</h2><p className="mt-1 text-[11px] text-muted">{course.enrollmentCount}명 수강 중</p></div><div className="flex shrink-0 items-center gap-2"><CourseStatusBadge status={course.status} /><span aria-hidden="true" className="text-muted">›</span></div></div>
            {course.status === "OPERATOR_HIDDEN" && <p className="mt-3 rounded-[3px] bg-danger-bg px-3 py-2 text-[11px] text-danger">운영자 검토로 비공개 처리된 강좌입니다.</p>}
            {(course.status === "DRAFT" || course.status === "EDITING") && <div className="mt-4"><div className="flex justify-between text-[10px] text-muted"><span>공개 준비</span><span className="tabular-nums">{course.processing.completed}/{course.processing.total}</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-card"><div className="h-full rounded-full bg-accent" style={{ width: `${course.processing.total ? course.processing.completed / course.processing.total * 100 : 0}%` }} /></div></div>}
          </Link>)}
          {visibleCourses.length === 0 && <p className="py-10 text-center text-sm text-muted">해당 상태의 강좌가 없습니다.</p>}
        </section>
        <p className="mt-7 text-[10px] leading-5 text-dim">화면 확인용 예시 데이터입니다. 실제 강좌 정보는 API 연동 후 표시됩니다.</p>
      </main>
      <InstructorMobileNav active="courses" />
    </div>
  );
};
