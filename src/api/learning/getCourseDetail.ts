import api from "@/_lib/fetcher";
import type { CourseDetailDto } from "@/types/learning";
export default async function getCourseDetail(courseId: number, signal?: AbortSignal) {
  const response = await api.get<CourseDetailDto>({ endpoint: `/courses/${courseId}`, signal });
  if (!response) throw new Error("강좌 상세 응답이 비어 있습니다.");
  return response.data;
}
