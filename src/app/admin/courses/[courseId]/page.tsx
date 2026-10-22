import { notFound } from "next/navigation";
import { CourseDetailPage } from "../../components/courses/CourseDetailPage";
import { getAdminCourseDetail } from "../../data/courseDetails";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function AdminCourseDetailRoute({ params }: Props) {
  const { courseId } = await params;
  const detail = getAdminCourseDetail(Number(courseId));

  if (!detail) notFound();

  return <CourseDetailPage initialDetail={detail} />;
}
