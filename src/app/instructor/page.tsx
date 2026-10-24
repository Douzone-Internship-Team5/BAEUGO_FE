import type { Metadata } from "next";
import { InstructorDashboard } from "./components/dashboard/InstructorDashboard";

export const metadata: Metadata = {
  title: "강사 대시보드",
  description: "강좌 성과와 콘텐츠 준비 상태를 확인합니다.",
};

export default function InstructorPage() {
  return <InstructorDashboard />;
}
