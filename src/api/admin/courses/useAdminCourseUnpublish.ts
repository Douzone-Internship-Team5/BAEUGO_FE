"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import postAdminCourseUnpublish from "./postAdminCourseUnpublish";
import { adminQueryKeys } from "../queryKeys";
import type { AdminUnpublishRequest } from "@/types/admin";

export default function useAdminCourseUnpublish(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminUnpublishRequest) => postAdminCourseUnpublish(courseId, body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.course(courseId) }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.courses() }),
      ]);
    },
  });
}
