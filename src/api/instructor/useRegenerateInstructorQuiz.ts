"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import postRegenerateInstructorQuiz from "./postRegenerateInstructorQuiz";
import { instructorQueryKeys } from "./queryKeys";

export default function useRegenerateInstructorQuiz(courseId: number, sectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: () => postRegenerateInstructorQuiz(courseId, sectionId), onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: instructorQueryKeys.quiz(courseId, sectionId) });
  } });
}
