import api from "@/_lib/fetcher";
import type { MeDto } from "@/types/user";

export default async function getMe(signal?: AbortSignal) {
  const response = await api.get<MeDto>({ endpoint: "/users/me", signal });
  if (!response) throw new Error("내 계정 정보 응답이 비어 있습니다.");
  return response.data;
}
