import type { ReactNode } from "react";
import OnboardingQueryProvider from "./OnboardingQueryProvider";

interface Props {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: Props) {
  return <OnboardingQueryProvider>{children}</OnboardingQueryProvider>;
}
