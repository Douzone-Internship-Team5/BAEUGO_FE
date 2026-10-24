import api from "@/_lib/fetcher";
import type { InstructorCourseDeleteResponse } from "@/types/instructor";

export default async function deleteInstructorCourse(courseId: number) {
  const response = await api.delete<InstructorCourseDeleteResponse>({ endpoint: `/instructor/courses/${courseId}` });
  if (!response) throw new Error("강좌 삭제 응답이 비어 있습니다.");
  return response.data;
}
