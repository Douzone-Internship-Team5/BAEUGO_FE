"use client";

import { useQuery } from "@tanstack/react-query";
import getInstructorScript from "./getInstructorScript";
import { instructorQueryKeys } from "./queryKeys";

export default function useInstructorScript(videoId: number) {
  return useQuery({ queryKey: instructorQueryKeys.script(videoId), queryFn: ({ signal }) => getInstructorScript(videoId, signal), enabled: Number.isInteger(videoId) && videoId > 0 });
}
