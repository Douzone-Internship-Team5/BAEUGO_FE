import api from "@/_lib/fetcher";
import type { InstructorJobResponse } from "@/types/instructor";

export default async function postRegenerateInstructorScript(videoId: number) {
  const response = await api.post<InstructorJobResponse>({ endpoint: `/instructor/videos/${videoId}/script/regenerate` });
  if (!response) throw new Error("대본 재생성 응답이 비어 있습니다.");
  return response.data;
}
