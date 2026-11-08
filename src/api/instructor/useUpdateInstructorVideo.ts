"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import patchInstructorVideo from "./patchInstructorVideo";
import { instructorQueryKeys } from "./queryKeys";
import useInvalidateInstructorCourse from "./useInvalidateInstructorCourse";

export interface InstructorVideoUpdate {
  videoId: number;
  title: string;
  /** 새 영상 파일. 주면 백엔드가 새 videoId로 교체하고 대본을 다시 만든다. */
  file?: File | null;
}

export default function useUpdateInstructorVideo(courseId: number) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateInstructorCourse(courseId);
  return useMutation({
    mutationFn: ({ videoId, title, file }: InstructorVideoUpdate) => {
      if (!file) return patchInstructorVideo(videoId, { title });
      const body = new FormData();
      body.set("title", title);
      body.set("file", file);
      return patchInstructorVideo(videoId, body);
    },
    onSuccess: async (_video, { videoId, file }) => {
      if (file) queryClient.removeQueries({ queryKey: instructorQueryKeys.script(videoId) });
      await invalidate();
    },
  });
}
