import api from "@/_lib/fetcher";
import type { InstructorSectionDto } from "@/types/instructor";

export default async function patchInstructorSection(sectionId: number, body: { title?: string; sortOrder?: number }) {
  const response = await api.patch<InstructorSectionDto>({ endpoint: `/instructor/sections/${sectionId}`, body });
  if (!response) throw new Error("섹션 수정 응답이 비어 있습니다.");
  return response.data;
}
