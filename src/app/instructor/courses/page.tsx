import type { Metadata } from "next";
import { InstructorCourseListPage } from "../components/courses/InstructorCourseListPage";

export const metadata: Metadata = {
  title: "내 강좌",
};

export default function InstructorCoursesPage() {
  return <InstructorCourseListPage />;
}
