import type { Metadata } from "next";
import { InstructorAccountPage } from "../components/account/InstructorAccountPage";

export const metadata: Metadata = { title: "계정 설정" };

export default function InstructorAccountRoute() {
  return <InstructorAccountPage />;
}
