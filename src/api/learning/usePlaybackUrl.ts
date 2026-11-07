"use client";
import { useMutation } from "@tanstack/react-query";
import postPlaybackUrl from "./postPlaybackUrl";

export default function usePlaybackUrl() {
  return useMutation({ mutationFn: (videoId: number) => postPlaybackUrl(videoId) });
}
