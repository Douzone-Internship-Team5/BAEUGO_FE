import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InstructorCourseDetailPage } from "../../components/courses/InstructorCourseDetailPage";
import { getInstructorCourse } from "../../data/courses";

interface Props {
  params: Promise<{ courseId: string }>;
}

export const metadata: Metadata = {
  title: "강좌 관리",
};

export default async function InstructorCourseRoute({ params }: Props) {
  const { courseId } = await params;
  const course = getInstructorCourse(Number(courseId));
  if (!course) notFound();

  return <InstructorCourseDetailPage course={course} />;
}
