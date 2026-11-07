import api from "@/_lib/fetcher";
import type { AdminRepublishResponse } from "@/types/admin";

export default async function postAdminCourseRepublish(courseId: number) {
  const response = await api.post<AdminRepublishResponse>({
    endpoint: `/admin/courses/${courseId}/republish`,
  });
  if (!response) throw new Error("강좌 재공개 응답이 비어 있습니다.");
  return response.data;
}
