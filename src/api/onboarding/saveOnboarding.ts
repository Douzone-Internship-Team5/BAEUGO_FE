import api from "@/_lib/fetcher";
import type { OnboardingResponse, SaveOnboardingRequest } from "@/types/onboarding";

export default async function saveOnboarding(body: SaveOnboardingRequest) {
  const response = await api.put<OnboardingResponse>({
    endpoint: "/users/me/onboarding",
    body,
  });

  if (!response) throw new Error("온보딩 저장 응답이 비어 있습니다.");
  return response.data;
}
