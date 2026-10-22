import type { ReactNode } from "react";
import { Button } from "@/components/common";

interface Props {
  children: ReactNode;
  summary?: string;
  disabled?: boolean;
}

export const OnboardingStepFooter = ({ children, summary, disabled }: Props) => (
  <div className="shrink-0 border-t border-line px-5 pt-3 pb-6">
    {summary && <div className="mb-2 text-center text-xs text-muted">{summary}</div>}
    <Button
      type="submit"
      variant="primary"
      size="lg"
      fullWidth
      disabled={disabled}
      className="h-[52px] rounded-full text-[15px] font-semibold"
    >
      {children}
    </Button>
  </div>
);
