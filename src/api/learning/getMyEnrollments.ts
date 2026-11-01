import api from "@/_lib/fetcher";
import type { EnrollmentStatusFilter, MyEnrollmentsDto } from "@/types/learning";
export default async function getMyEnrollments(status?: EnrollmentStatusFilter, signal?: AbortSignal) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const response = await api.get<MyEnrollmentsDto>({ endpoint: `/me/enrollments${query}`, signal });
  if (!response) throw new Error("내 강좌 목록 응답이 비어 있습니다.");
  return response.data;
}
