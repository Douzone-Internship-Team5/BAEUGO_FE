import type { Metadata } from "next";
import { InstructorStatsPage } from "../components/stats/InstructorStatsPage";

export const metadata: Metadata = { title: "강사 통계" };

export default function InstructorStatsRoute() {
  return <InstructorStatsPage />;
}
