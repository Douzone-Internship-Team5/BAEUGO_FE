import api from "@/_lib/fetcher";
import type { ChangePasswordRequest } from "@/types/user";

export default async function changePassword(body: ChangePasswordRequest) {
  await api.put<void>({ endpoint: "/users/me/password", body: { ...body } });
}
