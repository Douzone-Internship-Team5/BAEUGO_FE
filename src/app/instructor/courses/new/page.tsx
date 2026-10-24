import type { Metadata } from "next";
import { InstructorCourseCreatePage } from "../../components/courses/InstructorCourseCreatePage";

export const metadata: Metadata = { title: "새 강좌 등록" };

export default function InstructorCourseCreateRoute() {
  return <InstructorCourseCreatePage />;
}
