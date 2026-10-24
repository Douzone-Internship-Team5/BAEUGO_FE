import type { FormEvent, ReactNode } from "react";
import { OnboardingProgressHeader } from "./OnboardingProgressHeader";
import { OnboardingStepFooter } from "./OnboardingStepFooter";

interface Props {
  roleLabel: string;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onSubmit: () => void;
  buttonLabel: string;
  summary?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  children: ReactNode;
}

export const OnboardingStepScreen = ({
  roleLabel,
  currentStep,
  totalSteps,
  onBack,
  onSubmit,
  buttonLabel,
  summary,
  disabled,
  loading,
  error,
  children,
}: Props) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-bg text-text font-onboarding antialiased">
      <OnboardingProgressHeader
        roleLabel={roleLabel}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={onBack}
      />
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
        <main className="flex-1 overflow-y-auto px-5 py-6">{children}</main>
        <OnboardingStepFooter summary={summary} disabled={disabled || loading} loading={loading} error={error}>
          {buttonLabel}
        </OnboardingStepFooter>
      </form>
    </div>
  );
};
