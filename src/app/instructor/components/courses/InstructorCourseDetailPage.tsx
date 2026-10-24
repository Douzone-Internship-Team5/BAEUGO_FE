import Link from "next/link";
import type { ReactNode } from "react";
import { AiStatusBadge, Card, CourseStatusBadge } from "@/components/common";
import type { InstructorCourseDetail } from "../../data/courses";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";

interface Props { course: InstructorCourseDetail }

export const InstructorCourseDetailPage = ({ course }: Props) => {
  const completed = course.publishRequirements.filter((item) => item.complete).length;
  return <div className="min-h-dvh pb-24 md:pb-8">
    <InstructorScreenHeader title="강좌 편집 · 공개" backHref="/instructor" />
    <main className="mx-auto max-w-4xl px-4 pt-5 md:px-8 md:pt-8">
      <div className="flex items-center justify-between gap-3"><div><Link href="/instructor" className="mb-2 hidden w-fit cursor-pointer items-center gap-1 text-xs text-muted transition hover:text-text md:flex"><span aria-hidden="true">←</span> 내 강좌</Link><h1 className="text-xl font-medium leading-7 md:text-2xl">{course.title}</h1><p className="mt-1.5 text-[11px] text-muted">{course.category} · {course.topic} · {course.priceKrw.toLocaleString("ko-KR")}원</p></div><CourseStatusBadge status={course.status} /></div>
      {course.status === "OPERATOR_HIDDEN" && <p className="mt-4 rounded-[4px] border border-danger-line bg-danger-bg p-3 text-xs leading-5 text-danger">운영자가 비공개 처리한 강좌입니다. 사유를 확인한 후 콘텐츠를 수정해 주세요.</p>}

      <Card padding="md" className="mt-5 border border-line">
        <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] tracking-[1px] text-muted">공개 준비</p><h2 className="mt-1 text-sm font-medium">필수 항목을 확인해 주세요</h2></div><strong className="text-sm tabular-nums text-accent">{completed}/{course.publishRequirements.length}</strong></div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-card"><div className="h-full rounded-full bg-accent" style={{ width: `${completed / course.publishRequirements.length * 100}%` }} /></div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">{course.publishRequirements.map((item) => <li key={item.label} className="flex items-center gap-2 text-[11px]"><span className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] ${item.complete ? "bg-success-bg text-success" : "bg-card text-dim"}`}>{item.complete ? "✓" : "·"}</span><span className={item.complete ? "text-text-sub" : "text-muted"}>{item.label}</span></li>)}</ul>
      </Card>

      <section className="mt-7"><SectionTitle eyebrow="COURSE CONTENT" title="강의 콘텐츠" />
        <ContentCard title="무료 OT" subtitle="강좌를 소개하는 영상" quizHref={null} quizStatus={null}>
          <VideoRow courseId={course.courseId} video={course.otVideo} />
        </ContentCard>
        {course.sections.map((section, index) => <ContentCard key={section.sectionId} title={`섹션 ${index + 1}. ${section.title}`} subtitle={`${section.videos.length}개 영상`} quizHref={`/instructor/courses/${course.courseId}/quiz?sectionId=${section.sectionId}`} quizStatus={section.quiz}>
          {section.videos.map((video, videoIndex) => <VideoRow key={`${course.courseId}-${section.sectionId}-${video.videoId ?? video.title}-${videoIndex}`} courseId={course.courseId} video={video} />)}
          {section.videos.length === 0 && <p className="px-3 py-4 text-xs text-muted">등록된 영상이 없습니다.</p>}
        </ContentCard>)}
        <ContentCard title="종합 퀴즈" subtitle={`${course.lessonCount}개 영상 대상`} quizHref={`/instructor/courses/${course.courseId}/quiz?sectionId=final`} quizStatus={course.finalQuiz} />
      </section>
      <p className="mt-6 text-[10px] leading-5 text-dim">화면 확인용 예시 데이터입니다. 공개 및 저장 동작은 API 연동 후 활성화됩니다.</p>
    </main>
    <div className="fixed inset-x-0 bottom-[58px] z-20 border-t border-line bg-bg/95 p-3 backdrop-blur md:static md:mt-8 md:border-0 md:bg-transparent md:p-0"><button type="button" disabled className="h-11 w-full cursor-not-allowed rounded-[4px] bg-accent text-xs font-medium text-bg opacity-50 md:mx-auto md:block md:max-w-sm">{completed === course.publishRequirements.length ? "강좌 공개하기" : `공개 항목 확인하기 · ${course.publishRequirements.length - completed}개 남음`}</button></div>
    <InstructorMobileNav active="courses" />
  </div>;
};

interface SectionTitleProps { eyebrow: string; title: string }
const SectionTitle = ({ eyebrow, title }: SectionTitleProps) => <div className="mb-3"><p className="text-[9px] tracking-[1.4px] text-muted">{eyebrow}</p><h2 className="mt-1 text-base font-medium">{title}</h2></div>;

interface ContentCardProps { title: string; subtitle: string; children?: ReactNode; quizHref: string | null; quizStatus: { status: "COMPLETED" | "PROCESSING" | "PENDING"; reviewed: boolean } | null }
const ContentCard = ({ title, subtitle, children, quizHref, quizStatus }: ContentCardProps) => <Card padding="none" className="mb-3 overflow-hidden border border-line">
  <div className="flex items-center justify-between gap-2 bg-panel px-3 py-3"><div className="min-w-0"><h3 className="truncate text-xs font-medium">{title}</h3><p className="mt-1 text-[10px] text-muted">{subtitle}</p></div>{quizHref && <Link href={quizHref} className="shrink-0 cursor-pointer rounded-full border border-line-strong px-2.5 py-1.5 text-[10px] text-text-sub">퀴즈 검수</Link>}</div>
  {quizStatus && <div className="flex items-center justify-between border-t border-line px-3 py-2.5"><span className="text-[10px] text-muted">단위 퀴즈</span><div className="flex items-center gap-2"><AiStatusBadge status={quizStatus.status} /><span className={`text-[10px] ${quizStatus.reviewed ? "text-success" : "text-warning"}`}>{quizStatus.reviewed ? "검수 완료" : "검수 필요"}</span></div></div>}
  {children && <div className="divide-y divide-line border-t border-line">{children}</div>}
</Card>;

interface VideoRowProps { courseId: number; video: InstructorCourseDetail["otVideo"] }
const VideoRow = ({ courseId, video }: VideoRowProps) => <Link href={`/instructor/courses/${courseId}/videos/${video.videoId}/script`} className="flex cursor-pointer items-center gap-3 px-3 py-3.5 hover:bg-panel/70"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-selected text-[11px] text-accent">▶</span><span className="min-w-0 flex-1"><span className="block truncate text-xs text-text-sub">{video.title}</span><span className="mt-1 block text-[10px] text-muted">{video.duration}</span></span><span className={`shrink-0 text-[10px] ${video.transcriptReviewed ? "text-success" : "text-warning"}`}>대본 {video.transcriptReviewed ? "완료" : "검수"}</span></Link>;
