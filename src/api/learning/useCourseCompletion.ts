"use client";
import { useQuery } from "@tanstack/react-query";
import getCourseCompletion from "./getCourseCompletion";
import { learningQueryKeys } from "./queryKeys";
export default function useCourseCompletion(courseId: number, enabled = true) {
  return useQuery({ queryKey: learningQueryKeys.completion(courseId), queryFn: ({ signal }) => getCourseCompletion(courseId, signal), enabled: enabled && Number.isInteger(courseId) && courseId > 0 });
}
