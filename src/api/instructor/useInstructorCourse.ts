"use client";

import { useQuery } from "@tanstack/react-query";
import getInstructorCourse from "./getInstructorCourse";
import { instructorQueryKeys } from "./queryKeys";

export default function useInstructorCourse(courseId: number) {
  return useQuery({ queryKey: instructorQueryKeys.course(courseId), queryFn: ({ signal }) => getInstructorCourse(courseId, signal), enabled: Number.isInteger(courseId) && courseId > 0 });
}
