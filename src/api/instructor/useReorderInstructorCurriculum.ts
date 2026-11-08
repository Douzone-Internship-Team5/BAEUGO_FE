"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InstructorCourseDetailDto } from "@/types/instructor";
import patchInstructorSection from "./patchInstructorSection";
import patchInstructorVideo from "./patchInstructorVideo";
import { instructorQueryKeys } from "./queryKeys";
import useInvalidateInstructorCourse from "./useInvalidateInstructorCourse";

/** 영상 순서를 서로 바꿀 때 잠깐 비켜 둘 값. 백엔드는 같은 섹션에서 sortOrder가 겹치면 거절한다. */
const TEMP_VIDEO_ORDER_BASE = 100_000;

type Reorder =
  | { kind: "sections"; sectionIds: number[] }
  | { kind: "videos"; sectionId: number; videoIds: number[] };

const sameOrder = (a: number[], b: number[]) => a.length === b.length && a.every((value, index) => value === b[index]);

/**
 * 섹션 순서와 섹션 안 학습 영상 순서를 바꾼다.
 * 화면이 바로 바뀌도록 캐시를 먼저 고치고, 끝나면(실패해도) 서버 값으로 다시 맞춘다.
 */
export default function useReorderInstructorCurriculum(courseId: number) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateInstructorCourse(courseId);
  const key = instructorQueryKeys.course(courseId);

  const mutation = useMutation({
    mutationFn: async ({ change, before }: { change: Reorder; before: InstructorCourseDetailDto }) => {
      if (change.kind === "sections") {
        const current = new Map(before.sections.map((section) => [section.sectionId, section.sortOrder]));
        for (const [index, sectionId] of change.sectionIds.entries()) {
          if (current.get(sectionId) !== index + 1) await patchInstructorSection(sectionId, { sortOrder: index + 1 });
        }
        return;
      }
      const section = before.sections.find((item) => item.sectionId === change.sectionId);
      const current = new Map(section?.videos.map((video) => [video.videoId, video.sortOrder]));
      const moved = change.videoIds.map((videoId, index) => ({ videoId, target: index + 1 })).filter(({ videoId, target }) => current.get(videoId) !== target);
      for (const [index, { videoId }] of moved.entries()) await patchInstructorVideo(videoId, { sortOrder: TEMP_VIDEO_ORDER_BASE + index });
      for (const { videoId, target } of moved) await patchInstructorVideo(videoId, { sortOrder: target });
    },
    onSettled: invalidate,
  });

  /** 드래그를 놓은 이벤트 안에서 부른다. 캐시를 동기적으로 고쳐 목록이 원래 자리로 튀지 않게 한다. */
  const reorder = (change: Reorder) => {
    const before = queryClient.getQueryData<InstructorCourseDetailDto>(key);
    if (!before) return;
    let next: InstructorCourseDetailDto;
    if (change.kind === "sections") {
      if (sameOrder(change.sectionIds, before.sections.map((section) => section.sectionId))) return;
      const byId = new Map(before.sections.map((section) => [section.sectionId, section]));
      next = { ...before, sections: change.sectionIds.flatMap((id, index) => { const section = byId.get(id); return section ? [{ ...section, sortOrder: index + 1 }] : []; }) };
    } else {
      const section = before.sections.find((item) => item.sectionId === change.sectionId);
      if (!section || sameOrder(change.videoIds, section.videos.map((video) => video.videoId))) return;
      const byId = new Map(section.videos.map((video) => [video.videoId, video]));
      const videos = change.videoIds.flatMap((id, index) => { const video = byId.get(id); return video ? [{ ...video, sortOrder: index + 1 }] : []; });
      next = { ...before, sections: before.sections.map((item) => (item.sectionId === change.sectionId ? { ...item, videos } : item)) };
    }
    queryClient.setQueryData(key, next);
    mutation.mutate({ change, before });
  };

  return { reorder, isPending: mutation.isPending, error: mutation.error };
}
