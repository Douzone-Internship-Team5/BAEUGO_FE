"use client";
import { useQuery } from "@tanstack/react-query";
import getQuizAttempt from "./getQuizAttempt";
export default function useQuizAttempt(id: number, type?: "FINAL" | "WRONG_REVIEW", questionId?: number) { return useQuery({ queryKey: ["learning", "quiz-attempt", id, type ?? "UNIT", questionId], queryFn: ({ signal }) => getQuizAttempt(id, type, questionId, signal), enabled: Number.isInteger(id) && id > 0, staleTime: Infinity, gcTime: 0, refetchOnWindowFocus: false, refetchOnReconnect: false }); }
