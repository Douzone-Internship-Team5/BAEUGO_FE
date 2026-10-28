import { Suspense } from "react";
import type { ReactNode } from "react";
import { LearnerShell } from "./components/shared/LearnerShell";

export const metadata = { title: "배우고 | 수강자" };

export default function LearnerLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="min-h-dvh bg-bg text-text">{children}</div>}>
    <LearnerShell>{children}</LearnerShell>
  </Suspense>;
}
