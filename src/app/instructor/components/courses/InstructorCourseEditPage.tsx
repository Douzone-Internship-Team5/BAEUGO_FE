"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/_lib/fetcher";
import useInstructorCourse from "@/api/instructor/useInstructorCourse";
import useUpdateInstructorCourse from "@/api/instructor/useUpdateInstructorCourse";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";
import { InstructorCourseInfoForm } from "./InstructorCourseInfoForm";

/** 백엔드 INSTRUCTOR_EDITABLE_STATUSES와 같다. */
const EDITABLE_STATUSES = ["DRAFT", "EDITING", "OPERATOR_HIDDEN"];

export const InstructorCourseEditPage = ({ courseId }: { courseId: number }) => {
  const router = useRouter();
  const courseQuery = useInstructorCourse(courseId);
  const updateMutation = useUpdateInstructorCourse(courseId);
  const course = courseQuery.data;
  const detailHref = `/instructor/courses/${courseId}`;

  return <div className="min-h-dvh pb-24">
    <InstructorScreenHeader title="강좌 정보 수정" backHref={detailHref} />
    <main className="mx-auto max-w-2xl px-4 pt-5 md:px-8 md:pt-8">
      {courseQuery.isPending && <p className="py-8 text-center text-sm text-muted">강좌 정보를 불러오는 중입니다.</p>}
      {courseQuery.error && <p role="alert" className="rounded-[4px] border border-danger-line bg-danger-bg p-3 text-xs text-danger">{getErrorMessage(courseQuery.error)}</p>}
      {course && !EDITABLE_STATUSES.includes(course.status) && (
        <div className="rounded-[4px] border border-line bg-panel p-4 text-xs leading-5 text-text-sub">
          공개 중인 강좌는 바로 수정할 수 없어요. 강좌 상세에서 &quot;수정 시작&quot;을 누른 뒤 다시 시도해 주세요.
          <Link href={detailHref} className="mt-3 block text-accent">강좌 상세로 돌아가기 →</Link>
        </div>
      )}
      {course && EDITABLE_STATUSES.includes(course.status) && <>
        <p className="text-sm leading-6 text-text-sub">바꿀 내용을 고친 뒤 저장해 주세요. 썸네일은 새 이미지를 고를 때만 바뀌어요.</p>
        <InstructorCourseInfoForm
          formId="edit-instructor-course"
          initial={{ title: course.title, description: course.description, categoryId: course.categoryId, topicId: course.topicId, difficulty: course.difficulty, priceKrw: course.priceKrw }}
          currentThumbnailUrl={course.thumbnailUrl}
          submitLabel="저장하기"
          pendingLabel="저장 중…"
          isPending={updateMutation.isPending}
          errorMessage={updateMutation.error ? getErrorMessage(updateMutation.error) : undefined}
          onSubmit={(body, thumbnail) => updateMutation.mutate({ body, thumbnail }, { onSuccess: () => router.push(detailHref) })}
        />
      </>}
    </main>
  </div>;
};
