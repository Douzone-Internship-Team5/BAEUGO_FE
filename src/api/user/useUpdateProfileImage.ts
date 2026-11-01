"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateProfileImage from "./updateProfileImage";
import { userQueryKeys } from "./queryKeys";
import type { UpdateProfileImageRequest } from "@/types/user";

export default function useUpdateProfileImage() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (body: UpdateProfileImageRequest) => updateProfileImage(body), onSuccess: async () => client.invalidateQueries({ queryKey: userQueryKeys.me() }) });
}
