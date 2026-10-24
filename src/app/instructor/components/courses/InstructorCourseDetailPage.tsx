"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { AiStatusBadge, Card, CourseStatusBadge } from "@/components/common";
import useInstructorCourse from "@/api/instructor/useInstructorCourse";
import useInstructorCourseStatus from "@/api/instructor/useInstructorCourseStatus";
import { toInstructorCourseDetail } from "@/api/instructor/toInstructorCourse";
import { ApiError } from "@/_lib/fetcher";
import type { InstructorCourseDetail } from "../../data/courses";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";
import { StartEditingConfirmDialog } from "./StartEditingConfirmDialog";

interface Props { courseId: number }

export const InstructorCourseDetailPage = ({ courseId }: Props) => {
  const [showStartEditingConfirm, setShowStartEditingConfirm] = useState(false);
  const courseQuery = useInstructorCourse(courseId);
  const statusMutation = useInstructorCourseStatus(courseId);
  if (courseQuery.isPending) return <PageMessage>강좌 정보를 불러오는 중입니다.</PageMessage>;
  if (courseQuery.error || !courseQuery.data) return <PageMessage error>{courseQuery.error?.message ?? "강좌를 찾을 수 없습니다."}</PageMessage>;
  const course: InstructorCourseDetail = toInstructorCourseDetail(courseQuery.data);
  const completed = course.publishRequirements.filter((item) => item.complete).length;
  const canPublish = courseQuery.data.publishCheck.isReady && ["DRAFT", "EDITING"].includes(course.status);
  const handlePublish = async () => {
    try {
      await statusMutation.mutateAsync("PUBLISHED");
    } catch {
      // Mutation errors are displayed inline.
    }
  };
  const handleStartEditing = async () => {
    try {
      await statusMutation.mutateAsync("EDITING");
      setShowStartEditingConfirm(false);
    } catch {
      // Mutation errors are displayed inline.
    }
  };
  return <div className="min-h-dvh pb-[calc(9.5rem+env(safe-area-inset-bottom))] md:pb-8">
    <InstructorScreenHeader title="강좌 편집 · 공개" backHref="/instructor" />
    <main className="mx-auto max-w-4xl px-4 pt-5 md:px-8 md:pt-8">
      <div className="flex items-center justify-between gap-3"><div><Link href="/instructor" className="mb-2 hidden w-fit cursor-pointer items-center gap-1 text-xs text-muted transition hover:text-text md:flex"><span aria-hidden="true">←</span> 내 강좌</Link><h1 className="text-xl font-medium leading-7 md:text-2xl">{course.title}</h1><p className="mt-1.5 text-[11px] text-muted">{course.category} · {course.topic} · {course.priceKrw.toLocaleString("ko-KR")}원</p></div><CourseStatusBadge status={course.status} /></div>
      {course.status === "OPERATOR_HIDDEN" && <p className="mt-4 rounded-[4px] border border-danger-line bg-danger-bg p-3 text-xs leading-5 text-danger">운영자가 비공개 처리한 강좌입니다. 사유를 확인한 후 콘텐츠를 수정해 주세요.</p>}
      {statusMutation.error && <p role="alert" className="mt-4 rounded-[4px] border border-danger-line bg-danger-bg p-3 text-xs leading-5 text-danger">{statusMutation.error instanceof ApiError ? statusMutation.error.message : "강좌 상태 변경에 실패했습니다."}</p>}

      <Card padding="md" className="mt-5 border border-line">
        <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] tracking-[1px] text-muted">공개 준비</p>{!courseQuery.data.publishCheck.isReady && <h2 className="mt-1 text-sm font-medium">필수 항목을 확인해 주세요</h2>}</div><strong className="text-sm tabular-nums text-accent">{completed}/{course.publishRequirements.length}</strong></div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-card"><div className="h-full rounded-full bg-accent" style={{ width: `${completed / course.publishRequirements.length * 100}%` }} /></div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">{course.publishRequirements.map((item) => <li key={item.label} className="flex items-center gap-2 text-[11px]"><span className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] ${item.complete ? "bg-success-bg text-success" : "bg-card text-dim"}`}>{item.complete ? "✓" : "·"}</span><span className={item.complete ? "text-text-sub" : "text-muted"}>{item.label}</span></li>)}</ul>
      </Card>

      <section className="mt-7"><SectionTitle eyebrow="COURSE CONTENT" title="강의 콘텐츠" />
        <ContentCard title="무료 OT" subtitle="강좌를 소개하는 영상" quizHref={null} quizStatus={null}>
          {course.otVideo ? <VideoRow courseId={course.courseId} video={course.otVideo} /> : <p className="px-3 py-4 text-xs text-muted">등록된 무료 OT 영상이 없습니다.</p>}
        </ContentCard>
        {course.sections.map((section, index) => <ContentCard key={section.sectionId} title={`섹션 ${index + 1}. ${section.title}`} subtitle={`${section.videos.length}개 영상`} quizHref={`/instructor/courses/${course.courseId}/quiz?sectionId=${section.sectionId}`} quizStatus={section.quiz}>
          {section.videos.map((video, videoIndex) => <VideoRow key={`${course.courseId}-${section.sectionId}-${video.videoId ?? video.title}-${videoIndex}`} courseId={course.courseId} video={video} />)}
          {section.videos.length === 0 && <p className="px-3 py-4 text-xs text-muted">등록된 영상이 없습니다.</p>}
        </ContentCard>)}
        <ContentCard title="종합 퀴즈" subtitle={`${course.lessonCount}개 영상 대상`} quizHref={`/instructor/courses/${course.courseId}/quiz?sectionId=final`} quizStatus={course.finalQuiz} />
      </section>
    </main>
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t border-line bg-bg/95 p-3 backdrop-blur md:static md:mt-8 md:border-0 md:bg-transparent md:p-0">
      {course.status === "PUBLISHED" ? (
        <button type="button" onClick={() => setShowStartEditingConfirm(true)} disabled={statusMutation.isPending} className="h-11 w-full cursor-pointer rounded-[4px] border border-line-strong bg-panel text-xs font-medium text-text disabled:cursor-not-allowed disabled:opacity-50 md:mx-auto md:block md:max-w-sm">수정 시작</button>
      ) : course.status === "OPERATOR_HIDDEN" ? (
        <p className="mx-auto max-w-sm rounded-[4px] border border-danger-line bg-danger-bg px-3 py-3 text-center text-xs text-danger">운영자 검토가 완료된 후 수정할 수 있습니다.</p>
      ) : (
        <button type="button" onClick={() => void handlePublish()} disabled={!canPublish || statusMutation.isPending} className="h-11 w-full cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50 md:mx-auto md:block md:max-w-sm">{statusMutation.isPending ? "공개 처리 중…" : canPublish ? "강좌 공개하기" : `공개 항목 확인하기 · ${course.publishRequirements.length - completed}개 남음`}</button>
      )}
    </div>
    <StartEditingConfirmDialog open={showStartEditingConfirm} isPending={statusMutation.isPending} onCancel={() => setShowStartEditingConfirm(false)} onConfirm={() => void handleStartEditing()} />
    <InstructorMobileNav active="courses" />
  </div>;
};

