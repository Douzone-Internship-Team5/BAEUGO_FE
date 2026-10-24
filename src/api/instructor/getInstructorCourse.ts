import api from "@/_lib/fetcher";
import type { InstructorCourseDetailDto } from "@/types/instructor";

export default async function getInstructorCourse(courseId: number, signal?: AbortSignal) {
  const response = await api.get<InstructorCourseDetailDto>({ endpoint: `/instructor/courses/${courseId}`, signal });
  if (!response) throw new Error("강좌 상세 응답이 비어 있습니다.");
  return response.data;
}
