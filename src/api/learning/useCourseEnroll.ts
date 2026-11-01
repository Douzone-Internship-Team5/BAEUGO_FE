"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import postCourseEnroll from "./postCourseEnroll";
import { learningQueryKeys } from "./queryKeys";
import type { EnrollRequest } from "@/types/learning";
export default function useCourseEnroll(courseId: number) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (body?: EnrollRequest) => postCourseEnroll(courseId, body), onSuccess: async () => Promise.all([client.invalidateQueries({ queryKey: learningQueryKeys.course(courseId) }), client.invalidateQueries({ queryKey: learningQueryKeys.enrollments() })]) });
}
