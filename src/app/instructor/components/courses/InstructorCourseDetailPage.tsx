"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { AiStatusBadge, Card, CourseStatusBadge } from "@/components/common";
import useInstructorCourse from "@/api/instructor/useInstructorCourse";
import useInstructorCourseStatus from "@/api/instructor/useInstructorCourseStatus";
import useCodes from "@/api/codes/useCodes";
import { toInstructorCourseDetail } from "@/api/instructor/toInstructorCourse";
import { ApiError, getErrorMessage } from "@/_lib/fetcher";
import type { InstructorCourseDetail } from "@/types/instructor";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";
import { StartEditingConfirmDialog } from "./StartEditingConfirmDialog";
import { InstructorVideoUpload } from "./InstructorVideoUpload";
import { InstructorSectionActions } from "./InstructorSectionActions";
import { InstructorSectionCreate } from "./InstructorSectionCreate";
import useDeleteInstructorVideo from "@/api/instructor/useDeleteInstructorVideo";
import useDeleteInstructorCourse from "@/api/instructor/useDeleteInstructorCourse";
import useReorderInstructorCurriculum from "@/api/instructor/useReorderInstructorCurriculum";
import { InstructorVideoEditForm } from "./InstructorVideoEditForm";
import { useDragSort } from "./useDragSort";

interface Props {
  courseId: number;
}

