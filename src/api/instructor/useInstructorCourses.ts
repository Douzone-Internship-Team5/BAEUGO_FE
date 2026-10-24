"use client";

import { useQuery } from "@tanstack/react-query";
import getInstructorCourses from "./getInstructorCourses";
import { instructorQueryKeys } from "./queryKeys";
import type { InstructorCourseStatus } from "@/types/instructor";

export default function useInstructorCourses(status?: InstructorCourseStatus) {
  return useQuery({ queryKey: instructorQueryKeys.courseList(status), queryFn: ({ signal }) => getInstructorCourses(signal, status) });
}
