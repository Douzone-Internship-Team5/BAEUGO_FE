import Link from "next/link";
import { Header } from "@/components/common";

export function LearnerHeader({ title = "BAEUGO", backHref, right }: { title?: string; backHref?: string; right?: React.ReactNode }) {
  return <Header title={title} backHref={backHref} right={right} bordered className="h-[60px] px-5" />;
}

export function BrandHeader({ right }: { right?: React.ReactNode }) {
  return <header className="flex h-[60px] items-center justify-between px-5">
    <Link href="/learner" className="text-[15px] font-semibold tracking-[4px]">BAEUGO</Link>{right}
  </header>;
}
