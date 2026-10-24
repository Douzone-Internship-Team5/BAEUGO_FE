import api from "@/_lib/fetcher";
import type { AdminUserDetailDto } from "@/types/admin";

export default async function getAdminUser(userId: number, signal?: AbortSignal) {
  const response = await api.get<AdminUserDetailDto>({ endpoint: `/admin/users/${userId}`, signal });
  if (!response) throw new Error("회원 상세 응답이 비어 있습니다.");
  return response.data;
}
