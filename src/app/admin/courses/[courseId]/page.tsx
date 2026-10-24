"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import useAdminCourse from "@/api/admin/courses/useAdminCourse";
import toAdminCourseDetail from "@/api/admin/courses/toAdminCourseDetail";
import { CourseDetailPage } from "../../components/courses/CourseDetailPage";

export default function AdminCourseDetailRoute() {
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const query = useAdminCourse(courseId);

  if (query.isPending) return <DetailMessage>강좌 정보를 불러오는 중…</DetailMessage>;
  if (query.isError) return <DetailMessage isError>강좌 정보를 불러오지 못했습니다. {query.error.message}</DetailMessage>;
  return <CourseDetailPage initialDetail={toAdminCourseDetail(query.data)} />;
}

interface DetailMessageProps {
  children: ReactNode;
  isError?: boolean;
}

const DetailMessage = ({ children, isError = false }: DetailMessageProps) => (
  <p role={isError ? "alert" : "status"} className={`rounded-[4px] border p-5 text-sm ${isError ? "border-danger-line bg-danger-bg text-danger" : "border-line bg-panel text-muted"}`}>
    {children}
  </p>
);
