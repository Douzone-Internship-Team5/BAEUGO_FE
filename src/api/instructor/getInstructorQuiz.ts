import api from "@/_lib/fetcher";
import type { InstructorQuizDto } from "@/types/instructor";

export default async function getInstructorQuiz(courseId: number, sectionId?: number, signal?: AbortSignal) {
  const query = sectionId === undefined ? "" : `?sectionId=${sectionId}`;
  const response = await api.get<InstructorQuizDto>({ endpoint: `/instructor/courses/${courseId}/quiz${query}`, signal });
  if (!response) throw new Error("퀴즈 응답이 비어 있습니다.");
  return response.data;
}
