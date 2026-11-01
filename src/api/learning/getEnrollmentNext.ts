import api from "@/_lib/fetcher";
import type { EnrollmentNextDto } from "@/types/learning";
export default async function getEnrollmentNext(enrollmentId: number, signal?: AbortSignal) {
  const response = await api.get<EnrollmentNextDto>({ endpoint: `/enrollments/${enrollmentId}/next`, signal });
  if (!response) throw new Error("이어가기 응답이 비어 있습니다.");
  return response.data;
}
