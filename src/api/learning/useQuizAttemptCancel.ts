"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import postQuizAttemptCancel from "./postQuizAttemptCancel";
export default function useQuizAttemptCancel() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (attemptId: number) => postQuizAttemptCancel(attemptId), onSuccess: () => client.removeQueries({ queryKey: ["learning", "quiz-attempt"] }) });
}
