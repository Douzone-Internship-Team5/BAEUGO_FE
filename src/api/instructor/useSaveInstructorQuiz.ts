"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import putInstructorQuiz from "./putInstructorQuiz";
import { instructorQueryKeys } from "./queryKeys";
import type { InstructorQuestionDto } from "@/types/instructor";

export default function useSaveInstructorQuiz(courseId: number, sectionId?: number) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (questions: InstructorQuestionDto[]) => putInstructorQuiz(courseId, questions, sectionId), onSuccess: async () => {
    await Promise.all([queryClient.invalidateQueries({ queryKey: instructorQueryKeys.quiz(courseId, sectionId) }), queryClient.invalidateQueries({ queryKey: instructorQueryKeys.course(courseId) })]);
  } });
}
