import api from "@/_lib/fetcher";
import type { CourseSearchDto } from "@/types/learning";

export interface CourseSearchParams { q?: string; categoryId?: number; topicId?: number; price?: "free" | "paid"; sort?: "popular" | "latest" | "difficulty" | "recommended" }
export default async function searchCourses(params: CourseSearchParams = {}, signal?: AbortSignal) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value) query.set(key, value); });
  query.set("size", "50");
  const response = await api.get<CourseSearchDto>({ endpoint: `/courses?${query}`, signal });
  if (!response) throw new Error("강좌 목록 응답이 비어 있습니다.");
  return response.data;
}
