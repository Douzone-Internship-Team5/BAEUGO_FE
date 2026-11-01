"use client";
import { useQuery } from "@tanstack/react-query";
import getMyLikes from "./getMyLikes";
import { learningQueryKeys } from "./queryKeys";
import type { LikedVideoTypeFilter } from "@/types/learning";
export default function useMyLikes(videoType?: LikedVideoTypeFilter) {
  return useQuery({ queryKey: learningQueryKeys.likes(videoType), queryFn: ({ signal }) => getMyLikes(videoType, signal) });
}
