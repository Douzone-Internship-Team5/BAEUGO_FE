"use client";

import { useQuery } from "@tanstack/react-query";
import getAdminCourses from "./getAdminCourses";
import { adminQueryKeys } from "../queryKeys";
import type { AdminCoursesParams } from "@/types/admin";

export default function useAdminCourses(params: AdminCoursesParams) {
  return useQuery({
    queryKey: adminQueryKeys.courseList(params),
    queryFn: ({ signal }) => getAdminCourses(params, signal),
  });
}
