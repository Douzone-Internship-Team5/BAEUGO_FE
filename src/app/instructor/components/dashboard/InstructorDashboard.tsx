import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CourseStatusBadge } from "@/components/common";
import { INSTRUCTOR_COURSES } from "../../data/courses";

export const InstructorDashboard = () => {
  const publishedCourses = INSTRUCTOR_COURSES.filter((course) => course.status === "PUBLISHED");
  const totalEnrollments = INSTRUCTOR_COURSES.reduce((total, course) => total + course.enrollmentCount, 0);
  const estimatedRevenue = INSTRUCTOR_COURSES.reduce((total, course) => total + course.estimatedRevenue, 0);
  const lessonViews = INSTRUCTOR_COURSES.reduce((total, course) => total + course.lessonViews, 0);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-medium tracking-[1.5px] text-accent">INSTRUCTOR STUDIO</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.5px]">안녕하세요, 이하늘 강사님</h1>
          <p className="mt-2 text-sm text-muted">강좌 현황과 학습자 반응을 한눈에 확인하세요.</p>
        </div>
        <Link href="/instructor/courses" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-accent px-5 text-xs font-medium text-bg transition hover:brightness-110">
          내 강좌 보기 <span aria-hidden="true" className="ml-1">→</span>
        </Link>
      </header>

      <section aria-label="강사 성과 요약" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="전체 수강생" value={`${totalEnrollments.toLocaleString("ko-KR")}명`} note="내 강좌 누적 수강생" icon="learners" />
        <MetricCard label="예상 매출" value={formatKrw(estimatedRevenue)} note="목업 기준 누적 예상 매출" icon="revenue" />
        <MetricCard label="학습 영상 조회" value={lessonViews.toLocaleString("ko-KR")} note="무료 OT 제외" icon="views" />
        <MetricCard label="공개 강좌" value={`${publishedCourses.length}개`} note={`전체 ${INSTRUCTOR_COURSES.length}개 강좌`} icon="courses" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.8fr)]">
        <Card padding="lg" className="border border-line">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium tracking-[1.3px] text-muted">COURSE OVERVIEW</p>
              <h2 className="mt-2 text-base font-semibold">강좌 현황</h2>
            </div>
            <Link href="/instructor/courses" className="cursor-pointer text-xs text-muted transition hover:text-text">전체 보기 →</Link>
          </div>
          <div className="mt-5 flex flex-col divide-y divide-line">
            {INSTRUCTOR_COURSES.slice(0, 3).map((course) => (
              <Link key={course.courseId} href={`/instructor/courses/${course.courseId}`} className="group flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-medium transition group-hover:text-accent">{course.title}</h3>
                    <CourseStatusBadge status={course.status} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted">{course.category} · {course.topic}</p>
                </div>
                <div className="flex shrink-0 items-center gap-5 text-xs">
                  <span className="text-muted">수강생 <strong className="ml-1 font-medium text-text-sub">{course.enrollmentCount}명</strong></span>
                  <span className="text-muted">콘텐츠 <strong className="ml-1 font-medium text-text-sub">{course.processing.completed}/{course.processing.total}</strong></span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card padding="lg" className="border border-line">
          <p className="text-[10px] font-medium tracking-[1.3px] text-muted">NEXT ACTION</p>
          <h2 className="mt-2 text-base font-semibold">이어 할 작업</h2>
          <div className="mt-5 flex flex-col gap-3">
            <ActionItem title="수정 중인 강좌 마무리" description="‘처음 시작하는 데이터 시각화’의 공개 준비를 확인하세요." href="/instructor/courses/202" tone="warning" />
            <ActionItem title="초안 콘텐츠 채우기" description="작성 중인 강좌에 OT와 학습 영상을 추가하세요." href="/instructor/courses/203" tone="neutral" />
          </div>
          <p className="mt-5 border-t border-line pt-4 text-[11px] leading-5 text-muted">공개 전에는 영상·대본·퀴즈 검수가 모두 완료되어야 합니다.</p>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.8fr)]">
        <Card padding="lg" className="border border-line">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium tracking-[1.3px] text-muted">WEEKLY ACTIVITY</p>
              <h2 className="mt-2 text-base font-semibold">최근 7일 학습 영상 조회</h2>
            </div>
            <span className="text-xs text-muted">최근 7일</span>
          </div>
          <WeeklyViewsChart />
        </Card>
        <Card padding="lg" className="border border-line">
          <p className="text-[10px] font-medium tracking-[1.3px] text-muted">PUBLISH CHECK</p>
          <h2 className="mt-2 text-base font-semibold">공개 준비 상태</h2>
          <div className="mt-5 flex flex-col gap-4">
            {INSTRUCTOR_COURSES.filter((course) => course.status === "EDITING" || course.status === "DRAFT").map((course) => (
              <Link key={course.courseId} href={`/instructor/courses/${course.courseId}`} className="cursor-pointer">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate text-text-sub">{course.title}</span>
                  <span className="shrink-0 tabular-nums text-muted">{course.processing.completed}/{course.processing.total}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${course.processing.total ? (course.processing.completed / course.processing.total) * 100 : 0}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <p className="text-[10px] text-dim">화면 확인용 예시 데이터입니다. 통계는 강사 통계 API 연동 후 실제 값으로 표시됩니다.</p>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  note: string;
  icon: "learners" | "revenue" | "views" | "courses";
}

const MetricCard = ({ label, value, note, icon }: MetricCardProps) => (
  <Card padding="md" className="border border-line">
    <div className="flex items-start justify-between">
      <p className="text-xs text-muted">{label}</p>
      <MetricIcon name={icon} />
    </div>
    <p className="mt-4 text-[25px] font-semibold tracking-[-0.5px]">{value}</p>
    <p className="mt-1.5 text-[10px] text-dim">{note}</p>
  </Card>
);

interface ActionItemProps {
  title: string;
  description: string;
  href: string;
  tone: "warning" | "neutral";
}

const ActionItem = ({ title, description, href, tone }: ActionItemProps) => (
  <Link href={href} className="flex cursor-pointer gap-3 rounded-[4px] border border-line bg-card p-3.5 transition hover:border-line-focus">
    <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs ${tone === "warning" ? "bg-warning-bg text-warning" : "bg-selected text-muted"}`}>{tone === "warning" ? "!" : "↗"}</span>
    <span className="min-w-0">
      <strong className="block text-xs font-medium">{title}</strong>
      <span className="mt-1 block text-[11px] leading-5 text-muted">{description}</span>
    </span>
  </Link>
);

const WEEKLY_VIEWS = [
  { day: "월", value: 198 }, { day: "화", value: 264 }, { day: "수", value: 221 },
  { day: "목", value: 342 }, { day: "금", value: 296 }, { day: "토", value: 408 }, { day: "일", value: 327 },
];

const WeeklyViewsChart = () => (
  <div className="mt-6 flex h-36 items-end justify-between gap-3 border-b border-line px-1 sm:px-4">
    {WEEKLY_VIEWS.map(({ day, value }) => (
      <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
        <span className="text-[9px] tabular-nums text-dim">{value}</span>
        <div className="flex h-[104px] w-full items-end justify-center">
          <div className={`w-full max-w-8 rounded-t-[3px] ${day === "토" ? "bg-accent" : "bg-selected"}`} style={{ height: `${(value / 440) * 100}%` }} />
        </div>
        <span className="pb-2 text-[10px] text-muted">{day}</span>
      </div>
    ))}
  </div>
);

interface MetricIconProps {
  name: MetricCardProps["icon"];
}

const MetricIcon = ({ name }: MetricIconProps) => {
  const iconPaths: Record<MetricCardProps["icon"], ReactNode> = {
    learners: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1zM16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.5V20h-4" /></>,
    revenue: <><path d="M12 3v18M17 7.5c0-1.4-1.7-2.5-4.5-2.5S8 6.1 8 7.5 9.6 10 12.5 10s4.5 1.1 4.5 2.5-1.7 2.5-4.5 2.5S8 13.9 8 12.5" /></>,
    views: <><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6z" /><circle cx="12" cy="12" r="2.5" /></>,
    courses: <><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H20v14H5.5A1.5 1.5 0 0 0 4 19.5z" /><path d="M4 5.5v14M8 8h8M8 11h8" /></>,
  };
  return <svg className="text-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;
};

const formatKrw = (value: number) => `${value.toLocaleString("ko-KR")}원`;