interface PageMessageProps { children: ReactNode; error?: boolean }
const PageMessage = ({ children, error }: PageMessageProps) => <div className={`mx-auto mt-8 max-w-4xl rounded border p-4 text-sm ${error ? "border-danger-line bg-danger-bg text-danger" : "border-line bg-panel text-muted"}`} role={error ? "alert" : "status"}>{children}</div>;

interface SectionTitleProps { eyebrow: string; title: string }
const SectionTitle = ({ eyebrow, title }: SectionTitleProps) => <div className="mb-3"><p className="text-[9px] tracking-[1.4px] text-muted">{eyebrow}</p><h2 className="mt-1 text-base font-medium">{title}</h2></div>;

interface ContentCardProps { title: string; subtitle: string; children?: ReactNode; quizHref: string | null; quizStatus: { status: "COMPLETED" | "PROCESSING" | "PENDING"; reviewed: boolean } | null }
const ContentCard = ({ title, subtitle, children, quizHref, quizStatus }: ContentCardProps) => <Card padding="none" className="mb-3 overflow-hidden border border-line">
  <div className="flex items-center justify-between gap-2 bg-panel px-3 py-3"><div className="min-w-0"><h3 className="truncate text-xs font-medium">{title}</h3><p className="mt-1 text-[10px] text-muted">{subtitle}</p></div>{quizHref && <Link href={quizHref} className="shrink-0 cursor-pointer rounded-full border border-line-strong px-2.5 py-1.5 text-[10px] text-text-sub">퀴즈 검수</Link>}</div>
  {quizStatus && <div className="flex items-center justify-between border-t border-line px-3 py-2.5"><span className="text-[10px] text-muted">단위 퀴즈</span><div className="flex items-center gap-2"><AiStatusBadge status={quizStatus.status} /><span className={`text-[10px] ${quizStatus.reviewed ? "text-success" : "text-warning"}`}>{quizStatus.reviewed ? "검수 완료" : "검수 필요"}</span></div></div>}
  {children && <div className="divide-y divide-line border-t border-line">{children}</div>}
</Card>;

interface VideoRowProps { courseId: number; video: NonNullable<InstructorCourseDetail["otVideo"]> }
const VideoRow = ({ courseId, video }: VideoRowProps) => <Link href={`/instructor/courses/${courseId}/videos/${video.videoId}/script`} className="flex cursor-pointer items-center gap-3 px-3 py-3.5 hover:bg-panel/70"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-selected text-[11px] text-accent">▶</span><span className="min-w-0 flex-1"><span className="block truncate text-xs text-text-sub">{video.title}</span><span className="mt-1 block text-[10px] text-muted">{video.duration}</span></span><span className={`shrink-0 text-[10px] ${video.transcriptReviewed ? "text-success" : "text-warning"}`}>대본 {video.transcriptReviewed ? "완료" : "검수"}</span></Link>;
