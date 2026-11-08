"use client";

import { useMutation } from "@tanstack/react-query";
import type { InstructorCourseUpdateRequest } from "@/types/instructor";
import patchInstructorCourse from "./patchInstructorCourse";
import useInvalidateInstructorCourse from "./useInvalidateInstructorCourse";

export default function useUpdateInstructorCourse(courseId: number) {
  const invalidate = useInvalidateInstructorCourse(courseId);
  return useMutation({
    mutationFn: ({ body, thumbnail }: { body: InstructorCourseUpdateRequest; thumbnail?: File | null }) => patchInstructorCourse(courseId, body, thumbnail),
    onSuccess: invalidate,
  });
}
