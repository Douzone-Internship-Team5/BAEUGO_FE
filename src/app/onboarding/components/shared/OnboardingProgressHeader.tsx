import { Header, StepProgress } from "@/components/common";

interface Props {
  roleLabel: string;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

export const OnboardingProgressHeader = ({
  roleLabel,
  currentStep,
  totalSteps,
  onBack,
}: Props) => (
  <div className="shrink-0 px-3 pt-2">
    <Header
      onBack={onBack}
      right={
        <span className="pr-3 text-xs tracking-[1px] text-muted">
          {roleLabel} · {currentStep} / {totalSteps}
        </span>
      }
    />
    <StepProgress current={currentStep} total={totalSteps} className="gap-1 px-2" />
  </div>
);
