import api from "@/_lib/fetcher";
import type { InstructorScriptDto } from "@/types/instructor";

export default async function getInstructorScript(videoId: number, signal?: AbortSignal) {
  const response = await api.get<InstructorScriptDto>({ endpoint: `/instructor/videos/${videoId}/script`, signal });
  if (!response) throw new Error("대본 응답이 비어 있습니다.");
  return response.data;
}
