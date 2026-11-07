import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupPage } from "./SignupPage";

export const metadata: Metadata = {
  title: "회원가입",
  description: "배우고 계정을 만들고 수강자 또는 강사로 시작합니다.",
};

export default function Page() {
  return <Suspense fallback={<main className="grid min-h-dvh place-items-center bg-[#0b0d11] text-sm text-[#9299a5]">회원가입 화면을 불러오는 중…</main>}><SignupPage /></Suspense>;
}
