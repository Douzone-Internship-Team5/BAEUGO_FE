"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import postInstructorCourse from "./postInstructorCourse";
import { instructorQueryKeys } from "./queryKeys";
import type { InstructorCourseCreateRequest } from "@/types/instructor";

export default function useCreateInstructorCourse() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: { body: InstructorCourseCreateRequest; thumbnail?: File | null }) => postInstructorCourse(input), onSuccess: () => queryClient.invalidateQueries({ queryKey: instructorQueryKeys.courseLists() }) });
}
