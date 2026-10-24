"use client";

import { useQuery } from "@tanstack/react-query";
import getInstructorStats, { type InstructorStatsParams } from "./getInstructorStats";
import { instructorQueryKeys } from "./queryKeys";

export default function useInstructorStats(params: InstructorStatsParams) {
  return useQuery({ queryKey: instructorQueryKeys.stats({ ...params }), queryFn: ({ signal }) => getInstructorStats(params, signal) });
}
