import type { Metadata } from "next";
import { RoleSelection } from "./components/role/RoleSelection";

export const metadata: Metadata = {
  title: "시작하기 | 배우고",
  description: "수강자 또는 강사로 배우고를 시작해 보세요.",
};

export default function OnboardingPage() {
  return <RoleSelection />;
}
