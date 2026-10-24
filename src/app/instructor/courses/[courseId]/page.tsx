import { Suspense } from "react";
import type { Metadata } from "next";
import { InstructorCourseDetailPage } from "../../components/courses/InstructorCourseDetailPage";

interface Props {
  params: Promise<{ courseId: string }>;
}

export const metadata: Metadata = {
  title: "강좌 관리",
};

export default async function InstructorCourseRoute({ params }: Props) {
  return <Suspense fallback={<div role="status" className="p-6 text-sm text-muted">강좌 정보를 불러오는 중입니다.</div>}><InstructorCourseRouteContent params={params} /></Suspense>;
}

async function InstructorCourseRouteContent({ params }: Props) {
  const { courseId } = await params;
  return <InstructorCourseDetailPage courseId={Number(courseId)} />;
}
