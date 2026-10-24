import api from "@/_lib/fetcher";
import type { InstructorVideoMutationDto } from "@/types/instructor";

export interface InstructorVideoUpload {
  courseId: number;
  videoType: "OT" | "LESSON";
  title: string;
  file: File;
  sectionId?: number;
  thumbnail?: File;
}

export default async function postInstructorVideo(input: InstructorVideoUpload) {
  const body = new FormData();
  body.set("courseId", String(input.courseId));
  body.set("videoType", input.videoType);
  body.set("title", input.title);
  body.set("file", input.file);
  if (input.sectionId !== undefined) body.set("sectionId", String(input.sectionId));
  if (input.thumbnail) body.set("thumbnail", input.thumbnail);
  const response = await api.post<InstructorVideoMutationDto>({ endpoint: "/instructor/videos", body });
  if (!response) throw new Error("영상 업로드 응답이 비어 있습니다.");
  return response.data;
}
