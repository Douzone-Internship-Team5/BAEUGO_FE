import type { Metadata } from "next";
import { InstructorQuizReviewPage } from "../../../components/review/InstructorQuizReviewPage";

interface Props { params: Promise<{ courseId: string }>; searchParams: Promise<{ sectionId?: string }> }
export const metadata: Metadata = { title: "퀴즈 검수" };

export default async function InstructorQuizRoute({ params, searchParams }: Props) {
  const [{ courseId }, { sectionId }] = await Promise.all([params, searchParams]);
  return <InstructorQuizReviewPage courseId={courseId} sectionId={sectionId} />;
}
