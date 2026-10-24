"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import putInstructorScript from "./putInstructorScript";
import { instructorQueryKeys } from "./queryKeys";
import type { InstructorScriptSegmentDto } from "@/types/instructor";

export default function useSaveInstructorScript(videoId: number) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (segments: InstructorScriptSegmentDto[]) => putInstructorScript(videoId, segments), onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: instructorQueryKeys.script(videoId) });
  } });
}
