import api from "@/_lib/fetcher";
import type { InstructorCourseListDto, InstructorCourseStatus } from "@/types/instructor";

export default async function getInstructorCourses(signal?: AbortSignal, status?: InstructorCourseStatus) {
  const query = new URLSearchParams({ page: "1", size: "100" });
  if (status) query.set("status", status);
  const response = await api.get<InstructorCourseListDto>({ endpoint: `/instructor/courses?${query}`, signal });
  if (!response) throw new Error("강좌 목록 응답이 비어 있습니다.");
  return response.data;
}
