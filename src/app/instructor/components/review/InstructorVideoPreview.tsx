"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import postPlaybackUrl from "@/api/learning/postPlaybackUrl";
import { getErrorMessage } from "@/_lib/fetcher";

/** 서명 재생 URL은 5분 동안 유효해서 4분이 지나면 새로 받는다. */
const PLAYBACK_URL_STALE_MS = 4 * 60 * 1000;

export const InstructorVideoPreview = ({ videoId }: { videoId: number }) => {
  const playbackQuery = useQuery({
    queryKey: ["playback-url", videoId],
    queryFn: () => postPlaybackUrl(videoId),
    enabled: Number.isFinite(videoId),
    staleTime: PLAYBACK_URL_STALE_MS,
    gcTime: 0,
    retry: false,
  });
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const playbackUrl = playbackQuery.data?.playbackUrl;

  // 만료된 URL이면 새로 받고, 방금 받은 URL도 실패하면 다시 요청하지 않고 안내만 한다.
  const handleVideoError = () => {
    if (playbackQuery.isStale) void playbackQuery.refetch();
    else setFailedUrl(playbackUrl ?? null);
  };

  if (playbackUrl && failedUrl !== playbackUrl) {
    return (
      <video
        key={playbackUrl}
        src={playbackUrl}
        controls
        preload="metadata"
        playsInline
        onError={handleVideoError}
        className="mt-4 aspect-video w-full rounded-[4px] border border-line bg-black"
      />
    );
  }
  return (
    <div className="mt-4 flex aspect-video items-center justify-center rounded-[4px] border border-line bg-panel px-4 text-center">
      {playbackUrl ? (
        <span role="alert" className="text-xs text-danger">영상 파일을 재생할 수 없어요. 업로드한 파일이 있는지 확인해 주세요.</span>
      ) : playbackQuery.error ? (
        <span role="alert" className="text-xs text-danger">영상을 불러오지 못했어요. {getErrorMessage(playbackQuery.error)}</span>
      ) : (
        <span className="text-xs text-muted">영상을 불러오는 중입니다.</span>
      )}
    </div>
  );
};
