import api from "@/_lib/fetcher";
import type { InstructorVideoMutationDto } from "@/types/instructor";

export default async function patchInstructorVideo(videoId: number, body: { title?: string; sortOrder?: number } | FormData) {
  const response = await api.patch<InstructorVideoMutationDto>({ endpoint: `/instructor/videos/${videoId}`, body });
  if (!response) throw new Error("영상 수정 응답이 비어 있습니다.");
  return response.data;
}
