"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import putInstructorScript from "./putInstructorScript";
import { instructorQueryKeys } from "./queryKeys";
import type { InstructorScriptSegmentDto } from "@/types/instructor";

export default function useSaveInstructorScript(videoId: number) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (segments: InstructorScriptSegmentDto[]) => putInstructorScript(videoId, segments), onSuccess: async () => {
    // 강좌 상세의 대본 검수 표시·공개 조건도 바뀌므로 강좌 캐시까지 갱신한다.
    await Promise.all([queryClient.invalidateQueries({ queryKey: instructorQueryKeys.script(videoId) }), queryClient.invalidateQueries({ queryKey: instructorQueryKeys.courses() })]);
  } });
}
