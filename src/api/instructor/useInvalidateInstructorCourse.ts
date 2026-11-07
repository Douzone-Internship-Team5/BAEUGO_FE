"use client";

import { useQueryClient } from "@tanstack/react-query";
import { instructorQueryKeys } from "./queryKeys";

/** 섹션·영상을 바꾸면 강좌 상세(공개 준비 항목 포함)와 목록의 개수가 달라지므로 함께 새로 받는다. */
export default function useInvalidateInstructorCourse(courseId: number) {
  const queryClient = useQueryClient();
  return () => Promise.all([
    queryClient.invalidateQueries({ queryKey: instructorQueryKeys.course(courseId) }),
    queryClient.invalidateQueries({ queryKey: instructorQueryKeys.courseLists() }),
  ]);
}
