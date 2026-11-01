"use client";
import { useQuery } from "@tanstack/react-query";
import getCourseDetail from "./getCourseDetail";
import { learningQueryKeys } from "./queryKeys";
export default function useCourseDetail(courseId: number) {
  return useQuery({ queryKey: learningQueryKeys.course(courseId), queryFn: ({ signal }) => getCourseDetail(courseId, signal), enabled: Number.isInteger(courseId) && courseId > 0 });
}
