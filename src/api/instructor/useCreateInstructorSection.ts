"use client";

import { useMutation } from "@tanstack/react-query";
import postInstructorSection from "./postInstructorSection";
import useInvalidateInstructorCourse from "./useInvalidateInstructorCourse";

export default function useCreateInstructorSection(courseId: number) {
  const invalidate = useInvalidateInstructorCourse(courseId);
  return useMutation({ mutationFn: (title: string) => postInstructorSection(courseId, title), onSuccess: invalidate });
}
