import api from "@/_lib/fetcher";
import type { AdminUnpublishRequest, AdminUnpublishResponse } from "@/types/admin";

export default async function postAdminCourseUnpublish(courseId: number, body: AdminUnpublishRequest) {
  const response = await api.post<AdminUnpublishResponse>({
    endpoint: `/admin/courses/${courseId}/unpublish`,
    body: { reason: body.reason },
  });
  if (!response) throw new Error("강좌 비공개 응답이 비어 있습니다.");
  return response.data;
}
