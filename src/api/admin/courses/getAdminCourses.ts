import api from "@/_lib/fetcher";
import type { AdminCourseItemDto, AdminCoursesParams, AdminPage } from "@/types/admin";

export default async function getAdminCourses(params: AdminCoursesParams, signal?: AbortSignal) {
  const query = new URLSearchParams({ page: String(params.page), size: String(params.size), sort: params.sort });
  if (params.q) query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  if (params.categoryId !== undefined) query.set("categoryId", String(params.categoryId));
  if (params.jobCategory) query.set("jobCategory", params.jobCategory);
  const response = await api.get<AdminPage<AdminCourseItemDto>>({ endpoint: `/admin/courses?${query}`, signal });
  if (!response) throw new Error("강좌 목록 응답이 비어 있습니다.");
  return response.data;
}
