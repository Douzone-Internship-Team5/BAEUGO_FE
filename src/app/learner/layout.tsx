import type { ReactNode } from "react";
import { LearnerShell } from "./components/shared/LearnerShell";

export const metadata = { title: "배우고 | 수강자" };

export default function LearnerLayout({ children }: { children: ReactNode }) {
  return <LearnerShell>{children}</LearnerShell>;
}
