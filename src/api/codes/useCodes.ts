"use client";

import { useQuery } from "@tanstack/react-query";
import getCodes from "./getCodes";

export const codesQueryKey = ["codes"] as const;

/** 직무·주제·현재 상황·학습 목표 같은 공통 코드. 자주 바뀌지 않아 한 번 받아 오래 쓴다. */
export default function useCodes() {
  return useQuery({ queryKey: codesQueryKey, queryFn: ({ signal }) => getCodes(signal), staleTime: 30 * 60 * 1000 });
}
