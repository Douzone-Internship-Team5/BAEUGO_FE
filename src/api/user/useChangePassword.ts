"use client";
import { useMutation } from "@tanstack/react-query";
import changePassword from "./changePassword";
import type { ChangePasswordRequest } from "@/types/user";

export default function useChangePassword() {
  return useMutation({ mutationFn: (body: ChangePasswordRequest) => changePassword(body) });
}
