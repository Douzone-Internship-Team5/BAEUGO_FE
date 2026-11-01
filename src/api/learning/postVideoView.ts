import api from "@/_lib/fetcher";
import type { VideoViewDto, VideoViewRequest } from "@/types/learning";
export default async function postVideoView(videoId: number, body: VideoViewRequest) {
  const response = await api.post<VideoViewDto>({ endpoint: `/videos/${videoId}/views`, body: { ...body } });
  if (!response) throw new Error("조회수 기록 응답이 비어 있습니다.");
  return response.data;
}
