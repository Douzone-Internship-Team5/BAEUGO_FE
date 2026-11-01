import api from "@/_lib/fetcher";
import type { FeedDto } from "@/types/learning";
export default async function getFeed(cursor?: string, signal?: AbortSignal) {
  const query = new URLSearchParams({ size: "20" });
  if (cursor) query.set("cursor", cursor);
  const response = await api.get<FeedDto>({ endpoint: `/feed/ot?${query}`, signal });
  if (!response) throw new Error("무료 OT 목록 응답이 비어 있습니다.");
  return response.data;
}
