import api from "@/_lib/fetcher";
import type { QuizAnswerDto, QuizAnswerRequest } from "@/types/learning";
export default async function postQuizAnswer(quizId: number, body: QuizAnswerRequest) {
  const response = await api.post<QuizAnswerDto>({ endpoint: `/quizzes/${quizId}/answers`, body: { ...body, activitySession: { ...body.activitySession } } });
  if (!response) throw new Error("답안 제출 응답이 비어 있습니다.");
  return response.data;
}
