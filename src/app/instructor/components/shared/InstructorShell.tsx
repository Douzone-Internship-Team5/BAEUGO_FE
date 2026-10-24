"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { useAuthStore } from "@/app/login/store/useAuthStore";
import { InstructorNavIcon } from "./InstructorNavIcon";

interface Props {
  children: ReactNode;
}

const NAVIGATION = [
  { href: "/instructor", label: "내 강좌", icon: "courses" },
  { href: "/instructor/courses/new", label: "새 강좌", icon: "new" },
  { href: "/instructor/stats", label: "통계", icon: "stats" },
  { href: "/instructor/profile", label: "강사 정보", icon: "profile" },
] as const;

export const InstructorShell = ({ children }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const name = useAuthStore((state) => state.user?.name?.trim());
  const displayName = name || "강사";

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
    <div className="min-h-dvh bg-bg text-text md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-panel md:sticky md:top-0 md:flex md:h-dvh">
        <Link href="/instructor" className="flex h-[72px] items-center gap-3 border-b border-line px-6">
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent text-lg font-bold text-bg">B</span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold tracking-[2px]">BAEUGO</span>
            <span className="mt-0.5 text-[10px] tracking-[1.5px] text-muted">STUDIO</span>
          </span>
        </Link>

        <nav aria-label="강사 메뉴" className="flex flex-1 flex-col gap-1.5 p-4">
          <p className="px-3 pb-2 pt-3 text-[10px] font-medium tracking-[1.5px] text-dim">강사 공간</p>
          {NAVIGATION.map((item) => {
            const isActive = item.href === "/instructor"
              ? pathname === item.href || pathname === "/instructor/courses"
              : item.href === "/instructor/courses/new"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-11 items-center gap-3 rounded-[4px] px-3 text-[13px] transition-colors hover:bg-selected ${isActive ? "bg-selected font-medium text-text" : "text-muted"}`}
              >
                <InstructorNavIcon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-selected text-sm font-medium text-text">{displayName.slice(0, 1)}</span>
            <div>
              <p className="text-xs font-medium">{displayName} 강사</p>
              <p className="mt-1 text-[10px] text-muted">강사 계정</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-[4px] px-3 text-[13px] text-muted transition-colors hover:bg-danger-bg hover:text-danger disabled:cursor-wait disabled:opacity-60"
          >
            <LogoutIcon />
            {isLoggingOut ? "로그아웃 중…" : "로그아웃"}
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
};

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
  </svg>
);
