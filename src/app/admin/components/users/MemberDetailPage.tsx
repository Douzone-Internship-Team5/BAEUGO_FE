import Link from "next/link";
import type { AdminUserDetail } from "../../data/userDetails";

interface Props {
  detail: AdminUserDetail;
}

export const MemberDetailPage = ({ detail }: Props) => {
  const { user, onboarding } = detail;
  const roleLabel = user.role === "LEARNER" ? "수강자" : "강사";

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-7">
      <div>
        <Link href="/admin/users" className="text-xs text-muted transition hover:text-text">
          ← 회원 목록
        </Link>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <h1 className="text-[25px] font-semibold tracking-[-0.5px]">회원 상세</h1>
          <RoleBadge role={roleLabel} />
          <AccountStatus active={user.isActive} />
        </div>
        <p className="mt-2 text-sm text-muted">계정 정보와 온보딩 및 서비스 이용 현황을 확인합니다.</p>
      </div>

      <section className="rounded-[4px] border border-line bg-panel p-5 md:p-6">
        <SectionHeading eyebrow="ACCOUNT" title="계정 정보" />
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-selected text-lg font-medium text-accent">
            {user.name.slice(0, 1)}
          </span>
          <div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">
            <MetadataItem label="이름" value={user.name} />
            <MetadataItem label="이메일" value={user.email} />
            <MetadataItem label="계정 유형" value={user.accountType === "MEMBER" ? "일반 회원" : "운영자"} />
            <MetadataItem label="보유 역할" value={roleLabel} />
            <MetadataItem label="활성 모드" value={user.activeMode === "LEARNER" ? "수강자" : "강사"} />
            <MetadataItem label="회원 번호" value={`#${user.userId}`} />
          </div>
        </div>
      </section>

      <section className="rounded-[4px] border border-line bg-panel p-5 md:p-6">
        <SectionHeading eyebrow="ONBOARDING" title="온보딩 설정" />
        {!onboarding ? (
          <p className="mt-5 text-xs text-muted">등록된 온보딩 정보가 없습니다.</p>
        ) : onboarding.kind === "LEARNER" ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <MetadataItem label="현재 상황" value={onboarding.currentStatus} />
            <MetadataItem label="희망 직무" value={onboarding.jobCategory} />
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-[10px] text-muted">관심 주제</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {onboarding.interestTopics.map((topic) => <TopicTag key={topic}>{topic}</TopicTag>)}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <MetadataItem label="강의 직무" value={onboarding.jobCategory} />
            <div>
              <p className="text-[10px] text-muted">강의 주제</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {onboarding.lectureTopics.map((topic) => <TopicTag key={topic}>{topic}</TopicTag>)}
              </div>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] text-muted">강사 약력</p>
              <p className="mt-2 max-w-[780px] text-xs leading-5 text-text-sub">{onboarding.bio}</p>
            </div>
          </div>
        )}
      </section>

      {detail.learningSummary && (
        <section className="rounded-[4px] border border-line bg-panel p-5 md:p-6">
          <SectionHeading eyebrow="LEARNING ACTIVITY" title="학습 현황" />
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryCard label="학습 중 강좌" value={`${detail.learningSummary.inProgressCount}개`} />
            <SummaryCard label="완료 강좌" value={`${detail.learningSummary.completedCount}개`} />
            <SummaryCard label="출석 연속 기록" value={`${detail.learningSummary.attendanceStreak}일`} />
            <SummaryCard label="마지막 학습" value={formatDateTime(detail.learningSummary.lastStudiedAt)} />
          </div>
        </section>
      )}

      {detail.instructorSummary && (
        <section className="rounded-[4px] border border-line bg-panel p-5 md:p-6">
          <SectionHeading eyebrow="INSTRUCTOR ACTIVITY" title="강좌 현황" />
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <SummaryCard label="작성 중" value={`${detail.instructorSummary.courseCount.DRAFT}개`} />
            <SummaryCard label="공개 중" value={`${detail.instructorSummary.courseCount.PUBLISHED}개`} />
            <SummaryCard label="수정 중" value={`${detail.instructorSummary.courseCount.EDITING}개`} />
            <SummaryCard label="운영자 비공개" value={`${detail.instructorSummary.courseCount.OPERATOR_HIDDEN}개`} />
            <SummaryCard label="누적 수강생" value={`${detail.instructorSummary.totalEnrollments.toLocaleString("ko-KR")}명`} />
          </div>
        </section>
      )}
    </div>
  );
};

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

const SectionHeading = ({ eyebrow, title }: SectionHeadingProps) => (
  <div>
    <p className="text-[10px] font-medium tracking-[1.5px] text-muted">{eyebrow}</p>
    <h2 className="mt-2 text-base font-semibold">{title}</h2>
  </div>
);

interface MetadataItemProps {
  label: string;
  value: string;
}

const MetadataItem = ({ label, value }: MetadataItemProps) => (
  <div className="flex min-w-0 flex-col gap-1.5">
    <span className="text-[10px] text-muted">{label}</span>
    <span className="break-words text-xs text-text-sub">{value}</span>
  </div>
);

interface SummaryCardProps {
  label: string;
  value: string;
}

const SummaryCard = ({ label, value }: SummaryCardProps) => (
  <div className="flex min-h-[84px] flex-col justify-between rounded-[4px] border border-line bg-bg p-3.5">
    <span className="text-[10px] text-muted">{label}</span>
    <strong className="text-base font-medium text-text">{value}</strong>
  </div>
);

interface TopicTagProps {
  children: string;
}

const TopicTag = ({ children }: TopicTagProps) => (
  <span className="rounded-full border border-line-strong px-2.5 py-1 text-[10px] text-text-sub">{children}</span>
);

interface RoleBadgeProps {
  role: string;
}

const RoleBadge = ({ role }: RoleBadgeProps) => (
  <span className="rounded-full bg-selected px-2.5 py-1 text-[10px] font-medium text-accent">{role}</span>
);

interface AccountStatusProps {
  active: boolean;
}

const AccountStatus = ({ active }: AccountStatusProps) => (
  <span className={`inline-flex items-center gap-1.5 text-[10px] ${active ? "text-success" : "text-muted"}`}>
    <span className={`size-1.5 rounded-full ${active ? "bg-success" : "bg-dim"}`} />
    {active ? "활성" : "비활성"}
  </span>
);

const formatDateTime = (value: string) => value
  ? new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
  : "학습 기록 없음";
