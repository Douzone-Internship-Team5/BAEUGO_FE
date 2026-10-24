"use client";

import Link from "next/link";
import { useState } from "react";
import { CourseStatusBadge } from "@/components/common";
import useAdminCourseUnpublish from "@/api/admin/courses/useAdminCourseUnpublish";
import type { AdminCourseDetail, ReviewQuiz, ReviewVideo } from "../../data/courseDetails";

interface Props {
  initialDetail: AdminCourseDetail;
}

export const CourseDetailPage = ({ initialDetail }: Props) => {
  const [detail, setDetail] = useState(initialDetail);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const { course } = detail;
  const unpublishMutation = useAdminCourseUnpublish(course.courseId);

  const handleUnpublish = async (reason: string) => {
    try {
      const result = await unpublishMutation.mutateAsync({ reason });
      setDetail((current) => ({
        ...current,
        course: {
          ...current.course,
          status: result.status,
          closedReason: result.closedReason,
        },
      }));
      setIsDialogOpen(false);
      setNotice("강좌를 비공개 처리했습니다.");
    } catch {
      setNotice("강좌 비공개 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/admin/courses" className="text-xs text-muted transition hover:text-text">
            ← 강좌 목록
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <h1 className="text-[25px] font-semibold tracking-[-0.5px]">강좌 상세 점검</h1>
            <CourseStatusBadge status={course.status} />
          </div>
          <p className="mt-2 text-sm text-muted">강좌 정보와 공개 콘텐츠를 확인합니다.</p>
        </div>
        {(course.status === "PUBLISHED" || course.status === "EDITING") && (
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="h-10 cursor-pointer rounded-[4px] border border-danger-line px-4 text-xs font-medium text-danger transition hover:bg-danger-bg"
          >
            비공개 처리
          </button>
        )}
      </div>

      {notice && <p role="status" className="rounded-[4px] border border-success-line bg-success-soft-bg px-4 py-3 text-xs text-success">{notice}</p>}
      {course.status === "OPERATOR_HIDDEN" && course.closedReason && (
        <div className="rounded-[4px] border border-danger-line bg-danger-bg px-4 py-3 text-xs text-danger">
          <strong className="mr-2 font-medium">비공개 사유</strong>{course.closedReason}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.8fr)]">
        <div className="rounded-[4px] border border-line bg-panel p-5 md:p-6">
          <SectionEyebrow>COURSE INFORMATION</SectionEyebrow>
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <p className="text-[10px] text-muted">강좌명</p>
              <h2 className="mt-1.5 text-lg font-medium">{course.title}</h2>
            </div>
            <p className="max-w-[760px] text-sm leading-6 text-text-sub">{detail.description}</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-4 sm:grid-cols-3">
              <MetadataItem label="직무" value={course.jobCategory} />
              <MetadataItem label="주제" value={detail.topicName} />
              <MetadataItem label="난이도" value={difficultyLabel(detail.difficulty)} />
              <MetadataItem label="판매 가격" value={`${course.priceKrw.toLocaleString("ko-KR")}원`} />
              <MetadataItem label="수강생" value={`${course.enrollmentCount.toLocaleString("ko-KR")}명`} />
              <MetadataItem label="공개일" value={formatDate(course.publishedAt)} />
            </div>
          </div>
        </div>

        <aside className="rounded-[4px] border border-line bg-panel p-5 md:p-6">
          <SectionEyebrow>INSTRUCTOR</SectionEyebrow>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-selected text-sm font-medium text-accent">
              {detail.instructor.name.slice(0, 1)}
            </span>
            <div>
              <p className="text-sm font-medium">{detail.instructor.name}</p>
              <p className="mt-1 text-xs text-muted">{detail.instructor.email}</p>
            </div>
          </div>
          <p className="mt-4 border-t border-line pt-4 text-xs leading-5 text-text-sub">{detail.instructor.bio}</p>
          <div className="mt-4 flex gap-5 border-t border-line pt-4">
            <MetadataItem label="전체 강의" value={`${detail.totalLessonCount}개`} />
            <MetadataItem label="총 재생 시간" value={formatDuration(detail.totalLessonDurationSeconds)} />
          </div>
        </aside>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <SectionEyebrow>CONTENT REVIEW</SectionEyebrow>
          <h2 className="mt-2 text-lg font-semibold">강의 콘텐츠</h2>
        </div>
        {detail.otVideo && <VideoReviewCard video={detail.otVideo} label="무료 OT" />}
        {detail.sections.map((section) => (
          <div key={section.sectionId} className="flex flex-col gap-3">
            <div className="flex items-center gap-3 pt-3">
              <span className="text-[10px] tracking-[1px] text-muted">SECTION {section.sortOrder}</span>
              <h3 className="text-sm font-medium">{section.title}</h3>
            </div>
            {section.videos.map((video) => <VideoReviewCard key={video.videoId} video={video} label="학습 영상" />)}
            {section.unitQuiz && <QuizReviewCard quiz={section.unitQuiz} title={`${section.title} 확인 퀴즈`} />}
          </div>
        ))}
        {detail.finalQuiz && <QuizReviewCard quiz={detail.finalQuiz} title="코스 종합 퀴즈" />}
      </section>

      {isDialogOpen && (
        <UnpublishDialog onClose={() => setIsDialogOpen(false)} onConfirm={handleUnpublish} isPending={unpublishMutation.isPending} />
      )}
    </div>
  );
};

interface EyebrowProps {
  children: string;
}

const SectionEyebrow = ({ children }: EyebrowProps) => (
  <p className="text-[10px] font-medium tracking-[1.5px] text-muted">{children}</p>
);

interface MetadataItemProps {
  label: string;
  value: string;
}

const MetadataItem = ({ label, value }: MetadataItemProps) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] text-muted">{label}</span>
    <span className="text-xs text-text-sub">{value}</span>
  </div>
);

