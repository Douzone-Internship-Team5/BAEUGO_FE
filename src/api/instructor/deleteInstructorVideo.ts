import api from "@/_lib/fetcher";
import type { InstructorVideoDeleteDto } from "@/types/instructor";

export default async function deleteInstructorVideo(videoId: number) {
  const response = await api.delete<InstructorVideoDeleteDto>({ endpoint: `/instructor/videos/${videoId}` });
  if (!response) throw new Error("영상 삭제 응답이 비어 있습니다.");
  return response.data;
}
