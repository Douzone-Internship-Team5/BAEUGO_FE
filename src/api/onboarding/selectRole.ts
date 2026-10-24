import api from "@/_lib/fetcher";
import type { OnboardingRole, SelectOnboardingRoleResponse } from "@/types/onboarding";

export default async function selectOnboardingRole(role: OnboardingRole) {
  const response = await api.post<SelectOnboardingRoleResponse>({
    endpoint: "/users/me/role",
    body: { role },
  });

  if (!response) throw new Error("역할 선택 응답이 비어 있습니다.");
  return response.data;
}
