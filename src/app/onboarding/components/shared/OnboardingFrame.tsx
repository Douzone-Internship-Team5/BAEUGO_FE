import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  children: ReactNode;
  className?: string;
}

export const OnboardingFrame = ({ children, className }: Props) => (
  <div
    className={cn(
      "mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-bg text-text",
      "font-sans antialiased",
      className,
    )}
  >
    {children}
  </div>
);
