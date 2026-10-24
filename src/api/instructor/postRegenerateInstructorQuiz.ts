import api from "@/_lib/fetcher";
import type { InstructorJobResponse } from "@/types/instructor";

export default async function postRegenerateInstructorQuiz(courseId: number, sectionId: number) {
  const response = await api.post<InstructorJobResponse>({ endpoint: `/instructor/courses/${courseId}/quiz/regenerate?sectionId=${sectionId}` });
  if (!response) throw new Error("퀴즈 재생성 응답이 비어 있습니다.");
  return response.data;
}
