"use client";

import { useQuery } from "@tanstack/react-query";
import getAdminUser from "./getAdminUser";
import { adminQueryKeys } from "../queryKeys";

export default function useAdminUser(userId: number) {
  return useQuery({
    queryKey: adminQueryKeys.user(userId),
    queryFn: ({ signal }) => getAdminUser(userId, signal),
    enabled: Number.isInteger(userId) && userId > 0,
  });
}
