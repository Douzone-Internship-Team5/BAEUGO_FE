"use client";
import { useQuery } from "@tanstack/react-query";
import getMyEnrollments from "./getMyEnrollments";
import { learningQueryKeys } from "./queryKeys";
import type { EnrollmentStatusFilter } from "@/types/learning";
export default function useMyEnrollments(status?: EnrollmentStatusFilter) {
  return useQuery({ queryKey: learningQueryKeys.enrollments(status), queryFn: ({ signal }) => getMyEnrollments(status, signal) });
}
