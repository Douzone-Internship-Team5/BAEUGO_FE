"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/common";
import { LearnerHeader } from "../components/shared/LearnerHeader";

export function EnrollmentPage() {
  const [paid, setPaid] = useState(false);
  return <>
    <LearnerHeader title="수강 신청" backHref="/learner/courses/course-1" />
    <main className="space-y-5 px-5 py-5">
      <h1 className="text-xl font-medium">수강 신청</h1>
      <Card padding="md" className="border border-line bg-panel"><p className="text-sm font-medium">일잘러의 보고서 작성법</p><p className="mt-2 text-[11px] text-muted">이하늘 · 19분 · 예상 완료 2일</p></Card>
      <section><h2 className="mb-3 text-xs font-medium">결제 수단</h2><Card padding="md" className="flex items-center justify-between border border-line bg-panel"><span className="text-xs">신한카드 ****-1234</span><button type="button" className="text-xs text-accent">변경</button></Card></section>
      <section className="space-y-3 border-y border-line py-4 text-xs"><div className="flex justify-between"><span className="text-muted">수강료</span><span>29,000원</span></div><div className="flex justify-between font-medium"><span>결제 금액</span><span>29,000원</span></div></section>
      <p className="text-[10px] leading-5 text-muted">시연용 목업 결제예요. 실제로 돈이 나가지 않아요.</p>
      {paid ? <Card padding="md" className="border border-success-line bg-success-soft-bg text-sm">수강 신청이 완료됐어요. <Link href="/learner/learn/lesson-2" className="ml-1 text-accent underline">1강 시작하기</Link></Card> : <Button fullWidth onClick={() => setPaid(true)}>29,000원 결제하고 1강 시작</Button>}
      <Link href="/learner/courses/course-1" className="block text-center text-xs text-muted">취소</Link>
    </main>
  </>;
}
