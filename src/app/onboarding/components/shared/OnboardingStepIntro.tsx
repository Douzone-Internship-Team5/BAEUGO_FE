import type { ReactNode } from "react";

interface Props {
  step: number;
  title: ReactNode;
  description: string;
}

export const OnboardingStepIntro = ({ step, title, description }: Props) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs tracking-[2px] text-muted">STEP {step}</div>
    <h1 className="text-[26px] leading-[1.35] font-light tracking-[-0.5px]">{title}</h1>
    <p className="text-[13px] leading-[1.6] text-muted">{description}</p>
  </div>
);