interface VideoReviewCardProps {
  video: ReviewVideo;
  label: string;
}

const VideoReviewCard = ({ video, label }: VideoReviewCardProps) => (
  <article className="rounded-[4px] border border-line bg-panel p-4 md:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-[10px] tracking-[1px] text-muted">{label} · {formatDuration(video.durationSeconds)}</p>
        <h3 className="mt-2 truncate text-sm font-medium">{video.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted">
          <span className={`rounded-full px-2 py-1 ${video.sttStatus === "COMPLETED" ? "bg-success-soft-bg text-success" : "bg-warning-bg text-warning"}`}>
            자막 {video.sttStatus === "COMPLETED" ? "완료" : "확인 필요"}
          </span>
          {video.transcriptReviewedAt && <span>검수 {formatDate(video.transcriptReviewedAt)}</span>}
        </div>
      </div>
      <a
        href={video.videoUrl}
        target="_blank"
        rel="noreferrer"
        className="flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-line-strong px-3 text-xs text-text-sub transition hover:bg-selected"
      >
        영상 열기
        <span className="sr-only"> 새 탭에서 영상 재생</span>
      </a>
    </div>
    <details className="mt-4 border-t border-line pt-3">
      <summary className="w-fit cursor-pointer text-xs text-muted transition hover:text-text">
        자막 대본 보기 <span className="ml-1 text-dim">({video.segments.length}개 구간)</span>
      </summary>
      <ol className="mt-3 flex flex-col divide-y divide-line rounded-[4px] border border-line bg-bg">
        {video.segments.map((segment) => (
          <li key={segment.id} className="grid gap-2 px-3 py-3 sm:grid-cols-[72px_1fr]">
            <span className="text-[10px] tabular-nums text-muted">{formatTimestamp(segment.startMs)}</span>
            <span className="text-xs leading-5 text-text-sub">{segment.content}</span>
          </li>
        ))}
      </ol>
    </details>
  </article>
);

interface QuizReviewCardProps {
  quiz: ReviewQuiz;
  title: string;
}

const QuizReviewCard = ({ quiz, title }: QuizReviewCardProps) => (
  <article className="rounded-[4px] border border-line bg-panel p-4 md:p-5">
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-selected px-2.5 py-1 text-[10px] font-medium text-text-sub">
        {quiz.quizType === "UNIT" ? "단위 퀴즈" : "종합 퀴즈"}
      </span>
      <span className="text-[10px] text-muted">{quiz.quizType === "UNIT" ? "AI 생성" : "강사 작성"} · {quiz.questions.length}문항</span>
    </div>
    <h3 className="mt-3 text-sm font-medium">{title}</h3>
    <div className="mt-3 flex flex-col gap-3">
      {quiz.questions.map((question) => (
        <div key={question.questionId} className="rounded-[4px] border border-line bg-bg p-4">
          <p className="text-xs leading-5 text-text-sub">
            <span className="mr-2 text-[10px] text-muted">Q{question.orderNo}</span>{question.content}
          </p>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {question.choices.map((choice, index) => {
              const isCorrect = index + 1 === question.correctChoiceNo;
              return (
                <li key={choice} className={`rounded-[4px] border px-3 py-2 text-[11px] ${isCorrect ? "border-success-line bg-success-soft-bg text-success" : "border-line text-muted"}`}>
                  <span className="mr-2 tabular-nums">{index + 1}.</span>{choice}
                  {isCorrect && <span className="ml-2 text-[9px]">정답</span>}
                </li>
              );
            })}
          </ol>
          <p className="mt-3 border-t border-line pt-3 text-[11px] leading-5 text-muted">
            <strong className="mr-1.5 font-medium text-text-sub">해설</strong>{question.explanation}
          </p>
        </div>
      ))}
    </div>
  </article>
);

interface UnpublishDialogProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}

