"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiError } from "@/_lib/fetcher";
import { Button } from "@/components/common/Button";
import postLogin from "@/api/auth/postLogin";
import { useAuthStore } from "../store/useAuthStore";

interface Props {
  className?: string;
}

export const LoginPage = ({ className = "" }: Props) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);
    try {
      const result = await postLogin({ email: email.trim(), password });
      const { user, accessToken } = result;

      useAuthStore.getState().setLoginState(true, accessToken, "");
      useAuthStore.getState().setUser({
        id: String(user.id),
        email: user.email,
        profile_image: "",
      });
      window.localStorage.setItem("accessToken", accessToken);

      if (user.accountType === "OPERATOR") {
        router.replace("/admin/courses");
      } else if (!user.onboarded) {
        router.replace("/onboarding");
      } else if (user.activeMode === "INSTRUCTOR") {
        router.replace("/instructor");
      } else {
        router.replace("/");
      }
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0b0d11] px-5 py-10 text-[#f4f5f7] ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 size-[460px] -translate-x-1/2 rounded-full bg-[#3978ff]/10 blur-[110px]" />
      <section className="relative w-full max-w-[440px] rounded-[20px] border border-white/[0.09] bg-[#12151b]/95 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.45)] sm:p-10">
        <Link href="/" aria-label="배우고 홈으로" className="inline-flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#83a8ff]">
          <span className="flex size-11 items-center justify-center rounded-[13px] bg-[#83a8ff] text-[22px] font-bold text-[#101318]">B</span>
          <span className="text-[13px] font-semibold tracking-[2.5px]">BAEUGO</span>
        </Link>

        <div className="mt-9 sm:mt-11">
          <p className="text-[11px] font-medium tracking-[1.8px] text-[#83a8ff]">WELCOME BACK</p>
          <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.7px]">로그인</h1>
          <p className="mt-2 text-[13px] leading-6 text-[#9299a5]">계정에 로그인하고 배우고를 계속 이용해 보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="login-email" className="text-xs font-medium text-[#d6d9df]">이메일</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={100}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일 주소를 입력해 주세요"
              className="h-12 w-full rounded-[9px] border border-white/[0.12] bg-[#0c0f14] px-4 text-[14px] text-[#f4f5f7] outline-none transition placeholder:text-[#646b77] focus:border-[#83a8ff] focus:ring-2 focus:ring-[#83a8ff]/15"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className="text-xs font-medium text-[#d6d9df]">비밀번호</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={255}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력해 주세요"
              className="h-12 w-full rounded-[9px] border border-white/[0.12] bg-[#0c0f14] px-4 text-[14px] text-[#f4f5f7] outline-none transition placeholder:text-[#646b77] focus:border-[#83a8ff] focus:ring-2 focus:ring-[#83a8ff]/15"
            />
          </div>

          {error && <p role="alert" className="rounded-lg border border-[#632f3d] bg-[#361d26] px-3.5 py-3 text-xs leading-5 text-[#ff9caa]">{error}</p>}

          <Button type="submit" variant="accent" fullWidth loading={isSubmitting} className="mt-1 h-12 rounded-[9px] bg-[#83a8ff] text-[14px] text-[#101318] hover:bg-[#a1bcff]">
            로그인
          </Button>
        </form>

        <div className="mt-7 border-t border-white/[0.08] pt-5 text-center">
          <p className="text-xs text-[#858c98]">계정이 없으신가요? <span className="text-[#c5cad3]">회원가입은 준비 중입니다.</span></p>
          <Link href="/" className="mt-5 inline-flex min-h-9 items-center justify-center rounded-md px-3 text-xs text-[#aab1bd] transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#83a8ff]">시작 화면으로</Link>
        </div>
      </section>
    </main>
  );
};
