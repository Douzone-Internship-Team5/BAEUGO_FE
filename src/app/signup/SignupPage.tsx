"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiError } from "@/_lib/fetcher";
import { Button } from "@/components/common/Button";
import postSignup, { type SignupRole } from "@/api/auth/postSignup";
import { useAuthStore } from "@/app/login/store/useAuthStore";

export const SignupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const initialRole = searchParams.get("role");
  const [role, setRole] = useState<SignupRole | "">(initialRole === "LEARNER" || initialRole === "INSTRUCTOR" ? initialRole : "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordBytes = new TextEncoder().encode(password).length;
  const passwordTooLong = passwordBytes > 72;
  const passwordMeetsRules = password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !passwordMeetsRules || passwordTooLong || passwordMismatch) return;

    setError("");
    setIsSubmitting(true);
    try {
      const result = await postSignup({
        email: email.trim(),
        password,
        ...(role ? { role } : {}),
      });
      const { user, accessToken } = result;

      useAuthStore.getState().setLoginState(true, accessToken, "");
      useAuthStore.getState().setUser({
        id: String(user.id),
        email: user.email,
        name: user.name,
        profile_image: "",
        activeMode: user.activeMode ?? user.role ?? null,
      });
      window.localStorage.setItem("accessToken", accessToken);

      const activeMode = user.activeMode ?? user.role;
      if (user.onboarded) {
        router.replace(activeMode === "INSTRUCTOR" ? "/instructor" : "/learner");
      } else if (activeMode === "LEARNER") {
        router.replace("/onboarding/learner");
      } else if (activeMode === "INSTRUCTOR") {
        router.replace("/onboarding/instructor");
      } else {
        router.replace("/onboarding");
      }
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else if (requestError instanceof TypeError) {
        setError("서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해 주세요.");
      } else {
        setError(requestError instanceof Error ? requestError.message : "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0b0d11] px-5 py-10 text-[#f4f5f7]">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 size-[460px] -translate-x-1/2 rounded-full bg-[#3978ff]/10 blur-[110px]" />
      <section className="relative w-full max-w-[440px] rounded-[20px] border border-white/[0.09] bg-[#12151b]/95 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.45)] sm:p-10">
        <Link href="/" aria-label="배우고 홈으로" className="inline-flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#83a8ff]">
          <span className="flex size-11 items-center justify-center rounded-[13px] bg-[#83a8ff] text-[22px] font-bold text-[#101318]">B</span>
          <span className="text-[13px] font-semibold tracking-[2.5px]">BAEUGO</span>
        </Link>

        <div className="mt-9 sm:mt-11">
          <p className="text-[11px] font-medium tracking-[1.8px] text-[#83a8ff]">GET STARTED</p>
          <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.7px]">회원가입</h1>
          <p className="mt-2 text-[13px] leading-6 text-[#9299a5]">배우고 계정을 만들고 학습을 시작해 보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="signup-email" className="text-xs font-medium text-[#d6d9df]">이메일</label>
            <input
              id="signup-email"
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
            <p className="text-[10px] text-[#777f8c]">이메일 아이디 앞부분이 이름으로 등록됩니다.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="signup-role" className="text-xs font-medium text-[#d6d9df]">시작 역할 <span className="font-normal text-[#858c98]">선택 사항</span></label>
            <select
              id="signup-role"
              value={role}
              onChange={(event) => setRole(event.target.value as SignupRole | "")}
              className="h-12 w-full rounded-[9px] border border-white/[0.12] bg-[#0c0f14] px-4 text-[14px] text-[#f4f5f7] outline-none transition focus:border-[#83a8ff] focus:ring-2 focus:ring-[#83a8ff]/15"
            >
              <option value="">나중에 선택</option>
              <option value="LEARNER">수강자</option>
              <option value="INSTRUCTOR">강사</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="signup-password" className="text-xs font-medium text-[#d6d9df]">비밀번호</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              maxLength={255}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="8자 이상, 영문과 숫자를 포함해 주세요"
              className="h-12 w-full rounded-[9px] border border-white/[0.12] bg-[#0c0f14] px-4 text-[14px] text-[#f4f5f7] outline-none transition placeholder:text-[#646b77] focus:border-[#83a8ff] focus:ring-2 focus:ring-[#83a8ff]/15"
            />
            {password.length > 0 && !passwordMeetsRules && <p className="text-[10px] text-[#ff9caa]">비밀번호는 8자 이상이며 영문과 숫자를 포함해야 해요.</p>}
            {passwordTooLong && <p className="text-[10px] text-[#ff9caa]">UTF-8 기준 72바이트 이하여야 해요. 한글은 최대 24자까지 입력할 수 있어요.</p>}
            <p className="text-[10px] text-[#777f8c]">특수문자와 한글도 사용할 수 있어요.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="signup-password-confirm" className="text-xs font-medium text-[#d6d9df]">비밀번호 확인</label>
            <input
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              required
              maxLength={255}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="비밀번호를 다시 입력해 주세요"
              className="h-12 w-full rounded-[9px] border border-white/[0.12] bg-[#0c0f14] px-4 text-[14px] text-[#f4f5f7] outline-none transition placeholder:text-[#646b77] focus:border-[#83a8ff] focus:ring-2 focus:ring-[#83a8ff]/15"
            />
            {passwordMismatch && <p className="text-[10px] text-[#ff9caa]">비밀번호가 일치하지 않아요.</p>}
          </div>

          {error && <p role="alert" className="rounded-lg border border-[#632f3d] bg-[#361d26] px-3.5 py-3 text-xs leading-5 text-[#ff9caa]">{error}</p>}

          <Button
            type="submit"
            variant="accent"
            fullWidth
            loading={isSubmitting}
            disabled={password.length === 0 || !passwordMeetsRules || passwordTooLong || passwordMismatch}
            className="mt-1 h-12 rounded-[9px] bg-[#83a8ff] text-[14px] text-[#101318] hover:bg-[#a1bcff]"
          >
            회원가입
          </Button>
        </form>

        <div className="mt-7 border-t border-white/[0.08] pt-5 text-center">
          <p className="text-xs text-[#858c98]">이미 계정이 있으신가요? <Link href="/login" className="font-medium text-[#c5cad3] hover:text-white">로그인</Link></p>
          <Link href="/" className="mt-5 inline-flex min-h-9 items-center justify-center rounded-md px-3 text-xs text-[#aab1bd] transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#83a8ff]">시작 화면으로</Link>
        </div>
      </section>
    </main>
  );
};
