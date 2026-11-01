"use client";
import { useQuery } from "@tanstack/react-query";
import getMe from "./getMe";
import { userQueryKeys } from "./queryKeys";

export default function useMe() {
  return useQuery({ queryKey: userQueryKeys.me(), queryFn: ({ signal }) => getMe(signal) });
}
