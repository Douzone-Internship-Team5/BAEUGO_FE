import type { Metadata } from "next";
import { InstructorOnboardingFlow } from "./InstructorOnboardingFlow";

export const metadata: Metadata = {
  title: "강사 온보딩",
  description: "전문 직무와 강의 주제를 소개해 주세요.",
};

export default function InstructorOnboardingPage() {
  return <InstructorOnboardingFlow />;
}
