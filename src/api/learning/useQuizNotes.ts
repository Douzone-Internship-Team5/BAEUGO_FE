"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/_lib/fetcher";
import type { QuizNotesDto } from "@/types/learning";

export type QuizNoteStatus = "ALL" | "REVIEW_NEEDED" | "CORRECT";

/** 오답노트(Q-4). 다른 화면과 같은 queryKey를 써서 답안 제출 후 함께 갱신된다. */
export default function useQuizNotes(status: QuizNoteStatus, enabled = true) {
  return useQuery({
    queryKey: ["learning", "quiz-notes", status],
    enabled,
    queryFn: async ({ signal }) => {
      const response = await api.get<QuizNotesDto>({ endpoint: `/me/quiz-notes?status=${status}`, signal });
      if (!response) throw new Error("오답노트 응답이 비어 있습니다.");
      return response.data;
    },
  });
}
