"use client";

import { getDifficultyLabel } from "@/_lib/codes";
import useCodes from "@/api/codes/useCodes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card } from "@/components/common";
import useCourseDetail from "@/api/learning/useCourseDetail";
import useCourseCompletion from "@/api/learning/useCourseCompletion";
import { LearnerHeader } from "../components/shared/LearnerHeader";
import { SectionTitle, Stat } from "../components/shared/LearnerUI";


export function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const query = useCourseDetail(courseId);
  const { data: codes } = useCodes();
  const course = query.data;
  const completion = useCourseCompletion(courseId, !!course?.enrollment.isEnrolled).data;
  if (query.isLoading) return <main className="p-8 text-center text-sm text-muted">강좌 정보를 불러오는 중이에요.</main>;
  if (!course) return <main className="p-8 text-center text-sm text-muted">강좌 정보를 불러오지 못했습니다.</main>;
  return <>
    <LearnerHeader title="강좌 상세" backHref="/learner/explore" />
    <main className="pb-36">
      <Link href={course.otVideo ? `/learner/learn/${course.otVideo.videoId}` : "#"} aria-label="무료 OT 재생" className="flex h-[230px] items-end bg-[linear-gradient(135deg,#273247,#141619_75%)] p-5"><span className="rounded-full bg-black/40 px-3 py-1.5 text-xs">{course.otVideo ? `무료 OT · ${Math.floor(course.otVideo.durationSeconds / 60)}:${String(course.otVideo.durationSeconds % 60).padStart(2, "0")}` : "무료 OT 없음"} <span aria-hidden="true">▶</span></span></Link>
      <section className="space-y-3 px-5 py-5"><p className="text-[11px] text-muted">{course.category.name} · {course.topic.name} · {getDifficultyLabel(codes, course.difficulty)}</p><h1 className="text-xl font-medium">{course.title}</h1><p className="text-xs leading-5 text-muted">{course.description}</p><div className="flex gap-2 pt-2"><Stat label="총 학습" value={`${Math.floor(course.totalLessonDurationSeconds / 60)}분`} /><Stat label="강의" value={`${course.totalLessonCount}개`} /><Stat label="예상 완료" value={`${course.estimatedCompletionDays}일`} tooltip="하루 목표 기준 예상이에요" /></div></section>
      <section className="border-y border-line px-5 py-4"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-selected text-sm">{course.instructor.name.slice(0, 1)}</span><div><p className="text-sm font-medium">{course.instructor.name}</p><p className="mt-1 text-[11px] text-muted">{course.instructor.bio}</p></div></div></section>
      <section className="px-5 py-5">
        <SectionTitle>커리큘럼</SectionTitle>
        <p className="mb-3 text-[10px] text-muted">총 {course.totalLessonCount}강 · 학습 진도 {course.enrollment.progressPercent}%</p>
        {completion && (
          <Card padding="sm" className={`mb-3 border text-xs ${completion.isCompleted ? "border-success-line bg-success-soft-bg" : "border-line bg-panel"}`}>
            <p className="font-medium">{completion.isCompleted ? "수료 완료" : "수료 전"}</p>
            <p className="mt-1 text-[11px] text-muted">{completion.message}</p>
            {completion.redirectTarget === "LIBRARY_QUIZ_NOTES" && <Link href="/learner/library/quiz" className="mt-2 inline-block text-[11px] text-accent">오답노트에서 해결하기 →</Link>}
          </Card>
        )}
        <div className="space-y-2">
          {course.sections.flatMap((section) => section.videos.map((video) => {
            const videoCard = (
              <Card padding="sm" className={`flex items-center gap-3 border border-line bg-panel ${video.isLocked ? "opacity-50" : "transition-colors hover:border-accent"}`}>
                <span className="w-6 text-center text-xs text-muted">{video.isCompleted ? "✓" : video.isLocked ? "🔒" : "▶"}</span>
                <span className="flex-1 text-xs">{video.title}</span>
                <span className="text-[10px] text-muted">{video.isLocked ? "잠김" : `${Math.floor(video.durationSeconds / 60)}분`}</span>
              </Card>
            );

            return video.isLocked ? (
              <div key={video.videoId} aria-disabled="true">{videoCard}</div>
            ) : (
              <Link
                key={video.videoId}
                href={`/learner/learn/${video.videoId}`}
                aria-label={`${video.title} 재생`}
                className="block rounded-[4px] focus-visible:outline-2 focus-visible:outline-accent"
              >
                {videoCard}
              </Link>
            );
          }))}
        </div>
      </section>
    </main>
    <div className="fixed inset-x-0 bottom-[68px] z-10 mx-auto flex max-w-[430px] items-center justify-between border-t border-line bg-panel px-5 py-3"><div><p className="text-[10px] text-muted">수강료</p><p className="mt-0.5 text-sm font-medium">{course.isFree ? "무료" : `${course.priceKrw.toLocaleString()}원`}</p></div><Link href={`/learner/enroll/${course.courseId}`}><Button>{course.enrollment.isEnrolled ? "이어서 학습" : "수강 신청하기"}</Button></Link></div>
  </>;
}
