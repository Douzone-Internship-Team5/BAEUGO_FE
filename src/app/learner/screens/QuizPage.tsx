"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button, Card } from "@/components/common";
import useQuizAttempt from "@/api/learning/useQuizAttempt";
import useQuizAnswer from "@/api/learning/useQuizAnswer";
import useQuizAttemptCancel from "@/api/learning/useQuizAttemptCancel";
import type { QuizAnswerDto } from "@/types/learning";
import { getErrorMessage } from "@/_lib/fetcher";
import { ProgressBar } from "../components/shared/LearnerUI";

export function QuizPage() {
  const params = useParams<{ quizId: string }>();
  const router = useRouter();
  const search = useSearchParams();
  const id = Number(params.quizId);
  const attemptType = search.get("attemptType");
  const type = attemptType === "FINAL" || attemptType === "WRONG_REVIEW" ? attemptType : undefined;
  const questionId = Number(search.get("questionId")) || undefined;
  const query = useQuizAttempt(id, type, questionId);
  const [selected, setSelected] = useState<number | null>(null);
  const [answer, setAnswer] = useState<QuizAnswerDto | null>(null);
  const attempt = query.data;
  const question = attempt?.questions[0];
  const mutation = useQuizAnswer(attempt?.quizId ?? 0);
  const cancel = useQuizAttemptCancel();
  if (query.isLoading) return <main className="p-8 text-center text-sm text-muted">퀴즈를 불러오는 중이에요.</main>;
  if (query.isError || !attempt) return <main className="p-8 text-center text-sm text-muted">{getErrorMessage(query.error, "퀴즈를 불러오지 못했습니다.")}</main>;
  const handleSubmit = () => {
    if (!question || selected === null || !attempt.quizId) return;
    const now = new Date();
    mutation.mutate({ attemptId: attempt.attemptId, attemptQuestionId: question.attemptQuestionId, selectedChoiceNo: selected, activitySession: { sessionKey: `quiz-${attempt.attemptId}-${question.attemptQuestionId}`, startedAt: new Date(now.getTime() - 1000).toISOString(), endedAt: now.toISOString(), activeSeconds: 1 } }, { onSuccess: (result) => setAnswer(result) });
  };
  const handleCancel = () => {
    if (!attempt || attempt.status !== "IN_PROGRESS") return router.push("/learner/library");
    cancel.mutate(attempt.attemptId, { onSuccess: () => router.push("/learner/library") });
  };
  // 종합 퀴즈는 id가 courseId라서 결과 화면에서 수료 여부를 조회한다.
  const finishedHref = type === "FINAL" ? `/learner/quiz/result?courseId=${id}` : "/learner/library/quiz";
  if (!question) return <main className="flex min-h-dvh flex-col px-5 pb-6 pt-4"><header className="flex items-center justify-between"><Link href="/learner/library" aria-label="닫기" className="text-xl">×</Link><span className="text-xs">퀴즈 완료</span></header><Card padding="md" className="mt-8 border border-success-line bg-success-soft-bg text-sm">모든 문제를 풀었어요.</Card><Link href={finishedHref} className="mt-auto block"><Button fullWidth>{type === "FINAL" ? "결과 보기" : "오답노트 보기"}</Button></Link></main>;
  return <main className="flex min-h-dvh flex-col px-5 pb-6 pt-4">
    <header className="flex items-center justify-between"><Link href="/learner/library" aria-label="닫기" className="text-xl">×</Link><span className="text-xs">{attempt.quizType === "UNIT" ? "단위 확인 퀴즈" : "퀴즈"}</span><span className="text-xs text-muted">{question.orderNo} / {attempt.totalQuestions}</span></header>
    <ProgressBar value={attempt.totalQuestions ? (question.orderNo / attempt.totalQuestions) * 100 : 0} className="mt-4" />
    <div className="mt-8"><p className="text-[10px] tracking-[1.5px] text-accent">Q{question.orderNo}</p><h1 className="mt-3 text-lg font-medium leading-7">{question.content}</h1></div>
    <div className="mt-6 space-y-2.5">{question.choices.map((choice) => <button key={choice.choiceNo} type="button" disabled={!!answer} onClick={() => setSelected(choice.choiceNo)} className={`flex w-full items-center gap-3 rounded-[4px] border p-4 text-left text-xs transition ${answer && choice.choiceNo === answer.correctChoiceNo ? "border-success-line bg-success-soft-bg" : answer && choice.choiceNo === answer.selectedChoiceNo ? "border-danger-line bg-danger-bg" : selected === choice.choiceNo ? "border-accent bg-selected" : "border-line bg-panel"}`}><span className="flex size-6 items-center justify-center rounded-full border border-line text-[10px]">{String.fromCharCode(64 + choice.choiceNo)}</span>{choice.content}{answer && choice.choiceNo === answer.correctChoiceNo && <span className="ml-auto text-success">✓</span>}</button>)}</div>
    {answer && <Card padding="md" className="mt-5 border border-line bg-panel"><p className="text-sm font-medium">{answer.isCorrect ? "정답이에요" : "다시 확인해 보세요"}</p><p className="mt-2 text-xs leading-5 text-muted">{answer.explanation}</p></Card>}
    {mutation.isError && <p role="alert" className="mt-3 text-xs text-danger">{getErrorMessage(mutation.error)}</p>}
    {cancel.isError && <p role="alert" className="mt-3 text-xs text-danger">{getErrorMessage(cancel.error, "응시를 취소하지 못했습니다.")}</p>}
    <div className="mt-auto pt-6">{answer ? <Button fullWidth onClick={() => { setAnswer(null); setSelected(null); void query.refetch(); }}>{answer.nextOrderNo ? "다음 문제" : "결과 보기"}</Button> : <Button fullWidth disabled={selected === null || mutation.isPending} onClick={handleSubmit}>{mutation.isPending ? "채점 중…" : "정답 확인"}</Button>}<button type="button" onClick={handleCancel} disabled={cancel.isPending} className="mt-4 block w-full cursor-pointer text-center text-xs text-muted disabled:cursor-wait">{cancel.isPending ? "취소하는 중…" : "응시 취소하고 돌아가기"}</button></div>
  </main>;
}
