import api from "@/_lib/fetcher";
import type { VideoDetailDto } from "@/types/learning";
export default async function getVideoDetail(videoId: number, signal?: AbortSignal) {
  const response = await api.get<VideoDetailDto>({ endpoint: `/videos/${videoId}`, signal });
  if (!response) throw new Error("영상 상세 응답이 비어 있습니다.");
  return response.data;
}
