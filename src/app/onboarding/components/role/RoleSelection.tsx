"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError } from "@/_lib/fetcher";
import useSelectOnboardingRole from "@/api/onboarding/useSelectOnboardingRole";
import type { OnboardingRole } from "@/types/onboarding";
import { OnboardingFrame } from "../shared/OnboardingFrame";
import { RoleOptionCard } from "./RoleOptionCard";

interface Props {
  className?: string;
}

export const RoleSelection = ({ className }: Props) => {
  const router = useRouter();
  const roleMutation = useSelectOnboardingRole();
  const [error, setError] = useState("");

  const handleRoleSelect = async (role: OnboardingRole) => {
    if (roleMutation.isPending) return;
    setError("");

    try {
      await roleMutation.mutateAsync(role);
      router.push(role === "LEARNER" ? "/onboarding/learner" : "/onboarding/instructor");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "역할 선택에 실패했습니다. 로그인 상태를 확인해 주세요.",
      );
    }
  };

  return (
  <OnboardingFrame className={className ?? "px-6 pt-14 pb-7"}>
    <div
      aria-label="BAEUGO"
      className="flex size-[52px] items-center justify-center rounded-[14px] bg-accent text-[26px] font-bold text-bg"
    >
      B
    </div>
    <main className="flex flex-1 flex-col justify-center gap-3.5 pb-10">
      <div className="text-xs font-medium tracking-[2px] text-accent">모바일 직무 교육 숏폼</div>
      <h1 className="text-[34px] leading-[1.3] font-semibold tracking-[-1px]">
        짧게 배우고,
        <br />
        <span className="text-accent">바로 써먹어요.</span>
      </h1>
      <p className="text-sm leading-[1.7] text-muted">
        직무에 맞는 강좌를 찾고, 영상 한 편씩 학습한 뒤 퀴즈로 이해도를 확인하세요.
      </p>
    </main>
    <nav aria-label="시작하기" className="flex flex-col gap-2.5">
      <RoleOptionCard onClick={() => void handleRoleSelect("LEARNER")} disabled={roleMutation.isPending} emphasized>
        강의를 수강할게요
      </RoleOptionCard>
      <RoleOptionCard onClick={() => void handleRoleSelect("INSTRUCTOR")} disabled={roleMutation.isPending}>
        강의를 등록할게요
      </RoleOptionCard>
      {error && <p role="alert" className="rounded-lg border border-danger-line bg-danger-bg px-3 py-2 text-center text-xs text-danger">{error}</p>}
      <div className="pt-3 text-center text-xs text-muted">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="cursor-pointer font-medium text-accent hover:underline">로그인</Link>
      </div>
      <div className="pt-1 text-center text-[10px] text-dim">BAEUGO</div>
    </nav>
  </OnboardingFrame>
  );
};
