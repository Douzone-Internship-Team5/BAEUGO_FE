"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import getFeed from "./getFeed";
import { learningQueryKeys } from "./queryKeys";
export default function useFeed() {
  return useInfiniteQuery({
    queryKey: learningQueryKeys.feed(),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) => getFeed(pageParam, signal),
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}
