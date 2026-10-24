"use client";

import { useMutation } from "@tanstack/react-query";
import selectOnboardingRole from "./selectRole";
import type { OnboardingRole } from "@/types/onboarding";

export default function useSelectOnboardingRole() {
  return useMutation({
    mutationFn: (role: OnboardingRole) => selectOnboardingRole(role),
  });
}
