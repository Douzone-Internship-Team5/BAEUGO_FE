"use client";

import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/_lib/fetcher";
import useCreateInstructorCourse from "@/api/instructor/useCreateInstructorCourse";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";
import { InstructorCourseInfoForm } from "./InstructorCourseInfoForm";

interface Props { className?: string }

export const InstructorCourseCreatePage = ({ className = "" }: Props) => {
  const router = useRouter();
  const createMutation = useCreateInstructorCourse();

  return <div className={`min-h-dvh pb-24 ${className}`}>
    <InstructorScreenHeader title="새 강좌 · 기본 정보" />
    <main className="mx-auto max-w-2xl px-4 pt-5 md:px-8 md:pt-8">
      <p className="text-sm leading-6 text-text-sub">강좌 기본 정보를 입력해 주세요.<br />나중에 강좌 편집 화면에서 수정할 수 있어요.</p>
      <InstructorCourseInfoForm
        formId="create-instructor-course"
        submitLabel="저장하고 커리큘럼 만들기"
        pendingLabel="저장 중…"
        isPending={createMutation.isPending}
        errorMessage={createMutation.error ? getErrorMessage(createMutation.error) : undefined}
        onSubmit={(body, thumbnail) => createMutation.mutate({ body, thumbnail }, { onSuccess: (result) => router.push(`/instructor/courses/${result.courseId}`) })}
      />
    </main>
    <InstructorMobileNav active="new" />
  </div>;
};
