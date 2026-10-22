import { Suspense } from "react";
import type { ReactNode } from "react";
import { OperatorShell } from "./components/OperatorShell";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <Suspense fallback={<AdminShellFallback />}>
      <OperatorShell>{children}</OperatorShell>
    </Suspense>
  );
}

const AdminShellFallback = () => (
  <div className="min-h-screen bg-bg text-text md:flex" role="status" aria-label="운영자 화면 불러오는 중">
    <aside className="flex shrink-0 flex-col border-b border-line bg-panel md:min-h-screen md:w-64 md:border-r md:border-b-0">
      <div className="flex h-[72px] items-center gap-3 border-b border-line px-6">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent text-lg font-bold text-bg">B</span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold tracking-[2px]">BAEUGO</span>
          <span className="mt-0.5 text-[10px] tracking-[1.5px] text-muted">OPERATOR</span>
        </span>
      </div>
      <div className="flex gap-2 p-3 md:flex-col md:p-4">
        <span className="h-11 rounded-[4px] bg-selected md:w-full" />
        <span className="h-11 rounded-[4px] bg-card md:w-full" />
      </div>
    </aside>
    <main className="flex flex-1 items-start px-5 py-7 text-sm text-muted md:px-8 md:py-9">
      운영자 화면을 불러오는 중…
    </main>
  </div>
);
