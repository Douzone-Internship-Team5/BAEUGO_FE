"use client";

import { useMutation } from "@tanstack/react-query";
import deleteInstructorSection from "./deleteInstructorSection";
import useInvalidateInstructorCourse from "./useInvalidateInstructorCourse";

export default function useDeleteInstructorSection(courseId: number) {
  const invalidate = useInvalidateInstructorCourse(courseId);
  return useMutation({ mutationFn: (sectionId: number) => deleteInstructorSection(sectionId), onSuccess: invalidate });
}
