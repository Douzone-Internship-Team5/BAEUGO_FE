"use client";

import { useMutation } from "@tanstack/react-query";
import saveOnboarding from "./saveOnboarding";
import type { SaveOnboardingRequest } from "@/types/onboarding";

export default function useSaveOnboarding() {
  return useMutation({
    mutationFn: (body: SaveOnboardingRequest) => saveOnboarding(body),
  });
}
