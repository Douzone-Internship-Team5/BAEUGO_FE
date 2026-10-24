import api from "@/_lib/fetcher";
import type { InstructorCourseMutationResponse, InstructorCourseUpdateRequest } from "@/types/instructor";

export default async function patchInstructorCourse(courseId: number, body: InstructorCourseUpdateRequest) {
  const response = await api.patch<InstructorCourseMutationResponse>({ endpoint: `/instructor/courses/${courseId}`, body });
  if (!response) throw new Error("강좌 수정 응답이 비어 있습니다.");
  return response.data;
}
