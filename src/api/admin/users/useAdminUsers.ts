"use client";

import { useQuery } from "@tanstack/react-query";
import getAdminUsers from "./getAdminUsers";
import { adminQueryKeys } from "../queryKeys";
import type { AdminUsersParams } from "@/types/admin";

export default function useAdminUsers(params: AdminUsersParams) {
  return useQuery({
    queryKey: adminQueryKeys.userList(params),
    queryFn: ({ signal }) => getAdminUsers(params, signal),
  });
}
