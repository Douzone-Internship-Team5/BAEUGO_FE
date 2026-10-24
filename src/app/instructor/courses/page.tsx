import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "내 강좌",
};

export default function InstructorCoursesPage() {
  redirect("/instructor");
}