export const InstructorCourseDetailPage = ({ courseId }: Props) => {
  const [showStartEditingConfirm, setShowStartEditingConfirm] = useState(false);
  const courseQuery = useInstructorCourse(courseId);
  const statusMutation = useInstructorCourseStatus(courseId);
  const { data: codes } = useCodes();
  if (courseQuery.isPending)
    return <PageMessage>강좌 정보를 불러오는 중입니다.</PageMessage>;
  if (courseQuery.error || !courseQuery.data)
    return (
      <PageMessage error>
        {courseQuery.error?.message ?? "강좌를 찾을 수 없습니다."}
      </PageMessage>
    );
  const course: InstructorCourseDetail = toInstructorCourseDetail(
    courseQuery.data,
    codes,
  );
  const completed = course.publishRequirements.filter(
    (item) => item.complete,
  ).length;
  // 백엔드 INSTRUCTOR_EDITABLE_STATUSES와 같다. 공개 중인 강좌는 "수정 시작" 후 편집할 수 있다.
  const isEditable = ["DRAFT", "EDITING", "OPERATOR_HIDDEN"].includes(course.status);
  const canPublish =
    courseQuery.data.publishCheck.isReady &&
    ["DRAFT", "EDITING"].includes(course.status);
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
  return (
    <div className="min-h-dvh pb-[calc(9.5rem+env(safe-area-inset-bottom))] md:pb-8">
      <InstructorScreenHeader title="강좌 편집 · 공개" backHref="/instructor" />
      <main className="mx-auto max-w-4xl px-4 pt-5 md:px-8 md:pt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link
              href="/instructor"
              className="mb-2 hidden w-fit cursor-pointer items-center gap-1 text-xs text-muted transition hover:text-text md:flex"
            >
              <span aria-hidden="true">←</span> 내 강좌
            </Link>
            <h1 className="text-xl font-medium leading-7 md:text-2xl">
              {course.title}
            </h1>
            <p className="mt-1.5 text-[11px] text-muted">
              {course.category} · {course.topic} ·{" "}
              {course.priceKrw.toLocaleString("ko-KR")}원
            </p>
            {isEditable && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Link href={`/instructor/courses/${course.courseId}/edit`} className="inline-flex w-fit items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[11px] text-text-sub transition hover:border-accent hover:text-accent">
                  강좌 정보 수정
                </Link>
                {/* 백엔드는 한 번도 공개된 적 없는 작성 중 강좌만 삭제한다. */}
                {course.status === "DRAFT" && !course.publishedAt && <CourseDeleteButton courseId={course.courseId} />}
              </div>
            )}
          </div>
          <CourseStatusBadge status={course.status} />
        </div>
        {course.status === "OPERATOR_HIDDEN" && (
          <p className="mt-4 rounded-[4px] border border-danger-line bg-danger-bg p-3 text-xs leading-5 text-danger">
            운영자가 비공개 처리한 강좌입니다. 콘텐츠를 수정할 수 있으며, 보완을 마친 뒤 운영자에게 재공개를 요청해 주세요.
          </p>
        )}
        {statusMutation.error && (
          <p
            role="alert"
            className="mt-4 rounded-[4px] border border-danger-line bg-danger-bg p-3 text-xs leading-5 text-danger"
          >
            {statusMutation.error instanceof ApiError
              ? statusMutation.error.message
              : "강좌 상태 변경에 실패했습니다."}
          </p>
        )}

        {!courseQuery.data.publishCheck.isReady && (
          <Card padding="md" className="mt-5 border border-line">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[1px] text-muted">
                  공개 준비
                </p>
                <h2 className="mt-1 text-sm font-medium">
                  필수 항목을 확인해 주세요
                </h2>
              </div>
              <strong className="text-sm tabular-nums text-accent">
                {completed}/{course.publishRequirements.length}
              </strong>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-card">
              <div
                className="h-full rounded-full bg-accent"
                style={{
                  width: `${(completed / course.publishRequirements.length) * 100}%`,
                }}
              />
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {course.publishRequirements.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-[11px]"
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] ${item.complete ? "bg-success-bg text-success" : "bg-card text-dim"}`}
                  >
                    {item.complete ? "✓" : "·"}
                  </span>
                  <span
                    className={item.complete ? "text-text-sub" : "text-muted"}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <section className="mt-7">
          <SectionTitle eyebrow="" title="강의 콘텐츠" />
          <ContentCard
            title="무료 OT"
            subtitle="강좌를 소개하는 영상"
            quizHref={null}
            quizStatus={null}
          >
            {course.otVideo ? (
              <VideoRow courseId={course.courseId} video={course.otVideo} editable={isEditable} />
            ) : (
              <p className="px-3 py-4 text-xs text-muted">
                등록된 무료 OT 영상이 없습니다.
              </p>
            )}
            {isEditable && (
              <InstructorVideoUpload
                courseId={course.courseId}
                videoType="OT"
                currentTitle={course.otVideo?.title}
              />
            )}
          </ContentCard>
          <SectionList course={course} isEditable={isEditable} />
          {isEditable ? (
            <InstructorSectionCreate courseId={course.courseId} />
          ) : (
            course.status === "PUBLISHED" && (
              <p className="mb-3 text-[11px] text-muted">
                섹션과 학습 영상을 바꾸려면 아래 &quot;수정 시작&quot;을 눌러 주세요.
              </p>
            )
          )}
          <ContentCard
            title="종합 퀴즈"
            subtitle={`${course.lessonCount}개 영상 대상`}
            quizHref={`/instructor/courses/${course.courseId}/quiz?sectionId=final`}
            quizStatus={course.finalQuiz}
          />
        </section>
      </main>
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t border-line bg-bg/95 p-3 backdrop-blur md:static md:mt-8 md:border-0 md:bg-transparent md:p-0">
        {course.status === "PUBLISHED" ? (
          <button
            type="button"
            onClick={() => setShowStartEditingConfirm(true)}
            disabled={statusMutation.isPending}
            className="h-11 w-full cursor-pointer rounded-[4px] border border-line-strong bg-panel text-xs font-medium text-text disabled:cursor-not-allowed disabled:opacity-50 md:mx-auto md:block md:max-w-sm"
          >
            수정 시작
          </button>
        ) : course.status === "OPERATOR_HIDDEN" ? (
          <p role="status" className="mx-auto max-w-sm rounded-[4px] border border-danger-line bg-danger-bg px-3 py-3 text-center text-xs leading-5 text-danger">
            콘텐츠를 수정할 수 있습니다. 재공개는 운영자가 진행합니다.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => void handlePublish()}
            disabled={!canPublish || statusMutation.isPending}
            className="h-11 w-full cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50 md:mx-auto md:block md:max-w-sm"
          >
            {statusMutation.isPending
              ? "공개 처리 중…"
              : canPublish
                ? "강좌 공개하기"
                : `공개까지 ${course.publishRequirements.length - completed}개 항목 남음`}
          </button>
        )}
      </div>
      <StartEditingConfirmDialog
        open={showStartEditingConfirm}
        isPending={statusMutation.isPending}
        onCancel={() => setShowStartEditingConfirm(false)}
        onConfirm={() => void handleStartEditing()}
      />
      <InstructorMobileNav active="courses" />
    </div>
  );
};

interface PageMessageProps {
  children: ReactNode;
  error?: boolean;
}
const PageMessage = ({ children, error }: PageMessageProps) => (
  <div
    className={`mx-auto mt-8 max-w-4xl rounded border p-4 text-sm ${error ? "border-danger-line bg-danger-bg text-danger" : "border-line bg-panel text-muted"}`}
    role={error ? "alert" : "status"}
  >
    {children}
  </div>
);

interface SectionTitleProps {
  eyebrow: string;
  title: string;
}
const SectionTitle = ({ eyebrow, title }: SectionTitleProps) => (
  <div className="mb-3">
    <p className="text-[9px] tracking-[1.4px] text-muted">{eyebrow}</p>
    <h2 className="mt-1 text-base font-medium">{title}</h2>
  </div>
);

interface ContentCardProps {
  title: string;
  handle?: ReactNode;
  cardRef?: (element: HTMLElement | null) => void;
  dragging?: boolean;
  subtitle: string;
  children?: ReactNode;
  quizHref: string | null;
  quizStatus: {
    status: "COMPLETED" | "PROCESSING" | "PENDING";
    reviewed: boolean;
  } | null;
}
const ContentCard = ({
  title,
  handle,
  cardRef,
  dragging = false,
  subtitle,
  children,
  quizHref,
  quizStatus,
}: ContentCardProps) => (
  <div ref={cardRef} className={`rounded-[4px] transition-shadow ${dragging ? "relative z-10 shadow-lg ring-2 ring-accent" : ""}`}>
  <Card padding="none" className="mb-3 overflow-hidden border border-line">
    <div className="flex items-center justify-between gap-2 bg-panel px-3 py-3">
      {handle}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-xs font-medium">{title}</h3>
        <p className="mt-1 text-[10px] text-muted">{subtitle}</p>
      </div>
      {quizHref && (
        <Link
          href={quizHref}
          className="shrink-0 cursor-pointer rounded-full border border-line-strong px-2.5 py-1.5 text-[10px] text-text-sub"
        >
          퀴즈 검수
        </Link>
      )}
    </div>
    {quizStatus && (
      <div className="flex items-center justify-between border-t border-line px-3 py-2.5">
        <span className="text-[10px] text-muted">단위 퀴즈</span>
        <div className="flex items-center gap-2">
          <AiStatusBadge status={quizStatus.status} />
          <span
            className={`text-[10px] ${quizStatus.reviewed ? "text-success" : "text-warning"}`}
          >
            {quizStatus.reviewed ? "검수 완료" : "검수 필요"}
          </span>
        </div>
      </div>
    )}
    {children && (
      <div className="divide-y divide-line border-t border-line">
        {children}
      </div>
    )}
  </Card>
  </div>
);

interface VideoRowProps {
  courseId: number;
  video: NonNullable<InstructorCourseDetail["otVideo"]>;
  editable?: boolean;
  deletable?: boolean;
  handle?: ReactNode;
}
const VideoRow = ({ courseId, video, editable = false, deletable = false, handle }: VideoRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  if (!editable && !deletable) return <VideoLink courseId={courseId} video={video} />;
  return (
    <div>
      <div className="flex items-stretch">
        {handle}
        <div className="min-w-0 flex-1">
          <VideoLink courseId={courseId} video={video} />
        </div>
        {editable && (
          <div className="flex shrink-0 items-center pl-1">
            <button type="button" aria-label={`${video.title} 영상 수정`} aria-expanded={isEditing} onClick={() => setIsEditing((open) => !open)} className="cursor-pointer rounded-[4px] px-2 py-1.5 text-[10px] text-muted transition hover:text-text">
              수정
            </button>
          </div>
        )}
        {deletable && <VideoDeleteButton courseId={courseId} videoId={video.videoId} title={video.title} />}
      </div>
      {isEditing && <InstructorVideoEditForm courseId={courseId} videoId={video.videoId} title={video.title} onClose={() => setIsEditing(false)} />}
    </div>
  );
};

type HandleProps = ReturnType<ReturnType<typeof useDragSort<number>>["handleProps"]>;
/** 끌어서 순서를 바꾸는 손잡이. 포커스 후 ↑/↓ 키로도 옮길 수 있다. */
const DragHandle = ({ label, props, className = "" }: { label: string; props: HandleProps; className?: string }) => (
  <button
    type="button"
    aria-label={`${label} 순서 바꾸기 (끌거나 위아래 화살표 키)`}
    className={`flex shrink-0 cursor-grab touch-none select-none items-center justify-center text-dim transition hover:text-text active:cursor-grabbing aria-disabled:cursor-wait aria-disabled:opacity-40 ${className}`}
    {...(props as HTMLAttributes<HTMLButtonElement>)}
  >
    <svg aria-hidden="true" width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><circle cx="2" cy="2" r="1.3" /><circle cx="8" cy="2" r="1.3" /><circle cx="2" cy="7" r="1.3" /><circle cx="8" cy="7" r="1.3" /><circle cx="2" cy="12" r="1.3" /><circle cx="8" cy="12" r="1.3" /></svg>
  </button>
);

interface SectionListProps {
  course: InstructorCourseDetail;
  isEditable: boolean;
}
/** 섹션 카드 목록. 편집할 수 있으면 섹션과 섹션 안 학습 영상을 끌어서 순서를 바꾼다. */
const SectionList = ({ course, isEditable }: SectionListProps) => {
  const { reorder, isPending, error } = useReorderInstructorCurriculum(course.courseId);
  const sectionsById = new Map(course.sections.map((section) => [section.sectionId, section]));
  const sort = useDragSort(
    course.sections.map((section) => section.sectionId),
    (sectionIds) => reorder({ kind: "sections", sectionIds }),
    isPending,
  );
  return (
    <>
      {isEditable && course.sections.length > 1 && <p className="mb-2 text-[10px] text-muted">왼쪽 손잡이를 끌어 섹션과 영상 순서를 바꿀 수 있어요.</p>}
      {error && <p role="alert" className="mb-3 rounded-[4px] border border-danger-line bg-danger-bg p-3 text-xs leading-5 text-danger">순서를 저장하지 못했어요. {getErrorMessage(error)}</p>}
      {isPending && <p role="status" className="mb-2 text-[10px] text-accent">순서를 저장하는 중…</p>}
      {sort.order.map((sectionId, index) => {
        const section = sectionsById.get(sectionId);
        if (!section) return null;
        return (
          <ContentCard
            key={section.sectionId}
            cardRef={sort.itemRef(section.sectionId)}
            dragging={sort.draggingKey === section.sectionId}
            handle={isEditable && course.sections.length > 1 ? <DragHandle label={`섹션 ${section.title}`} props={sort.handleProps(section.sectionId)} className="-ml-1 h-8 w-6" /> : undefined}
            title={`섹션 ${index + 1}. ${section.title}`}
            subtitle={`${section.videos.length}개 영상`}
            quizHref={`/instructor/courses/${course.courseId}/quiz?sectionId=${section.sectionId}`}
            quizStatus={section.quiz}
          >
            <SectionVideos courseId={course.courseId} section={section} isEditable={isEditable} reorder={reorder} isPending={isPending} />
            {section.videos.length === 0 && (
              <p className="px-3 py-4 text-xs text-muted">
                등록된 영상이 없습니다.
              </p>
            )}
            {isEditable && (
              <InstructorVideoUpload
                courseId={course.courseId}
                videoType="LESSON"
                sectionId={section.sectionId}
              />
            )}
            {isEditable && (
              <InstructorSectionActions
                courseId={course.courseId}
                sectionId={section.sectionId}
                title={section.title}
              />
            )}
          </ContentCard>
        );
      })}
    </>
  );
};

interface SectionVideosProps {
  courseId: number;
  section: InstructorCourseDetail["sections"][number];
  isEditable: boolean;
  reorder: ReturnType<typeof useReorderInstructorCurriculum>["reorder"];
  isPending: boolean;
}
const SectionVideos = ({ courseId, section, isEditable, reorder, isPending }: SectionVideosProps) => {
  const videosById = new Map(section.videos.map((video) => [video.videoId, video]));
  const sort = useDragSort(
    section.videos.map((video) => video.videoId),
    (videoIds) => reorder({ kind: "videos", sectionId: section.sectionId, videoIds }),
    isPending,
  );
  const sortable = isEditable && section.videos.length > 1;
  return sort.order.map((videoId) => {
    const video = videosById.get(videoId);
    if (!video) return null;
    return (
      <div key={video.videoId} ref={sort.itemRef(video.videoId)} className={sort.draggingKey === video.videoId ? "relative z-10 bg-panel shadow-lg ring-2 ring-accent" : ""}>
        <VideoRow
          courseId={courseId}
          video={video}
          editable={isEditable}
          deletable={isEditable}
          handle={sortable ? <DragHandle label={`영상 ${video.title}`} props={sort.handleProps(video.videoId)} className="w-7" /> : undefined}
        />
      </div>
    );
  });
};

interface CourseDeleteButtonProps {
  courseId: number;
}
/** 한 번 누르면 확인 문구가 나오고, 다시 누르면 강좌를 지운 뒤 내 강좌로 돌아간다. */
const CourseDeleteButton = ({ courseId }: CourseDeleteButtonProps) => {
  const router = useRouter();
  const deleteMutation = useDeleteInstructorCourse(courseId);
  const [confirming, setConfirming] = useState(false);
  if (!confirming)
    return (
      <button type="button" onClick={() => setConfirming(true)} className="inline-flex w-fit cursor-pointer items-center rounded-full border border-line px-3 py-1.5 text-[11px] text-muted transition hover:border-danger-line hover:text-danger">
        강좌 삭제
      </button>
    );
  return (
    <div role="group" aria-label="강좌 삭제 확인" className="flex w-full flex-wrap items-center gap-2 rounded-[4px] border border-danger-line bg-danger-bg px-3 py-2">
      <span className="text-[11px] leading-5 text-danger">강좌와 영상, 퀴즈가 모두 지워지고 되돌릴 수 없어요.</span>
      <div className="ml-auto flex gap-2">
        <button type="button" onClick={() => { setConfirming(false); deleteMutation.reset(); }} disabled={deleteMutation.isPending} className="h-8 cursor-pointer rounded-[4px] border border-line px-3 text-[11px] text-muted disabled:cursor-not-allowed">취소</button>
        <button type="button" onClick={() => deleteMutation.mutate(undefined, { onSuccess: () => router.replace("/instructor") })} disabled={deleteMutation.isPending} className="h-8 cursor-pointer rounded-[4px] bg-danger px-3 text-[11px] font-medium text-bg disabled:cursor-wait">{deleteMutation.isPending ? "삭제 중…" : "삭제하기"}</button>
      </div>
      {deleteMutation.error && <p role="alert" className="w-full text-[11px] text-danger">{getErrorMessage(deleteMutation.error)}</p>}
    </div>
  );
};

interface VideoDeleteButtonProps {
  courseId: number;
  videoId: number;
  title: string;
}
/** 한 번 누르면 확인 상태가 되고, 다시 누르면 삭제한다. */
const VideoDeleteButton = ({ courseId, videoId, title }: VideoDeleteButtonProps) => {
  const deleteMutation = useDeleteInstructorVideo(courseId);
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex shrink-0 flex-col items-end justify-center gap-1 px-3">
      <button
        type="button"
        aria-label={confirming ? `${title} 영상 삭제 확인` : `${title} 영상 삭제`}
        onClick={() => (confirming ? deleteMutation.mutate(videoId) : setConfirming(true))}
        onBlur={() => { if (!deleteMutation.isPending) setConfirming(false); }}
        disabled={deleteMutation.isPending}
        className={`cursor-pointer rounded-[4px] px-2 py-1.5 text-[10px] transition disabled:cursor-wait ${confirming ? "border border-danger-line bg-danger-bg text-danger" : "text-muted hover:text-danger"}`}
      >
        {deleteMutation.isPending ? "삭제 중…" : confirming ? "삭제 확인" : "삭제"}
      </button>
      {deleteMutation.error && <span role="alert" className="text-[10px] text-danger">{getErrorMessage(deleteMutation.error)}</span>}
    </div>
  );
};

const VideoLink = ({ courseId, video }: Omit<VideoRowProps, "deletable">) => (
  <Link
    href={`/instructor/courses/${courseId}/videos/${video.videoId}/script`}
    className="group flex cursor-pointer items-center gap-3 px-3 py-3.5 transition-colors hover:bg-panel/70"
  >
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-selected text-[11px] text-accent">
      ▶
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-xs text-text-sub">
        {video.title}
      </span>
      <span className="mt-1 block text-[10px] text-muted">
        {video.duration}
      </span>
    </span>
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-[4px] border px-2.5 py-2 text-[10px] font-medium transition-colors ${video.transcriptReviewed ? "border-success-line bg-success-soft-bg text-success" : "border-accent/50 bg-selected text-accent group-hover:border-accent group-hover:bg-accent group-hover:text-bg"}`}
    >
      {video.transcriptReviewed ? "검수 완료" : "대본 검수"}
      <span aria-hidden="true">→</span>
    </span>
  </Link>
);
