import api from "@/_lib/fetcher";
import type { QuizAttemptCancelDto } from "@/types/learning";
export default async function postQuizAttemptCancel(attemptId: number) {
  const response = await api.post<QuizAttemptCancelDto>({ endpoint: `/quiz-attempts/${attemptId}/cancel` });
  if (!response) throw new Error("퀴즈 응시 취소 응답이 비어 있습니다.");
  return response.data;
}
