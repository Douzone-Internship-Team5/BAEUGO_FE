"use client";

import { useMutation } from "@tanstack/react-query";
import deleteInstructorVideo from "./deleteInstructorVideo";
import useInvalidateInstructorCourse from "./useInvalidateInstructorCourse";

export default function useDeleteInstructorVideo(courseId: number) {
  const invalidate = useInvalidateInstructorCourse(courseId);
  return useMutation({ mutationFn: (videoId: number) => deleteInstructorVideo(videoId), onSuccess: invalidate });
}
