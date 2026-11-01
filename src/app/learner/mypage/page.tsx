"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/common";
import { useAuthStore } from "@/app/login/store/useAuthStore";
import { BrandHeader } from "../components/shared/LearnerHeader";

const settings = [{ label: "관심 주제", value: "문서 작성 · 업무 자동화" }, { label: "학습 목표", value: "매일 20분" }, { label: "선호 시간", value: "08:00–09:00" }];
const menu = [{ label: "출석 · 목표 달성", value: "›", href: "/learner/attendance" }, { label: "내 강좌", value: "3개", href: "/learner/library" }, { label: "좋아요", value: "4개", href: "/learner/library/likes" }, { label: "오답노트", value: "2개 복습 필요", href: "/learner/library/quiz" }];

export default function MyPage() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const name = user?.name?.trim() || "김배우";
  return <>
    <BrandHeader />
    <main className="space-y-4 px-5 pb-8">
      <Card padding="md" className="flex items-center gap-3 border border-line bg-panel"><span className="flex size-12 items-center justify-center rounded-full bg-selected text-lg">{name.slice(0, 1)}</span><div><p className="text-sm font-medium">{name}</p><p className="mt-1 text-[10px] text-muted">{user?.email || "learner2@baeugo.test"}</p></div></Card>
      <Card padding="md" className="border border-line bg-panel"><div className="flex items-center justify-between"><h1 className="text-sm font-medium">학습 설정</h1><button type="button" onClick={() => setEditing(!editing)} className="text-xs text-accent">{editing ? "완료" : "수정"}</button></div><div className="mt-3 divide-y divide-line">{settings.map((item) => <div key={item.label} className="flex items-center justify-between py-3 text-xs"><span className="text-muted">{item.label}</span>{editing ? <input defaultValue={item.value} className="max-w-[65%] bg-transparent text-right text-text outline-none" aria-label={item.label} /> : <span>{item.value}</span>}</div>)}</div></Card>
      <Card padding="none" className="divide-y divide-line border border-line bg-panel">{menu.map((item) => <Link key={item.label} href={item.href} className="flex items-center justify-between px-4 py-4 text-xs"><span>{item.label}</span><span className="text-muted">{item.value}</span></Link>)}</Card>
      <Link href="/instructor" className="block"><Button fullWidth variant="outline">강사 모드로 전환</Button></Link>
      <button type="button" onClick={() => { setUser(null); useAuthStore.getState().setLoginState(false, "", ""); window.localStorage.removeItem("accessToken"); router.replace("/login"); }} className="w-full py-2 text-xs text-muted">로그아웃</button>
    </main>
  </>;
}
