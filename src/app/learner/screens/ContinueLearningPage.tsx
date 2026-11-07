"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useCourseDetail from "@/api/learning/useCourseDetail";
import useEnrollmentNext from "@/api/learning/useEnrollmentNext";
import { getErrorMessage } from "@/_lib/fetcher";
import { getNextLearningHref } from "../_lib/learningHref";

/** 수강 중인 강좌의 마지막 학습 위치(다음 미완료 영상·퀴즈)로 바로 보낸다. */
export function ContinueLearningPage() {
  const router = useRouter();
  const courseId = Number(useParams<{ courseId: string }>().courseId);
  const course = useCourseDetail(courseId);
  const enrollmentId = course.data?.enrollment.enrollmentId ?? 0;
  const next = useEnrollmentNext(enrollmentId);

  useEffect(() => {
    if (!course.data) return;
    if (!course.data.enrollment.isEnrolled || !enrollmentId) {
      router.replace(`/learner/courses/${courseId}`);
      return;
    }
    if (next.data) router.replace(getNextLearningHref(next.data, courseId));
  }, [course.data, courseId, enrollmentId, next.data, router]);

  const error = course.error ?? next.error;
  return <main className="grid min-h-dvh place-items-center p-8 text-center text-sm text-muted">
    {error ? <div><p role="alert">{getErrorMessage(error, "이어서 볼 학습을 찾지 못했어요.")}</p><Link href={`/learner/courses/${courseId}`} className="mt-3 inline-block text-xs text-accent">강좌로 돌아가기</Link></div> : "마지막으로 학습한 곳을 찾는 중이에요."}
  </main>;
}
