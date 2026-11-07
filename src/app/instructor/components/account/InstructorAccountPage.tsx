"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/_lib/logout";
import { PasswordSection, ProfileImageSection } from "@/components/account/AccountSections";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";
import { SettlementAccountSection } from "./SettlementAccountSection";

export const InstructorAccountPage = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logout();
    router.replace("/");
    router.refresh();
  };

  return <div className="min-h-dvh pb-24">
    <InstructorScreenHeader title="계정 설정" backHref="/instructor/profile" />
    <main className="mx-auto max-w-2xl px-4 pt-5 md:px-8 md:pt-8">
      <header className="mb-6">
        <p className="hidden text-[10px] tracking-[1.4px] text-muted md:block">ACCOUNT</p>
        <h1 className="mt-1 text-xl font-medium md:mt-2">계정 설정</h1>
        <p className="mt-2 text-xs leading-5 text-muted">프로필 사진, 비밀번호, 정산 계좌를 관리합니다.</p>
      </header>
      <div className="flex flex-col gap-4">
        <ProfileImageSection />
        <PasswordSection />
      </div>
      <SettlementAccountSection />
      {/* 데스크톱은 사이드바에 로그아웃이 있고, 모바일 하단 탭에는 없어서 여기에 둔다. */}
      <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="mt-8 w-full cursor-pointer py-2 text-xs text-muted disabled:cursor-wait md:hidden">
        {isLoggingOut ? "로그아웃 중…" : "로그아웃"}
      </button>
    </main>
    <InstructorMobileNav active="profile" />
  </div>;
};
