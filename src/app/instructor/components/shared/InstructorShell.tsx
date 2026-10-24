"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

interface Props {
  children: ReactNode;
}

const NAVIGATION = [
  { href: "/instructor", label: "대시보드", icon: "dashboard" },
  { href: "/instructor/courses", label: "내 강좌", icon: "courses" },
] as const;

export const InstructorShell = ({ children }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const accessToken = window.localStorage.getItem("accessToken");
    try {
      if (accessToken) {
        await fetch("/api/v1/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } catch {
      // Clear the local session even if the API is unavailable.
    } finally {
      window.localStorage.removeItem("accessToken");
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text md:flex">
      <aside className="flex shrink-0 flex-col border-b border-line bg-panel md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <Link href="/instructor" className="flex h-[72px] items-center gap-3 border-b border-line px-6">
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent text-lg font-bold text-bg">B</span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold tracking-[2px]">BAEUGO</span>
            <span className="mt-0.5 text-[10px] tracking-[1.5px] text-muted">INSTRUCTOR</span>
          </span>
        </Link>

        <nav aria-label="강사 메뉴" className="flex gap-1 overflow-x-auto p-3 md:flex-1 md:flex-col md:gap-1.5 md:p-4">
          <p className="hidden px-3 pb-2 pt-3 text-[10px] font-medium tracking-[1.5px] text-dim md:block">강사 공간</p>
          {NAVIGATION.map((item) => {
            const isActive = item.href === "/instructor"
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-11 shrink-0 items-center gap-3 rounded-[4px] px-3 text-[13px] transition-colors hover:bg-selected ${isActive ? "bg-selected font-medium text-text" : "text-muted"}`}
              >
                <InstructorNavIcon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-between border-t border-line px-4 py-3 md:block md:p-4">
          <div className="flex min-w-0 items-center gap-3 md:mb-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-selected text-sm font-medium text-accent">강</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">이하늘 강사</p>
              <p className="mt-1 truncate text-[10px] text-muted">강사 계정</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-[4px] px-2 text-xs text-muted transition-colors hover:bg-danger-bg hover:text-danger disabled:cursor-wait disabled:opacity-60 md:h-10 md:w-full md:px-3"
          >
            <LogoutIcon />
            {isLoggingOut ? "로그아웃 중…" : "로그아웃"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="w-full flex-1 px-5 py-7 md:px-8 md:py-9 lg:px-10">{children}</main>
      </div>
    </div>
  );
};

interface InstructorNavIconProps {
  name: "dashboard" | "courses";
}

const InstructorNavIcon = ({ name }: InstructorNavIconProps) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "dashboard" ? (
      <><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><rect x="13.5" y="13.5" width="7" height="7" rx="1" /></>
    ) : (
      <><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H20v14H5.5A1.5 1.5 0 0 0 4 19.5z" /><path d="M4 5.5v14M8 8h8M8 11h8" /></>
    )}
  </svg>
);

const LogoutIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
  </svg>
);
