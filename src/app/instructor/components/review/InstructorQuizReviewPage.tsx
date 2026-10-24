"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";

interface Props { courseId: string; sectionId?: string }
type QuizTab = "section1" | "section2" | "final";
interface Question { id: number; prompt: string; choices: string[]; answer: number; explanation: string }
const QUESTION: Question = { id: 1, prompt: "보고서 작성을 시작할 때 가장 먼저 확인해야 할 것은 무엇인가요?", choices: ["문서의 글꼴과 색상", "보고서를 읽는 사람과 목적", "참고할 수 있는 모든 자료", "보고서의 페이지 수"], answer: 1, explanation: "독자와 목적을 먼저 정하면 필요한 정보와 핵심 메시지를 구체적으로 정리할 수 있습니다." };

export const InstructorQuizReviewPage = ({ courseId, sectionId }: Props) => {
  const router = useRouter();
  const [tab, setTab] = useState<QuizTab>(sectionId === "final" ? "final" : "section1");
  const [question, setQuestion] = useState(QUESTION);
  const [added, setAdded] = useState(false);
  const backHref = `/instructor/courses/${courseId}`;
  return <div className="min-h-dvh pb-24"><InstructorScreenHeader title="퀴즈 검수" backHref={backHref} right={<button type="button" disabled className="cursor-not-allowed p-2 text-xs text-muted opacity-60">다시 생성</button>} />
    <main className="mx-auto max-w-3xl px-4 pt-5 md:px-8 md:pt-8"><p className="text-[10px] text-muted">강좌 콘텐츠</p><h1 className="mt-1 text-lg font-medium">퀴즈 검수</h1>
      <div className="mt-5 flex gap-4 overflow-x-auto border-b border-line">{([{ id: "section1", label: "섹션 1" }, { id: "section2", label: "섹션 2" }, { id: "final", label: "종합 퀴즈" }] as Array<{ id: QuizTab; label: string }>).map((item) => <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)} className={`cursor-pointer whitespace-nowrap border-b-2 pb-3 text-xs ${tab === item.id ? "border-accent text-text" : "border-transparent text-muted"}`}>{item.label}</button>)}</div>
      <div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-muted">문항 {added ? 2 : 1}개</span><span className="text-[10px] text-warning">검수 필요</span></div>
      {[question, ...(added ? [{ ...QUESTION, id: 2, prompt: "좋은 핵심 메시지의 조건으로 알맞은 것은 무엇인가요?" }] : [])].map((item, itemIndex) => <article key={item.id} className="mt-3 rounded-[4px] border border-line bg-panel p-3.5"><p className="mb-3 text-[10px] text-muted">문항 {itemIndex + 1}</p><textarea value={itemIndex === 0 ? question.prompt : item.prompt} onChange={(event) => itemIndex === 0 && setQuestion({ ...question, prompt: event.target.value })} rows={2} aria-label={`문항 ${itemIndex + 1}`} className="w-full resize-y bg-transparent text-xs leading-5 text-text outline-none" /><fieldset className="mt-3 flex flex-col gap-2">{item.choices.map((choice, index) => <label key={choice} className={`flex cursor-pointer items-center gap-2.5 rounded-[3px] border px-2.5 py-2.5 text-[11px] ${question.answer === index ? "border-success-line bg-success-soft-bg text-text-sub" : "border-line text-muted"}`}><input type="radio" name={`answer-${item.id}`} checked={question.answer === index} onChange={() => itemIndex === 0 && setQuestion({ ...question, answer: index })} className="accent-[#9DB8FF]" />{choice}<span className="ml-auto text-[9px] text-success">{question.answer === index ? "정답" : ""}</span></label>)}</fieldset><label className="mt-3 block text-[10px] text-muted">해설<textarea value={itemIndex === 0 ? question.explanation : item.explanation} onChange={(event) => itemIndex === 0 && setQuestion({ ...question, explanation: event.target.value })} rows={2} className="mt-1.5 w-full resize-y rounded-[3px] border border-line bg-bg p-2.5 text-[11px] leading-5 text-text-sub outline-none" /></label></article>)}
      <button type="button" onClick={() => setAdded(true)} disabled={added} className="mt-3 h-10 w-full cursor-pointer rounded-[4px] border border-dashed border-line-strong text-xs text-muted disabled:cursor-not-allowed disabled:opacity-50">＋ 문항 추가</button><p className="mt-4 text-[10px] text-dim">예시 퀴즈입니다. 저장 및 AI 재생성은 API 연동 후 활성화됩니다.</p>
    </main><div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur"><button type="button" onClick={() => router.push(backHref)} className="h-11 w-full cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg md:mx-auto md:block md:max-w-3xl">저장하고 검수 완료</button></div>
  </div>;
};
