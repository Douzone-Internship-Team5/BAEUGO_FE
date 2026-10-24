import type { Metadata } from "next";
import { InstructorScriptReviewPage } from "../../../../../components/review/InstructorScriptReviewPage";

interface Props { params: Promise<{ courseId: string; videoId: string }> }
export const metadata: Metadata = { title: "대본 검수" };

export default async function InstructorScriptRoute({ params }: Props) {
  const { courseId, videoId } = await params;
  return <InstructorScriptReviewPage courseId={courseId} videoId={videoId} />;
}
