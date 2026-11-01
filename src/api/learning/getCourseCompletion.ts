import api from "@/_lib/fetcher";
import type { CourseCompletionDto } from "@/types/learning";
export default async function getCourseCompletion(courseId: number, signal?: AbortSignal) {
  const response = await api.get<CourseCompletionDto>({ endpoint: `/courses/${courseId}/completion`, signal });
  if (!response) throw new Error("수료 여부 응답이 비어 있습니다.");
  return response.data;
}
