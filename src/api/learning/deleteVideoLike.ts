import api from "@/_lib/fetcher";
import type { VideoLikeDto } from "@/types/learning";
export default async function deleteVideoLike(videoId: number) {
  const response = await api.delete<VideoLikeDto>({ endpoint: `/videos/${videoId}/like` });
  if (!response) throw new Error("좋아요 취소 응답이 비어 있습니다.");
  return response.data;
}
