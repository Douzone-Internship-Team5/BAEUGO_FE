"use client";

import { useMutation } from "@tanstack/react-query";
import patchInstructorSection from "./patchInstructorSection";
import useInvalidateInstructorCourse from "./useInvalidateInstructorCourse";

export default function useRenameInstructorSection(courseId: number) {
  const invalidate = useInvalidateInstructorCourse(courseId);
  return useMutation({ mutationFn: ({ sectionId, title }: { sectionId: number; title: string }) => patchInstructorSection(sectionId, { title }), onSuccess: invalidate });
}
