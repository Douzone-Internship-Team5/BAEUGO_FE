import Link from "next/link";
import { AiStatusBadge, Card, CourseStatusBadge } from "@/components/common";
import type { InstructorCourseDetail } from "../../data/courses";

interface Props {
  course: InstructorCourseDetail;
}

export const InstructorCourseDetailPage = ({ course }: Props) => (
  <div className="mx-auto flex max-w-[1200px] flex-col gap-7">
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <Link href="/instructor/courses" className="cursor-pointer text-xs text-muted transition hover:text-text">← 내 강좌</Link>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <h1 className="text-[25px] font-semibold tracking-[-0.5px]">강좌 관리</h1>
          <CourseStatusBadge status={course.status} />
        </div>
        <p className="mt-2 text-sm text-muted">강좌 정보와 공개 콘텐츠의 준비 상태를 확인합니다.</p>
      </div>
      {course.status !== "OPERATOR_HIDDEN" && (
        <button type="button" disabled className="h-10 cursor-not-allowed rounded-full bg-accent px-4 text-xs font-medium text-bg opacity-50">
          {course.status === "PUBLISHED" ? "강좌 수정 시작" : "강좌 정보 수정"}
        </button>
      )}
    </header>

    {course.status === "OPERATOR_HIDDEN" && (
      <div className="rounded-[4px] border border-danger-line bg-danger-bg px-4 py-3 text-xs leading-5 text-danger">
        운영자가 비공개 처리한 강좌입니다. 처리 사유와 기존 콘텐츠를 확인할 수 있습니다.
      </div>
    )}

    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
      <Card padding="lg" className="border border-line">
        <SectionEyebrow>COURSE INFORMATION</SectionEyebrow>
        <div className="mt-4">
          <h2 className="text-lg font-medium">{course.title}</h2>
          <p className="mt-2 text-xs text-muted">{course.category} · {course.topic} · {difficultyLabel(course.difficulty)}</p>
          <p className="mt-4 max-w-[760px] text-sm leading-6 text-text-sub">{course.description}</p>
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-4 sm:grid-cols-4">
            <MetadataItem label="판매 가격" value={`${course.priceKrw.toLocaleString("ko-KR")}원`} />
            <MetadataItem label="수강생" value={`${course.enrollmentCount.toLocaleString("ko-KR")}명`} />
            <MetadataItem label="섹션" value={`${course.sectionCount}개`} />
            <MetadataItem label="학습 영상" value={`${course.lessonCount}개`} />
          </div>
        </div>
      </Card>
      <Card padding="lg" className="border border-line">
        <SectionEyebrow>PUBLISH READINESS</SectionEyebrow>
        <div className="mt-3 flex items-end justify-between gap-3">
          <h2 className="text-base font-semibold">공개 준비</h2>
          <span className="text-xs tabular-nums text-muted">{course.publishRequirements.filter((item) => item.complete).length}/{course.publishRequirements.length} 완료</span>
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {course.publishRequirements.map((requirement) => (
            <li key={requirement.label} className="flex items-center gap-2.5 text-xs">
              <span className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] ${requirement.complete ? "bg-success-bg text-success" : "bg-warning-bg text-warning"}`} aria-hidden="true">{requirement.complete ? "✓" : "·"}</span>
              <span className={requirement.complete ? "text-text-sub" : "text-muted"}>{requirement.label}</span>
            </li>
          ))}
        </ul>
        {course.publishRequirements.every((item) => item.complete) && course.status !== "PUBLISHED" && course.status !== "OPERATOR_HIDDEN" && (
          <button type="button" disabled className="mt-5 h-10 w-full cursor-not-allowed rounded-full border border-success-line bg-success-soft-bg text-xs font-medium text-success opacity-50">강좌 공개하기</button>
        )}
        {!course.publishRequirements.every((item) => item.complete) && (
          <p className="mt-4 border-t border-line pt-3 text-[11px] leading-5 text-muted">미완료 항목을 모두 검수하면 강좌를 공개할 수 있습니다.</p>
        )}
      </Card>
    </section>

    <section className="flex flex-col gap-4">
      <div>
        <SectionEyebrow>CONTENT MANAGEMENT</SectionEyebrow>
        <h2 className="mt-2 text-lg font-semibold">강의 콘텐츠</h2>
      </div>
      <ContentRow title={course.otVideo.title} eyebrow="무료 OT" duration={course.otVideo.duration} transcriptReviewed={course.otVideo.transcriptReviewed} />
      {course.sections.map((section, index) => (
        <Card key={section.sectionId} padding="none" className="overflow-hidden border border-line">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel px-4 py-3.5 md:px-5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[1px] text-muted">SECTION {index + 1}</span>
              <h3 className="text-sm font-medium">{section.title}</h3>
            </div>
            <QuizStatus status={section.quiz.status} reviewed={section.quiz.reviewed} label="단위 퀴즈" />
          </div>
          <div className="divide-y divide-line">
            {section.videos.map((video) => <ContentRow key={video.title} title={video.title} eyebrow="학습 영상" duration={video.duration} transcriptReviewed={video.transcriptReviewed} />)}
          </div>
        </Card>
      ))}
      <ContentRow title="강좌 종합 퀴즈" eyebrow="FINAL QUIZ" duration={`${course.lessonCount}개 영상 대상`} transcriptReviewed={course.finalQuiz.reviewed} status={course.finalQuiz.status} />
    </section>
    <p className="text-[10px] text-dim">화면 확인용 예시 데이터입니다. 편집·공개 동작은 API 연동 후 활성화됩니다.</p>
  </div>
);

interface SectionEyebrowProps {
  children: string;
}

const SectionEyebrow = ({ children }: SectionEyebrowProps) => <p className="text-[10px] font-medium tracking-[1.5px] text-muted">{children}</p>;

interface MetadataItemProps {
  label: string;
  value: string;
}

const MetadataItem = ({ label, value }: MetadataItemProps) => (
  <div className="flex flex-col gap-1.5"><span className="text-[10px] text-muted">{label}</span><span className="text-xs text-text-sub">{value}</span></div>
);

interface ContentRowProps {
  title: string;
  eyebrow: string;
  duration: string;
  transcriptReviewed: boolean;
  status?: "COMPLETED" | "PROCESSING" | "PENDING";
}

const ContentRow = ({ title, eyebrow, duration, transcriptReviewed, status }: ContentRowProps) => (
    <Card padding="md" className="flex flex-col gap-3 border border-line sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="text-[10px] tracking-[1px] text-muted">{eyebrow} · {duration}</p>
      <h3 className="mt-1.5 truncate text-sm font-medium">{title}</h3>
    </div>
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      {status && <QuizStatus status={status} reviewed={transcriptReviewed} label="퀴즈" />}
      {!status && <span className={`rounded-full px-2.5 py-1 text-[10px] ${transcriptReviewed ? "bg-success-soft-bg text-success" : "bg-warning-bg text-warning"}`}>대본 {transcriptReviewed ? "검수 완료" : "검수 필요"}</span>}
      <button type="button" disabled className="h-8 cursor-not-allowed rounded-full border border-line-strong px-3 text-[10px] text-text-sub opacity-50">콘텐츠 보기</button>
    </div>
  </Card>
);

interface QuizStatusProps {
  status: "COMPLETED" | "PROCESSING" | "PENDING";
  reviewed: boolean;
  label: string;
}

const QuizStatus = ({ status, reviewed, label }: QuizStatusProps) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <AiStatusBadge status={status} prefix={label} />
    <span className={`rounded-full px-2 py-1 text-[10px] ${reviewed ? "bg-success-soft-bg text-success" : "bg-warning-bg text-warning"}`}>{reviewed ? "검수 완료" : "검수 필요"}</span>
  </div>
);

const difficultyLabel = (difficulty: Props["course"]["difficulty"]) => ({ BEGINNER: "입문", INTERMEDIATE: "중급", ADVANCED: "고급" })[difficulty];
