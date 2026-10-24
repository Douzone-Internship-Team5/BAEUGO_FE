import api from "@/_lib/fetcher";
import type { InstructorStatsDto } from "@/types/instructor";

export interface InstructorStatsParams {
  courseId?: number;
  from?: string;
  to?: string;
  groupBy?: "day" | "course";
}

export default async function getInstructorStats(params: InstructorStatsParams, signal?: AbortSignal) {
  const query = new URLSearchParams();
  if (params.courseId !== undefined) query.set("courseId", String(params.courseId));
  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);
  if (params.groupBy) query.set("groupBy", params.groupBy);
  const response = await api.get<InstructorStatsDto>({ endpoint: `/instructor/stats${query.size ? `?${query}` : ""}`, signal });
  if (!response) throw new Error("통계 응답이 비어 있습니다.");
  return response.data;
}
