import api from "@/_lib/fetcher";
import type { AdminCourseDetailDto } from "@/types/admin";

export default async function getAdminCourse(courseId: number, signal?: AbortSignal) {
  const response = await api.get<AdminCourseDetailDto>({ endpoint: `/admin/courses/${courseId}`, signal });
  if (!response) throw new Error("강좌 상세 응답이 비어 있습니다.");
  return response.data;
}
