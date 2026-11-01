"use client";
import { useQuery } from "@tanstack/react-query";
import getEnrollmentNext from "./getEnrollmentNext";
import { learningQueryKeys } from "./queryKeys";
export default function useEnrollmentNext(enrollmentId: number) {
  return useQuery({ queryKey: learningQueryKeys.next(enrollmentId), queryFn: ({ signal }) => getEnrollmentNext(enrollmentId, signal), enabled: Number.isInteger(enrollmentId) && enrollmentId > 0 });
}
