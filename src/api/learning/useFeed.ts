"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import getFeed from "./getFeed";
export default function useFeed() {
  return useInfiniteQuery({
    queryKey: ["learning", "feed"],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) => getFeed(pageParam, signal),
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  });
}
