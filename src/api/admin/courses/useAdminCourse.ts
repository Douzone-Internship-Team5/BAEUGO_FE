"use client";

import { useQuery } from "@tanstack/react-query";
import getAdminCourse from "./getAdminCourse";
import { adminQueryKeys } from "../queryKeys";

export default function useAdminCourse(courseId: number) {
  return useQuery({
    queryKey: adminQueryKeys.course(courseId),
    queryFn: ({ signal }) => getAdminCourse(courseId, signal),
    enabled: Number.isInteger(courseId) && courseId > 0,
  });
}
