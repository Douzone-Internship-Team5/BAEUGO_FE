"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import postRegenerateInstructorScript from "./postRegenerateInstructorScript";
import { instructorQueryKeys } from "./queryKeys";

export default function useRegenerateInstructorScript(videoId: number) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: () => postRegenerateInstructorScript(videoId), onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: instructorQueryKeys.script(videoId) });
  } });
}
