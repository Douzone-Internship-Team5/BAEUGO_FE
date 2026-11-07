import api from "@/_lib/fetcher";
import type { PlaybackUrlDto } from "@/types/learning";

export default async function postPlaybackUrl(videoId: number) {
  const response = await api.post<PlaybackUrlDto>({ endpoint: `/videos/${videoId}/playback-url` });
  if (!response) throw new Error("재생 URL 응답이 비어 있습니다.");
  return response.data;
}
