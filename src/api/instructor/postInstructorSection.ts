import api from "@/_lib/fetcher";
import type { InstructorSectionDto } from "@/types/instructor";

export default async function postInstructorSection(courseId: number, title: string) {
  const response = await api.post<InstructorSectionDto>({ endpoint: "/instructor/sections", body: { courseId, title } });
  if (!response) throw new Error("섹션 생성 응답이 비어 있습니다.");
  return response.data;
}
