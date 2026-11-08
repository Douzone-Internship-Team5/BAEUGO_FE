import api from "@/_lib/fetcher";
import type { InstructorCourseMutationResponse, InstructorCourseUpdateRequest } from "@/types/instructor";

/** 썸네일을 바꿀 때는 multipart, 아니면 JSON으로 보낸다(백엔드 CourseRoute가 둘 다 받음). */
export default async function patchInstructorCourse(courseId: number, body: InstructorCourseUpdateRequest, thumbnail?: File | null) {
  let payload: InstructorCourseUpdateRequest | FormData = body;
  if (thumbnail) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && value !== null) formData.set(key, String(value));
    }
    formData.set("thumbnail", thumbnail);
    payload = formData;
  }
  const response = await api.patch<InstructorCourseMutationResponse>({ endpoint: `/instructor/courses/${courseId}`, body: payload });
  if (!response) throw new Error("강좌 수정 응답이 비어 있습니다.");
  return response.data;
}
