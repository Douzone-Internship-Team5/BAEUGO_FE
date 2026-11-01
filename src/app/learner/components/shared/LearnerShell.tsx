"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/_lib/cn";

const NAV = [
  { href: "/learner", label: "홈", icon: "⌂" },
  { href: "/learner/explore", label: "탐색", icon: "⌕" },
  { href: "/learner/library", label: "보관함", icon: "▤" },
  { href: "/learner/mypage", label: "마이", icon: "◯" },
] as const;

export function LearnerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLearning = pathname.startsWith("/learner/learn") || pathname.startsWith("/learner/quiz") || pathname === "/learner/feed" || pathname.startsWith("/learner/enroll");
  return (
    <div className="min-h-dvh bg-bg text-text">
      <div className="mx-auto min-h-dvh max-w-[430px] bg-bg shadow-2xl">
        <div className={cn("min-h-dvh pb-20", isLearning && "pb-0")}>{children}</div>
        {!isLearning && <nav aria-label="수강자 메뉴" className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-[68px] max-w-[430px] items-center justify-around border-t border-line bg-panel/95 px-3 backdrop-blur">
          {NAV.map(({ href, label, icon }) => {
            const active = href === "/learner" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("flex min-w-16 flex-col items-center gap-1 text-[10px] transition-colors", active ? "text-accent" : "text-muted")}>
              <span aria-hidden="true" className="text-[21px] leading-6">{icon}</span>{label}
            </Link>;
          })}
        </nav>}
      </div>
    </div>
  );
}
