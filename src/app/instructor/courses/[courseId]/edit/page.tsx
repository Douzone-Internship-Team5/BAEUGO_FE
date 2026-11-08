import { Suspense } from "react";
import type { Metadata } from "next";
import { InstructorCourseEditPage } from "../../../components/courses/InstructorCourseEditPage";

interface Props {
  params: Promise<{ courseId: string }>;
}

export const metadata: Metadata = {
  title: "강좌 정보 수정",
};

export default async function InstructorCourseEditRoute({ params }: Props) {
  return <Suspense fallback={<div role="status" className="p-6 text-sm text-muted">강좌 정보를 불러오는 중입니다.</div>}><InstructorCourseEditRouteContent params={params} /></Suspense>;
}

async function InstructorCourseEditRouteContent({ params }: Props) {
  const { courseId } = await params;
  return <InstructorCourseEditPage courseId={Number(courseId)} />;
}
