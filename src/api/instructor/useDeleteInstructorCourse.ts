"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteInstructorCourse from "./deleteInstructorCourse";
import { instructorQueryKeys } from "./queryKeys";

/** 한 번도 공개되지 않은 작성 중 강좌만 지울 수 있다(백엔드 규칙). */
export default function useDeleteInstructorCourse(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteInstructorCourse(courseId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: instructorQueryKeys.course(courseId) });
      await queryClient.invalidateQueries({ queryKey: instructorQueryKeys.courseLists() });
    },
  });
}
