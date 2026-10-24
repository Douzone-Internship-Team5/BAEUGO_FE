"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CourseStatusBadge } from "@/components/common";
import useInstructorCourses from "@/api/instructor/useInstructorCourses";
import { toInstructorCourse } from "@/api/instructor/toInstructorCourse";
import type { CourseStatus } from "@/constants/colors";
import { COURSE_STATUS_FILTERS } from "../../data/courses";
import type { InstructorCourse } from "../../data/courses";

type StatusFilter = "ALL" | CourseStatus;

export const InstructorCourseListPage = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const { data, error, isPending } = useInstructorCourses(status === "ALL" ? undefined : status);
  const courses = (data?.items ?? []).map(toInstructorCourse);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
    return courses.filter((course) => {
      const matchesQuery = !normalizedQuery ||
        course.title.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
        course.topic.toLocaleLowerCase("ko-KR").includes(normalizedQuery);
      return matchesQuery && (status === "ALL" || course.status === status);
    });
  }, [courses, query, status]);

  const counts = useMemo(() => courses.reduce<Record<string, number>>((result, course) => {
    result[course.status] = (result[course.status] ?? 0) + 1;
    return result;
  }, {}), [courses]);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-medium tracking-[1.5px] text-accent">COURSE MANAGEMENT</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.5px]">내 강좌</h1>
          <p className="mt-2 text-sm text-muted">강좌와 콘텐츠 준비 상태를 관리합니다.</p>
        </div>
        <div className="rounded-[4px] border border-line bg-panel px-3.5 py-2.5 text-xs text-muted">
          전체 <strong className="ml-1 text-sm font-semibold text-text">{data?.total ?? 0}</strong>개
        </div>
      </header>

      <div className="flex flex-wrap gap-2" aria-label="강좌 상태 필터">
        {COURSE_STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatus(filter.value)}
            aria-pressed={status === filter.value}
            className={`h-9 cursor-pointer rounded-full border px-3.5 text-xs transition ${status === filter.value ? "border-accent bg-success-bg text-text" : "border-line-strong text-muted hover:border-line-focus hover:text-text"}`}
          >
            {filter.label}
            {filter.value !== "ALL" && <span className="ml-1.5 tabular-nums opacity-70">{counts[filter.value] ?? 0}</span>}
          </button>
        ))}
      </div>

      <label className="relative block">
        <span className="sr-only">강좌명 또는 주제 검색</span>
        <SearchIcon />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="강좌명 또는 주제 검색"
          maxLength={100}
          className="h-11 w-full rounded-[4px] border border-line-strong bg-panel pl-10 pr-3 text-sm text-text outline-none transition placeholder:text-dim focus:border-line-focus focus:ring-2 focus:ring-accent/20"
        />
      </label>

      {isPending && <p className="py-8 text-center text-sm text-muted">강좌를 불러오는 중입니다.</p>}
      {error && <p role="alert" className="rounded border border-danger-line bg-danger-bg p-3 text-xs text-danger">{error.message}</p>}
      <Card padding="none" className="overflow-hidden border border-line">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-card text-[10px] font-medium tracking-[0.5px] text-muted">
                <th className="px-5 py-3.5">강좌 정보</th>
                <th className="px-4 py-3.5">상태</th>
                <th className="px-4 py-3.5 text-right">수강생</th>
                <th className="px-4 py-3.5 text-right">강의 영상</th>
                <th className="px-4 py-3.5 text-right">학습 조회</th>
                <th className="px-5 py-3.5 text-right">콘텐츠 처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredCourses.map((course) => <CourseRow key={course.courseId} course={course} />)}
              {filteredCourses.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-muted">조건에 맞는 강좌가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

interface CourseRowProps {
  course: InstructorCourse;
}

const CourseRow = ({ course }: CourseRowProps) => (
  <tr className="group transition-colors hover:bg-card/70">
    <td className="px-5 py-4">
      <Link href={`/instructor/courses/${course.courseId}`} className="block min-w-0 cursor-pointer">
        <span className="block max-w-[400px] truncate text-[13px] font-medium text-text transition group-hover:text-accent">{course.title}</span>
        <span className="mt-1.5 block text-xs text-muted">{course.category} · {course.topic} · {course.priceKrw.toLocaleString("ko-KR")}원</span>
      </Link>
    </td>
    <td className="px-4 py-4"><CourseStatusBadge status={course.status} /></td>
    <td className="px-4 py-4 text-right text-xs tabular-nums text-text-sub">{course.enrollmentCount.toLocaleString("ko-KR")}명</td>
    <td className="px-4 py-4 text-right text-xs tabular-nums text-text-sub">{course.lessonCount}개</td>
    <td className="px-4 py-4 text-right text-xs tabular-nums text-text-sub">{course.lessonViews.toLocaleString("ko-KR")}</td>
    <td className="px-5 py-4 text-right text-xs tabular-nums text-muted">{course.processing.completed}/{course.processing.total}</td>
  </tr>
);

const SearchIcon = () => (
  <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" />
  </svg>
);
