import api from "@/_lib/fetcher";
import type { InstructorCourseCreateRequest, InstructorCourseMutationResponse } from "@/types/instructor";

export default async function postInstructorCourse({ body, thumbnail }: { body: InstructorCourseCreateRequest; thumbnail?: File | null }) {
  const formData = new FormData();
  formData.set("title", body.title);
  formData.set("description", body.description);
  formData.set("categoryId", String(body.categoryId));
  formData.set("topicId", String(body.topicId));
  formData.set("difficulty", body.difficulty);
  formData.set("priceKrw", String(body.priceKrw));
  if (thumbnail) formData.set("thumbnail", thumbnail);
  const response = await api.post<InstructorCourseMutationResponse>({ endpoint: "/instructor/courses", body: formData });
  if (!response) throw new Error("강좌 생성 응답이 비어 있습니다.");
  return response.data;
}
