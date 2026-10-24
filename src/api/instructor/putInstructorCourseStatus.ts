import api from "@/_lib/fetcher";
import type { InstructorCourseStatus, InstructorCourseStatusResponse } from "@/types/instructor";

export default async function putInstructorCourseStatus(courseId: number, status: InstructorCourseStatus) {
  const response = await api.put<InstructorCourseStatusResponse>({ endpoint: `/instructor/courses/${courseId}/status`, body: { status } });
  if (!response) throw new Error("강좌 상태 변경 응답이 비어 있습니다.");
  return response.data;
}
