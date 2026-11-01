import api from "@/_lib/fetcher";
import type { LikedVideoTypeFilter, MyLikesDto } from "@/types/learning";
export default async function getMyLikes(videoType?: LikedVideoTypeFilter, signal?: AbortSignal) {
  const query = videoType ? `?videoType=${encodeURIComponent(videoType)}` : "";
  const response = await api.get<MyLikesDto>({ endpoint: `/me/likes${query}`, signal });
  if (!response) throw new Error("좋아요 목록 응답이 비어 있습니다.");
  return response.data;
}
