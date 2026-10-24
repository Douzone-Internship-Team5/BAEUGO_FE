import api from "@/_lib/fetcher";
import type { InstructorScriptDto, InstructorScriptSegmentDto } from "@/types/instructor";

export default async function putInstructorScript(videoId: number, segments: InstructorScriptSegmentDto[]) {
  const response = await api.put<InstructorScriptDto>({ endpoint: `/instructor/videos/${videoId}/script`, body: { segments } });
  if (!response) throw new Error("대본 저장 응답이 비어 있습니다.");
  return response.data;
}
