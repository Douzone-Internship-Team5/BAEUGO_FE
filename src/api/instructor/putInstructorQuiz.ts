import api from "@/_lib/fetcher";
import type { InstructorQuestionDto, InstructorQuizDto } from "@/types/instructor";

export default async function putInstructorQuiz(courseId: number, questions: InstructorQuestionDto[], sectionId?: number) {
  const query = sectionId === undefined ? "" : `?sectionId=${sectionId}`;
  const response = await api.put<InstructorQuizDto>({ endpoint: `/instructor/courses/${courseId}/quiz${query}`, body: { questions } });
  if (!response) throw new Error("퀴즈 저장 응답이 비어 있습니다.");
  return response.data;
}
