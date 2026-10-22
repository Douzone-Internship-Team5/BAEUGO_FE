import type { ReactNode } from "react";
import { OperatorShell } from "./components/OperatorShell";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return <OperatorShell>{children}</OperatorShell>;
}