const UnpublishDialog = ({ onClose, onConfirm, isPending }: UnpublishDialogProps) => {
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="unpublish-title"
        onSubmit={(event) => {
          event.preventDefault();
          if (trimmedReason.length > 0 && !isPending) onConfirm(trimmedReason);
        }}
        className="w-full max-w-[480px] rounded-[6px] border border-line-focus bg-panel p-5 shadow-2xl md:p-6"
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-danger-bg text-lg text-danger" aria-hidden="true">
          !
        </div>
        <h2 id="unpublish-title" className="mt-4 text-lg font-semibold">강좌를 비공개 처리할까요?</h2>
        <p className="mt-2 text-xs leading-5 text-muted">비공개된 강좌는 수강자에게 노출되지 않으며 강사는 수정하거나 다시 공개할 수 없습니다.</p>
        <label htmlFor="unpublish-reason" className="mt-5 block text-xs font-medium text-text-sub">
          비공개 사유 <span className="text-danger">*</span>
        </label>
        <textarea
          id="unpublish-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          maxLength={500}
          rows={4}
          placeholder="운영자가 확인한 비공개 사유를 입력해 주세요."
          className="mt-2 w-full resize-y rounded-[4px] border border-line-strong bg-bg px-3 py-2.5 text-sm leading-5 text-text outline-none placeholder:text-dim focus:border-line-focus focus:ring-2 focus:ring-danger/20"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted">
          <span>1~500자로 입력해 주세요.</span>
          <span>{reason.length} / 500</span>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={isPending} className="h-10 cursor-pointer rounded-[4px] border border-line-strong px-4 text-xs text-text-sub hover:bg-selected disabled:opacity-50">
            취소
          </button>
          <button type="submit" disabled={!trimmedReason || isPending} className="h-10 cursor-pointer rounded-[4px] bg-danger px-4 text-xs font-medium text-on-danger hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">
            {isPending ? "처리 중…" : "비공개 처리"}
          </button>
        </div>
      </form>
    </div>
  );
};

const difficultyLabel = (value: AdminCourseDetail["difficulty"]) =>
  ({ BEGINNER: "초급", INTERMEDIATE: "중급", ADVANCED: "고급" })[value];

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds ? `${minutes}분 ${remainingSeconds}초` : `${minutes}분`;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(value))
    .replaceAll(". ", ".")
    .replace(/\.$/, "");

const formatTimestamp = (value: number) => {
  const seconds = Math.floor(value / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};
