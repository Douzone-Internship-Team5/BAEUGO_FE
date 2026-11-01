"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteVideoLike from "./deleteVideoLike";
import { learningQueryKeys } from "./queryKeys";
export default function useVideoUnlike(videoId: number) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => deleteVideoLike(videoId),
    onSuccess: async () => Promise.all([
      client.invalidateQueries({ queryKey: learningQueryKeys.video(videoId) }),
      client.invalidateQueries({ queryKey: learningQueryKeys.likes() }),
      client.invalidateQueries({ queryKey: learningQueryKeys.feed() }),
    ]),
  });
}
