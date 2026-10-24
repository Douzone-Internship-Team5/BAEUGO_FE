"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import putInstructorCourseStatus from "./putInstructorCourseStatus";
import { instructorQueryKeys } from "./queryKeys";
import type { InstructorCourseStatus } from "@/types/instructor";

export default function useInstructorCourseStatus(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (status: InstructorCourseStatus) => putInstructorCourseStatus(courseId, status), onSuccess: async () => {
    await Promise.all([queryClient.invalidateQueries({ queryKey: instructorQueryKeys.course(courseId) }), queryClient.invalidateQueries({ queryKey: instructorQueryKeys.courseLists() })]);
  } });
}
