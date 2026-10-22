"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const navigation = [
  { href: "/admin/courses", label: "강좌 관리", icon: "courses" },
  { href: "/admin/users", label: "회원 관리", icon: "users" },
] as const;

export const OperatorShell = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg text-text md:flex">
      <aside className="flex shrink-0 flex-col border-b border-line bg-panel md:min-h-screen md:w-64 md:border-r md:border-b-0">
        <Link
          href="/admin/courses"
          className="flex h-[72px] items-center gap-3 border-b border-line px-6"
        >
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent text-lg font-bold text-bg">
            B
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold tracking-[2px]">BAEUGO</span>
            <span className="mt-0.5 text-[10px] tracking-[1.5px] text-muted">
              OPERATOR
            </span>
          </span>
        </Link>

        <nav
          aria-label="운영자 메뉴"
          className="flex gap-1 overflow-x-auto p-3 md:flex-1 md:flex-col md:gap-1.5 md:p-4"
        >
          <p className="hidden px-3 pb-2 pt-3 text-[10px] font-medium tracking-[1.5px] text-dim md:block">
            관리
          </p>
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-11 shrink-0 items-center gap-3 rounded-[4px] px-3 text-[13px] transition-colors hover:bg-selected ${
                  isActive ? "bg-selected font-medium text-text" : "text-muted"
                }`}
              >
                <NavIcon name={item.icon} active={isActive} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-line p-4 md:block">
          <div className="flex items-center gap-3 rounded-[4px] bg-card p-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-selected text-xs font-medium text-accent">
              관
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium">운영자 계정</span>
              <span className="mt-0.5 text-[10px] text-muted">관리자</span>
            </span>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="w-full flex-1 px-5 py-7 md:px-8 md:py-9 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
};

interface NavIconProps {
  name: "courses" | "users";
  active: boolean;
}

const NavIcon = ({ name, active }: NavIconProps) => {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: active ? "currentColor" : "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  return name === "courses" ? (
    <svg {...common}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H20v14H5.5A1.5 1.5 0 0 0 4 19.5z" />
      <path d="M4 5.5v14M8 8h8M8 11h8" />
    </svg>
  ) : (
    <svg {...common}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-1a6 6 0 0 1 12 0v1zM16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.5V20h-4" />
    </svg>
  );
};
