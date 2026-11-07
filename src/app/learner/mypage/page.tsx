"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/common";
import { useAuthStore } from "@/app/login/store/useAuthStore";
import { BrandHeader } from "../components/shared/LearnerHeader";
import useMe from "@/api/user/useMe";
import useMyEnrollments from "@/api/learning/useMyEnrollments";
import useMyLikes from "@/api/learning/useMyLikes";
import { useQuery } from "@tanstack/react-query";
import api from "@/_lib/fetcher";
import { logout } from "@/_lib/logout";
import type { QuizNotesDto } from "@/types/learning";
import useCodes from "@/api/learning/useCodes";

const formatMinutes = (value?: number | null) => value ? `매일 ${value}분` : "미설정";

export default function MyPage() {
  const router = useRouter();
  const meQuery = useMe();
  const codes = useCodes();
  const authUser = useAuthStore((state) => state.user);
  const enrollments = useMyEnrollments();
  const likes = useMyLikes();
  const notes = useQuery({ queryKey: ["learning", "quiz-notes"], queryFn: async ({ signal }) => { const response = await api.get<QuizNotesDto>({ endpoint: "/me/quiz-notes", signal }); if (!response) throw new Error("오답노트 응답이 비어 있습니다."); return response.data; } });
  const user = meQuery.data ?? authUser;
  const name = user?.name?.trim() || "김배우";
  const learnerSetup = meQuery.data?.onboarding && "interestTopicIds" in meQuery.data.onboarding ? meQuery.data.onboarding : null;
  const interestNames = (codes.data?.topics ?? []).filter((topic) => learnerSetup?.interestTopicIds.includes(topic.id)).map((topic) => topic.name);
  const settings = [{ label: "관심 주제", value: interestNames.join(" · ") || "미설정" }, { label: "학습 목표", value: formatMinutes(learnerSetup?.dailyGoalMinutes) }, { label: "선호 시간", value: learnerSetup?.timeSlots.map((slot) => `${slot.startTime.slice(0, 5)}–${slot.endTime.slice(0, 5)}`).join(", ") || "미설정" }];
  const menu = [{ label: "출석 · 목표 달성", value: "›", href: "/learner/attendance" }, { label: "내 강좌", value: `${enrollments.data?.counts.all ?? 0}개`, href: "/learner/library" }, { label: "좋아요", value: `${likes.data?.totalCount ?? 0}개`, href: "/learner/library/likes" }, { label: "오답노트", value: `${notes.data?.counts.reviewNeeded ?? 0}개 복습 필요`, href: "/learner/library/quiz" }, { label: "계정 설정", value: "›", href: "/learner/mypage/account" }];
  return <>
    <BrandHeader />
    <main className="space-y-4 px-5 pb-8">
      <Card padding="md" className="flex items-center gap-3 border border-line bg-panel">{meQuery.data?.profileImageUrl ? <span role="img" aria-label="프로필 사진" className="size-12 shrink-0 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${meQuery.data.profileImageUrl}")` }} /> : <span className="flex size-12 items-center justify-center rounded-full bg-selected text-lg">{name.slice(0, 1)}</span>}<div><p className="text-sm font-medium">{name}</p><p className="mt-1 text-[10px] text-muted">{user?.email || "계정 정보를 불러오는 중"}</p></div></Card>
      <Card padding="md" className="border border-line bg-panel"><div className="flex items-center justify-between"><h1 className="text-sm font-medium">학습 설정</h1><Link href="/learner/mypage/settings" className="text-xs text-accent">수정</Link></div><div className="mt-3 divide-y divide-line">{settings.map((item) => <div key={item.label} className="flex items-center justify-between gap-4 py-3 text-xs"><span className="shrink-0 text-muted">{item.label}</span><span className="text-right">{item.value}</span></div>)}</div></Card>
      <Card padding="none" className="divide-y divide-line border border-line bg-panel">{menu.map((item) => <Link key={item.label} href={item.href} className="flex items-center justify-between px-4 py-4 text-xs"><span>{item.label}</span><span className="text-muted">{item.value}</span></Link>)}</Card>
      <button type="button" onClick={async () => { await logout(); router.replace("/login"); }} className="w-full py-2 text-xs text-muted">로그아웃</button>
    </main>
  </>;
}
