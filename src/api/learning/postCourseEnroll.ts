import api from "@/_lib/fetcher";
import type { EnrollDto, EnrollRequest } from "@/types/learning";
export default async function postCourseEnroll(courseId: number, body?: EnrollRequest) {
  const response = await api.post<EnrollDto>({ endpoint: `/courses/${courseId}/enroll`, body: body ? { ...body } : undefined });
  if (!response) throw new Error("수강 등록 응답이 비어 있습니다.");
  return response.data;
}
