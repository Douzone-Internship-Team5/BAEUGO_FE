"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import postAdminCourseRepublish from "./postAdminCourseRepublish";
import { adminQueryKeys } from "../queryKeys";

export default function useAdminCourseRepublish(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postAdminCourseRepublish(courseId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.course(courseId) }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.courses() }),
      ]);
    },
  });
}
