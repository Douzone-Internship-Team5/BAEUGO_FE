"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, Card } from "@/components/common";
import { LearnerHeader } from "../components/shared/LearnerHeader";
import useCourseDetail from "@/api/learning/useCourseDetail";
import useCourseEnroll from "@/api/learning/useCourseEnroll";
import { getErrorMessage } from "@/_lib/fetcher";

export function EnrollmentPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const courseId = Number(params.courseId);
  const courseQuery = useCourseDetail(courseId);
  const enroll = useCourseEnroll(courseId);
  const course = courseQuery.data;
  if (courseQuery.isLoading) return <main className="p-8 text-center text-sm text-muted">강좌 정보를 불러오는 중이에요.</main>;
  if (!course) return <main className="p-8 text-center text-sm text-muted">강좌 정보를 불러오지 못했습니다.</main>;
  const firstVideoId = course.sections.flatMap((section) => section.videos).find((video) => !video.isLocked)?.videoId;
  return <>
    <LearnerHeader title="수강 신청" backHref={`/learner/courses/${courseId}`} />
    <main className="space-y-5 px-5 py-5">
      <h1 className="text-xl font-medium">수강 신청</h1>
      <Card padding="md" className="border border-line bg-panel"><p className="text-sm font-medium">{course.title}</p><p className="mt-2 text-[11px] text-muted">{course.instructor.name} · {Math.ceil(course.totalLessonDurationSeconds / 60)}분 · 예상 완료 {course.estimatedCompletionDays}일</p></Card>
      <section><h2 className="mb-3 text-xs font-medium">결제 수단</h2><Card padding="md" className="flex items-center justify-between border border-line bg-panel"><span className="text-xs">신한카드 ****-1234</span><button type="button" className="text-xs text-accent">변경</button></Card></section>
      <section className="space-y-3 border-y border-line py-4 text-xs"><div className="flex justify-between"><span className="text-muted">수강료</span><span>{course.isFree ? "무료" : `${course.priceKrw.toLocaleString()}원`}</span></div><div className="flex justify-between font-medium"><span>결제 금액</span><span>{course.isFree ? "무료" : `${course.priceKrw.toLocaleString()}원`}</span></div></section>
      <p className="text-[10px] leading-5 text-muted">시연용 목업 결제예요. 실제로 돈이 나가지 않아요.</p>
      {enroll.isSuccess ? <Card padding="md" className="border border-success-line bg-success-soft-bg text-sm">수강 신청이 완료됐어요. <Link href={firstVideoId ? `/learner/learn/${firstVideoId}` : `/learner/courses/${courseId}`} className="ml-1 text-accent underline">학습 시작하기</Link></Card> : <Button fullWidth disabled={enroll.isPending} onClick={() => enroll.mutate({ accessSource: "COURSE_DETAIL" }, { onSuccess: (data) => { if (data.firstVideoId) router.push(`/learner/learn/${data.firstVideoId}`); } })}>{enroll.isPending ? "신청 중…" : `${course.isFree ? "무료로" : `${course.priceKrw.toLocaleString()}원 결제하고`} 수강 신청`}</Button>}
      {enroll.isError && <p role="alert" className="text-xs text-danger">{getErrorMessage(enroll.error)}</p>}
      <Link href={`/learner/courses/${courseId}`} className="block text-center text-xs text-muted">취소</Link>
    </main>
  </>;
}
