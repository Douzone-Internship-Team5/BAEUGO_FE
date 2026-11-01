"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import postVideoView from "./postVideoView";
import { learningQueryKeys } from "./queryKeys";
import type { VideoViewRequest } from "@/types/learning";
export default function useVideoView(videoId: number) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (body: VideoViewRequest) => postVideoView(videoId, body), onSuccess: async () => client.invalidateQueries({ queryKey: learningQueryKeys.video(videoId) }) });
}
