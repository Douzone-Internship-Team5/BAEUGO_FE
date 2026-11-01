"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/common";
import { ProgressBar } from "../components/shared/LearnerUI";

const choices = ["보고서의 분량과 디자인", "목적과 해결해야 할 문제", "참고한 자료의 개수", "작성자의 직급과 경력"];

export function QuizPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = selected === 1;
  return <main className="flex min-h-dvh flex-col px-5 pb-6 pt-4">
    <header className="flex items-center justify-between"><Link href="/learner/learn/lesson-2" aria-label="닫기" className="text-xl">×</Link><span className="text-xs">섹션 1 단위 확인 퀴즈</span><span className="text-xs text-muted">1 / 3</span></header>
    <ProgressBar value={33} className="mt-4" />
    <div className="mt-8"><p className="text-[10px] tracking-[1.5px] text-accent">Q1</p><h1 className="mt-3 text-lg font-medium leading-7">보고서 작성 시 가장 먼저 정의해야 할 요소는 무엇인가요?</h1></div>
    <div className="mt-6 space-y-2.5">{choices.map((choice, index) => <button key={choice} type="button" disabled={submitted} onClick={() => setSelected(index)} className={`flex w-full items-center gap-3 rounded-[4px] border p-4 text-left text-xs transition ${submitted && index === 1 ? "border-success-line bg-success-soft-bg" : submitted && selected === index ? "border-danger-line bg-danger-bg" : selected === index ? "border-accent bg-selected" : "border-line bg-panel"}`}><span className="flex size-6 items-center justify-center rounded-full border border-line text-[10px]">{String.fromCharCode(65 + index)}</span>{choice}{submitted && index === 1 && <span className="ml-auto text-success">✓</span>}</button>)}</div>
    {submitted && <Card padding="md" className="mt-5 border border-line bg-panel"><p className="text-sm font-medium">{correct ? "정답이에요" : "다시 확인해 보세요"}</p><p className="mt-2 text-xs leading-5 text-muted">보고서는 목적과 해결 과제를 먼저 정의하는 것이 최우선입니다.</p></Card>}
    <div className="mt-auto pt-6">{submitted ? <Link href="/learner/quiz/result"><Button fullWidth>결과 보기</Button></Link> : <Button fullWidth disabled={selected === null} onClick={() => setSubmitted(true)}>정답 확인</Button>}<Link href="/learner/library" className="mt-4 block text-center text-xs text-muted">응시 취소하고 돌아가기</Link></div>
  </main>;
}
