import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import OnboardingQueryProvider from "./OnboardingQueryProvider";

interface Props {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: Props) {
  return (
    <AuthGuard area="onboarding">
      <OnboardingQueryProvider>{children}</OnboardingQueryProvider>
    </AuthGuard>
  );
}
