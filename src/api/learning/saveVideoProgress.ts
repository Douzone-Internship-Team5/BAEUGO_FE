import api from "@/_lib/fetcher";
import type { VideoProgressDto, VideoProgressRequest } from "@/types/learning";
export default async function saveVideoProgress(videoId: number, body: VideoProgressRequest) {
  const response = await api.put<VideoProgressDto>({ endpoint: `/videos/${videoId}/progress`, body: { ...body, activitySession: { ...body.activitySession } } });
  if (!response) throw new Error("학습 진도 저장 응답이 비어 있습니다.");
  return response.data;
}
