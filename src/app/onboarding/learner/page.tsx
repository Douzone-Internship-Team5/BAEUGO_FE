import type { Metadata } from "next";
import { LearnerOnboardingFlow } from "./LearnerOnboardingFlow";

export const metadata: Metadata = {
  title: "수강자 온보딩 | 배우고",
  description: "관심 직무와 학습 목표를 선택해 주세요.",
};

export default function LearnerOnboardingPage() {
  return <LearnerOnboardingFlow />;
}
