import api from "@/_lib/fetcher";
import type { InstructorSectionDeleteDto } from "@/types/instructor";

export default async function deleteInstructorSection(sectionId: number) {
  const response = await api.delete<InstructorSectionDeleteDto>({ endpoint: `/instructor/sections/${sectionId}` });
  if (!response) throw new Error("섹션 삭제 응답이 비어 있습니다.");
  return response.data;
}
