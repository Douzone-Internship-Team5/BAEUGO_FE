"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import postInstructorVideo from "./postInstructorVideo";
import { instructorQueryKeys } from "./queryKeys";
import type { InstructorVideoUpload } from "./postInstructorVideo";

export default function useUploadInstructorVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InstructorVideoUpload) => postInstructorVideo(input),
    onSuccess: async (_video, input) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: instructorQueryKeys.course(input.courseId) }),
        queryClient.invalidateQueries({ queryKey: instructorQueryKeys.courseLists() }),
      ]);
    },
  });
}
