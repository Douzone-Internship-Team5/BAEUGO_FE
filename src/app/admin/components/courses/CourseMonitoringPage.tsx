"use client";

import Link from "next/link";
import { useState } from "react";
import { CourseStatusBadge } from "@/components/common";
import type { CourseStatus } from "@/constants/colors";
import { getJobCategoryName, JOB_CATEGORIES } from "../../data/categories";
import type { AdminCourse } from "../../data/courses";
import useAdminCourses from "@/api/admin/courses/useAdminCourses";

type StatusFilter = "ALL" | "PUBLISHED" | "EDITING" | "OPERATOR_HIDDEN";
type SortOption = "recent" | "enrollments";

const PAGE_SIZE = 5;

export const CourseMonitoringPage = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [categoryId, setCategoryId] = useState("ALL");
  const [sort, setSort] = useState<SortOption>("recent");
  const [page, setPage] = useState(1);

  const coursesQuery = useAdminCourses({
    q: query.trim() || undefined,
    status: status === "ALL" ? undefined : status,
    sort,
    categoryId: categoryId === "ALL" ? undefined : Number(categoryId),
    page,
    size: PAGE_SIZE,
  });
  const visibleCourses: AdminCourse[] = coursesQuery.data?.items.map((course) => ({
    courseId: course.courseId,
    title: course.title,
    instructorName: course.instructorName,
    categoryId: course.categoryId,
    jobCategory: getJobCategoryName(course.categoryId, course.jobCategory) ?? course.jobCategory,
    status: course.status,
    priceKrw: course.priceKrw,
    enrollmentCount: course.enrollmentCount,
    publishedAt: course.publishedAt ?? "",
    closedReason: course.closedReason ?? undefined,
  })) ?? [];
  const total = coursesQuery.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = page;

  const updateFilter = (update: () => void) => {
    update();
    setPage(1);
  };

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-medium tracking-[1.5px] text-accent">COURSE MANAGEMENT</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.5px]">강좌 모니터링</h1>
          <p className="mt-2 text-sm text-muted">공개 이력이 있는 강좌의 정보와 운영 상태를 확인합니다.</p>
        </div>
        <div className="flex items-center gap-2 rounded-[4px] border border-line bg-panel px-3.5 py-2.5 text-xs text-muted">
          전체 <strong className="ml-1 text-sm font-semibold text-text">{total}</strong>개
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[4px] border border-line bg-panel p-4 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">강좌명 또는 강사명 검색</span>
          <SearchIcon />
          <input
            value={query}
            onChange={(event) => updateFilter(() => setQuery(event.target.value))}
            placeholder="강좌명 또는 강사명 검색"
            maxLength={100}
            className="h-11 w-full rounded-[4px] border border-line-strong bg-bg pl-10 pr-3 text-sm text-text outline-none transition placeholder:text-dim focus:border-line-focus focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex">
          <label className="flex flex-col gap-1.5 text-[10px] text-muted">
            상태
            <select
              value={status}
              onChange={(event) => updateFilter(() => setStatus(event.target.value as StatusFilter))}
              className="h-11 min-w-32 cursor-pointer rounded-[4px] border border-line-strong bg-bg px-3 text-xs text-text outline-none focus:border-line-focus"
            >
              <option value="ALL">전체 상태</option>
              <option value="PUBLISHED">공개 중</option>
              <option value="EDITING">수정 중</option>
              <option value="OPERATOR_HIDDEN">운영자 비공개</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[10px] text-muted">
            직무
            <select
              value={categoryId}
              onChange={(event) => updateFilter(() => setCategoryId(event.target.value))}
              className="h-11 min-w-36 cursor-pointer rounded-[4px] border border-line-strong bg-bg px-3 text-xs text-text outline-none focus:border-line-focus"
            >
              <option value="ALL">전체 직무</option>
              {JOB_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[10px] text-muted">
            정렬
            <select
              value={sort}
              onChange={(event) => updateFilter(() => setSort(event.target.value as SortOption))}
              className="h-11 min-w-36 cursor-pointer rounded-[4px] border border-line-strong bg-bg px-3 text-xs text-text outline-none focus:border-line-focus"
            >
              <option value="recent">최근 공개순</option>
              <option value="enrollments">수강생 많은 순</option>
            </select>
          </label>
        </div>
      </div>

      {coursesQuery.isError ? (
        <p role="alert" className="rounded-[4px] border border-danger-line bg-danger-bg p-5 text-sm text-danger">강좌 목록을 불러오지 못했습니다. {coursesQuery.error.message}</p>
      ) : coursesQuery.isPending ? (
        <div role="status" className="rounded-[4px] border border-line bg-panel p-12 text-center text-sm text-muted">강좌 목록을 불러오는 중…</div>
      ) : <CourseTable courses={visibleCourses} />}

      <div className="flex flex-col gap-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {total === 0
            ? "검색 결과가 없습니다."
            : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, total)}개 표시 / 총 ${total}개`}
        </p>
        <div className="flex items-center gap-1" aria-label="페이지 이동">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
            className="flex size-9 cursor-pointer items-center justify-center rounded-[4px] border border-line text-text-sub hover:bg-selected disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="이전 페이지"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              aria-current={number === currentPage ? "page" : undefined}
              className={`flex size-9 cursor-pointer items-center justify-center rounded-[4px] border text-xs ${number === currentPage ? "border-accent bg-success-bg text-accent" : "border-line text-muted hover:bg-selected"}`}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={currentPage === pageCount}
            className="flex size-9 cursor-pointer items-center justify-center rounded-[4px] border border-line text-text-sub hover:bg-selected disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="다음 페이지"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

interface CourseTableProps {
  courses: AdminCourse[];
}

const CourseTable = ({ courses }: CourseTableProps) => (
  <div className="overflow-hidden rounded-[4px] border border-line bg-panel">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-card text-[10px] font-medium tracking-[0.5px] text-muted">
            <th className="px-5 py-3.5">강좌 정보</th>
            <th className="px-4 py-3.5">직무</th>
            <th className="px-4 py-3.5 text-right">가격</th>
            <th className="px-4 py-3.5 text-right">수강생</th>
            <th className="px-4 py-3.5">공개일</th>
            <th className="px-5 py-3.5">상태</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {courses.map((course) => <CourseRow key={course.courseId} course={course} />)}
          {courses.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-16 text-center text-sm text-muted">
                조건에 맞는 강좌가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

interface CourseRowProps {
  course: AdminCourse;
}

const CourseRow = ({ course }: CourseRowProps) => (
  <tr className="group transition-colors hover:bg-card/70">
    <td className="px-5 py-4">
      <Link href={`/admin/courses/${course.courseId}`} className="block min-w-0 cursor-pointer">
        <span className="block max-w-[380px] truncate text-[13px] font-medium text-text group-hover:text-accent">
          {course.title}
        </span>
        <span className="mt-1.5 block text-xs text-muted">{course.instructorName} 강사 · #{course.courseId}</span>
      </Link>
      {course.status === "OPERATOR_HIDDEN" && course.closedReason && (
        <p className="mt-2 max-w-[380px] truncate text-[11px] text-danger">비공개 사유 · {course.closedReason}</p>
      )}
    </td>
    <td className="px-4 py-4 text-xs text-text-sub">{course.jobCategory}</td>
    <td className="px-4 py-4 text-right text-xs tabular-nums text-text-sub">{formatKrw(course.priceKrw)}</td>
    <td className="px-4 py-4 text-right text-xs tabular-nums text-text-sub">{course.enrollmentCount.toLocaleString("ko-KR")}</td>
    <td className="px-4 py-4 text-xs tabular-nums text-muted">{formatDate(course.publishedAt)}</td>
    <td className="px-5 py-4"><StatusBadge status={course.status} /></td>
  </tr>
);

interface StatusBadgeProps {
  status: Extract<CourseStatus, "PUBLISHED" | "EDITING" | "OPERATOR_HIDDEN">;
}

const StatusBadge = ({ status }: StatusBadgeProps) => <CourseStatusBadge status={status} />;

const formatKrw = (value: number) => `${value.toLocaleString("ko-KR")}원`;

const formatDate = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .format(date)
    .replaceAll(". ", ".")
    .replace(/\.$/, "");
};

const SearchIcon = () => (
  <svg
    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dim"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="10.8" cy="10.8" r="6.8" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);
