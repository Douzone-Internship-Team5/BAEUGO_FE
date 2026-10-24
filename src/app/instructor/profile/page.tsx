import type { Metadata } from "next";
import { InstructorProfilePage } from "../components/profile/InstructorProfilePage";

export const metadata: Metadata = { title: "강사 정보 수정" };

export default function InstructorProfileRoute() {
  return <InstructorProfilePage />;
}
