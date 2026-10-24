import type { ReactNode } from "react";
import { Button } from "@/components/common";

interface Props {
  children: ReactNode;
  summary?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}

export const OnboardingStepFooter = ({ children, summary, disabled, loading, error }: Props) => (
  <div className="shrink-0 border-t border-line px-5 pt-3 pb-6">
    {summary && <div className="mb-2 text-center text-xs text-muted">{summary}</div>}
    {error && <p role="alert" className="mb-3 rounded-lg border border-danger-line bg-danger-bg px-3 py-2 text-xs leading-5 text-danger">{error}</p>}
    <Button
      type="submit"
      variant="primary"
      size="lg"
      fullWidth
      disabled={disabled}
      loading={loading}
      className="h-[52px] rounded-full text-[15px] font-semibold"
    >
      {children}
    </Button>
  </div>
);
