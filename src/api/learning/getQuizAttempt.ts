import api from "@/_lib/fetcher";
import type { QuizAttemptDto } from "@/types/learning";
export default async function getQuizAttempt(id: number, type?: "FINAL" | "WRONG_REVIEW", questionId?: number, signal?: AbortSignal) {
  const query = new URLSearchParams();
  if (type) query.set("attemptType", type);
  if (questionId) query.set("questionId", String(questionId));
  const endpoint = type ? `/courses/${id}/quiz-attempt?${query}` : `/sections/${id}/quiz`;
  const response = await api.get<QuizAttemptDto>({ endpoint, signal });
  if (!response) throw new Error("퀴즈 응시 정보 응답이 비어 있습니다.");
  return response.data;
}
