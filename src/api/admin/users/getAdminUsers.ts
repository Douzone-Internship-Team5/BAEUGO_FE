import api from "@/_lib/fetcher";
import type { AdminPage, AdminUserItemDto, AdminUsersParams } from "@/types/admin";

export default async function getAdminUsers(params: AdminUsersParams, signal?: AbortSignal) {
  const query = new URLSearchParams({ page: String(params.page), size: String(params.size) });
  if (params.q) query.set("q", params.q);
  if (params.role) query.set("role", params.role);
  const response = await api.get<AdminPage<AdminUserItemDto>>({ endpoint: `/admin/users?${query}`, signal });
  if (!response) throw new Error("회원 목록 응답이 비어 있습니다.");
  return response.data;
}
