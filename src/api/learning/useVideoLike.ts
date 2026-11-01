"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import postVideoLike from "./postVideoLike";
import { learningQueryKeys } from "./queryKeys";
export default function useVideoLike(videoId: number) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => postVideoLike(videoId),
    onSuccess: async () => Promise.all([
      client.invalidateQueries({ queryKey: learningQueryKeys.video(videoId) }),
      client.invalidateQueries({ queryKey: learningQueryKeys.likes() }),
      client.invalidateQueries({ queryKey: learningQueryKeys.feed() }),
    ]),
  });
}
