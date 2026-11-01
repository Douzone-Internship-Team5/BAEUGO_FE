"use client";

import Link from "next/link";
import { Card } from "@/components/common";
import useMe from "@/api/user/useMe";
import useMyEnrollments from "@/api/learning/useMyEnrollments";
import useToday from "@/api/learning/useToday";
import useEnrollmentNext from "@/api/learning/useEnrollmentNext";
import type { EnrollmentNextDto, MyEnrollmentsDto } from "@/types/learning";
import { BrandHeader } from "../components/shared/LearnerHeader";
import { CourseTile, ProgressBar, SectionTitle } from "../components/shared/LearnerUI";

const duration = (seconds: number) => `${Math.floor(seconds / 60)}분 ${seconds % 60}초`;

export function LearnerHome() {
  const today = useToday();
  const me = useMe();
  const enrollments = useMyEnrollments("IN_PROGRESS");
  const goal = today.data?.goal;
  const courses = enrollments.data?.enrollments ?? [];
  const shorts = today.data?.recommendedShortforms ?? [];
  return <>
    <BrandHeader right={<Link href="/learner/attendance" className="flex h-11 items-center gap-2 text-xs text-text-sub"><span className="size-1.5 rounded-full bg-accent" />{today.data?.goal.isAttended ? "오늘 출석 완료" : "출석 현황"}</Link>} />
    <main className="space-y-7 px-5 pb-8 pt-2">
      <section><p className="text-[13px] text-muted">{me.data?.name ?? "수강자"}님, 오늘도 가볍게 시작해요</p><h1 className="mt-1 text-[23px] font-medium leading-8">오늘 <span className="text-accent">{Math.ceil((goal?.remainingSeconds ?? 0) / 60)}분</span>만 더 보면<br />목표 달성이에요</h1></section>
      <Card padding="md" className="border border-line bg-panel">
        <div className="flex items-center justify-between"><div><p className="text-[13px] font-medium">오늘 학습</p><p className="mt-1 text-[10px] text-muted">목표 {goal?.dailyTargetMinutes ?? 0}분</p></div><p className="text-xl font-medium tabular-nums">{duration(goal?.activeSeconds ?? 0)}</p></div>
        <div className="mt-4 flex items-center gap-3"><ProgressBar value={goal?.achievementPercent ?? 0} className="flex-1" /><span className="text-xs text-accent">{Math.round(goal?.achievementPercent ?? 0)}%</span></div>
        <div className="mt-4 flex justify-between border-t border-line pt-3 text-[10px] text-muted"><span>{today.data?.currentTimeSlot ? `선호 시간대 ${today.data.currentTimeSlot.startTime.slice(0, 5)}–${today.data.currentTimeSlot.endTime.slice(0, 5)}` : "선호 시간대 미설정"}</span><span>{goal?.isAttended ? "출석 완료" : `출석까지 ${duration(goal?.remainingSeconds ?? 0)}`}</span></div>
      </Card>
      <section><SectionTitle href="/learner/library">이어서 학습</SectionTitle><div className="space-y-2.5">{courses.slice(0, 2).map((item) => <ContinueCourseCard key={item.enrollmentId} item={item} />)}{!enrollments.isLoading && courses.length === 0 && <p className="py-5 text-center text-xs text-muted">수강 중인 강좌가 없습니다.</p>}</div></section>
      <section><SectionTitle href="/learner/explore" linkLabel="더 보기">남은 시간에 맞는 숏폼</SectionTitle><div className="flex gap-3 overflow-x-auto pb-1">{shorts.map((item) => <CourseTile key={item.videoId} title={item.title} meta={`${item.recommendationType === "CONTINUE" ? "이어보기" : "무료 OT"} · ${duration(item.durationSeconds)}`} href={item.videoType === "OT" ? "/learner/feed" : `/learner/learn/${item.videoId}`} className="w-[220px] shrink-0" />)}</div>{!today.isLoading && shorts.length === 0 && <p className="py-4 text-xs text-muted">추천 숏폼이 없습니다.</p>}</section>
      <Link href="/learner/feed" className="block"><Card padding="md" className="flex items-center justify-between border border-line bg-card"><div><p className="text-sm font-medium">무료 OT 둘러보기</p><p className="mt-1 text-[11px] text-muted">관심 주제에 맞는 OT를 만나 보세요</p></div><span className="text-xl text-accent">→</span></Card></Link>
    </main>
  </>;
}

type EnrollmentItem = MyEnrollmentsDto["enrollments"][number];

// 다음 학습 항목으로 바로 이동하고, 조회 전이거나 남은 항목이 없으면 강좌 상세로 보낸다.
const getNextHref = (next: EnrollmentNextDto | undefined, courseId: number) => {
  if (next?.nextItemType === "VIDEO" && next.videoId) return `/learner/learn/${next.videoId}`;
  if (next?.nextItemType === "UNIT_QUIZ" && next.sectionId) return `/learner/quiz/${next.sectionId}`;
  if (next?.nextItemType === "FINAL_QUIZ") return `/learner/quiz/${courseId}?attemptType=FINAL`;
  if (next?.nextItemType === "WRONG_REVIEW") return `/learner/quiz/${courseId}?attemptType=WRONG_REVIEW`;
  return `/learner/courses/${courseId}`;
};

function ContinueCourseCard({ item }: { item: EnrollmentItem }) {
  const next = useEnrollmentNext(item.enrollmentId).data;
  return <Link href={getNextHref(next, item.courseId)}><Card padding="md" className="border border-line bg-panel"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-medium">{item.title}</p><p className="mt-1 text-[11px] text-muted">{item.statusMessage}</p></div><span className="text-[10px] text-accent">{item.progressPercent}%</span></div><ProgressBar value={item.progressPercent} className="mt-3" /></Card></Link>;
}
