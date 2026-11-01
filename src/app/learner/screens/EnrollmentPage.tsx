"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useCourseDetail from "@/api/learning/useCourseDetail";
import useCourseEnroll from "@/api/learning/useCourseEnroll";
import { getErrorMessage } from "@/_lib/fetcher";

const PAYMENT_METHODS = ["신한카드 ****-1234", "현대카드 ****-0077"];

export function EnrollmentPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const courseId = Number(params.courseId);
  const courseQuery = useCourseDetail(courseId);
  const enroll = useCourseEnroll(courseId);
  const [paymentMethodIndex, setPaymentMethodIndex] = useState(0);
  const course = courseQuery.data;

  if (courseQuery.isLoading) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#111214] text-sm text-white/70">
        강좌 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (!course) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#111214] text-sm text-white/70">
        강좌 정보를 불러오지 못했습니다.
      </main>
    );
  }

  const firstVideoId = course.sections
    .flatMap((section) => section.videos)
    .find((video) => !video.isLocked)?.videoId;
  const priceLabel = course.isFree
    ? "무료"
    : `${course.priceKrw.toLocaleString()}원`;
  const actionLabel = course.isFree
    ? "무료 신청하고 1강 시작"
    : `${course.priceKrw.toLocaleString()}원 결제하고 1강 시작`;

  const submitEnrollment = () => {
    enroll.mutate(
      { accessSource: "COURSE_DETAIL" },
      {
        onSuccess: (data) => {
          if (data.firstVideoId ?? firstVideoId) {
            router.push(`/learner/learn/${data.firstVideoId ?? firstVideoId}`);
          } else {
            router.push(`/learner/courses/${courseId}`);
          }
        },
      },
    );
  };

  return (
    <main className="fixed inset-0 z-40 flex justify-center bg-black/75 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#111214_0%,#0b0c0e_100%)]" />
        <p className="absolute left-5 top-[31%] text-lg font-semibold text-white/20">
          {course.title}
        </p>
      </div>

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="enrollment-title"
        className="absolute bottom-0 w-full max-w-[430px] rounded-t-[24px] bg-[#17181b] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_rgba(0,0,0,.28)]"
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#3b3d42]" />
        <h1 id="enrollment-title" className="mb-5 text-lg font-semibold">
          수강 신청
        </h1>

        <div className="mb-5 flex items-center gap-3 rounded-md bg-[#0d0e10] p-3.5">
          <div
            aria-hidden="true"
            className="size-14 shrink-0 rounded-md bg-[#222428] bg-cover bg-center"
            style={course.thumbnailUrl ? { backgroundImage: `url("${course.thumbnailUrl}")` } : undefined}
          />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{course.title}</h2>
            <p className="mt-1 truncate text-xs text-white/60">
              {course.instructor.name} · {Math.ceil(course.totalLessonDurationSeconds / 60)}분 · 예상 완료 {course.estimatedCompletionDays}일
            </p>
          </div>
        </div>

        <section aria-label="결제 내역" className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/55">결제 수단</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{PAYMENT_METHODS[paymentMethodIndex]}</span>
              <button
                type="button"
                onClick={() => setPaymentMethodIndex((index) => (index + 1) % PAYMENT_METHODS.length)}
                className="cursor-pointer text-xs text-white/55 underline underline-offset-2"
              >
                변경
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/55">수강료</span>
            <span>{priceLabel}</span>
          </div>
        </section>

        <div className="my-3 border-t border-white/10" />
        <div className="mb-5 flex items-center justify-between font-semibold">
          <span className="text-sm">결제 금액</span>
          <span className="text-lg">{priceLabel}</span>
        </div>

        {!course.isFree && (
          <p className="mb-5 rounded border border-[#514733] bg-[#211f1a] px-3.5 py-3 text-[11px] leading-4 text-[#d5c59c]">
            시연용 목업 결제예요. 실제로 돈이 나가지 않아요.
          </p>
        )}

        {enroll.isError && (
          <p role="alert" className="mb-3 text-xs text-danger">
            {getErrorMessage(enroll.error)}
          </p>
        )}
        <button
          type="button"
          disabled={enroll.isPending}
          onClick={submitEnrollment}
          className="flex h-[52px] w-full cursor-pointer items-center justify-center rounded-full bg-[#f4f3ef] px-4 text-sm font-bold text-[#171719] disabled:cursor-wait disabled:opacity-60"
        >
          {enroll.isPending ? "신청 중…" : actionLabel}
        </button>
        <Link
          href={`/learner/courses/${courseId}`}
          className="mt-3 flex h-8 cursor-pointer items-center justify-center text-xs text-white/55"
        >
          취소
        </Link>
      </section>
    </main>
  );
}
