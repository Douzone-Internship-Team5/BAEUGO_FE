import api from "@/_lib/fetcher";
import type { CodesDto } from "@/types/codes";
export default async function getCodes(signal?: AbortSignal) {
  const response = await api.get<CodesDto>({ endpoint: "/codes", signal });
  if (!response) throw new Error("분류 정보 응답이 비어 있습니다.");
  return response.data;
}
