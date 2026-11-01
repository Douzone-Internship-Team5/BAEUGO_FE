"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import saveVideoProgress from "./saveVideoProgress";
import { learningQueryKeys } from "./queryKeys";
import type { VideoProgressRequest } from "@/types/learning";
export default function useSaveVideoProgress(videoId: number) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (body: VideoProgressRequest) => saveVideoProgress(videoId, body), onSuccess: async () => Promise.all([client.invalidateQueries({ queryKey: learningQueryKeys.video(videoId) }), client.invalidateQueries({ queryKey: learningQueryKeys.enrollments() })]) });
}
