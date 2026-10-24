"use client";

import { useQuery } from "@tanstack/react-query";
import getInstructorQuiz from "./getInstructorQuiz";
import { instructorQueryKeys } from "./queryKeys";

export default function useInstructorQuiz(courseId: number, sectionId?: number) {
  return useQuery({ queryKey: instructorQueryKeys.quiz(courseId, sectionId), queryFn: ({ signal }) => getInstructorQuiz(courseId, sectionId, signal), enabled: Number.isInteger(courseId) && courseId > 0 });
}
