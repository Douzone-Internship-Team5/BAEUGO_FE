"use client";
import { useMutation } from "@tanstack/react-query";
import postQuizAnswer from "./postQuizAnswer";
import type { QuizAnswerRequest } from "@/types/learning";
export default function useQuizAnswer(quizId: number) { return useMutation({ mutationFn: (body: QuizAnswerRequest) => postQuizAnswer(quizId, body) }); }
