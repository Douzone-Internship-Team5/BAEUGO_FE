"use client";
import { useQuery } from "@tanstack/react-query";
import getVideoDetail from "./getVideoDetail";
import { learningQueryKeys } from "./queryKeys";
export default function useVideoDetail(videoId: number, enabled = true) {
  return useQuery({ queryKey: learningQueryKeys.video(videoId), queryFn: ({ signal }) => getVideoDetail(videoId, signal), enabled: enabled && Number.isInteger(videoId) && videoId > 0 });
}
