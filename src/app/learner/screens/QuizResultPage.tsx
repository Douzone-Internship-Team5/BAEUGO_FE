"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Card } from "@/components/common";
import api from "@/_lib/fetcher";
import useCourseCompletion from "@/api/learning/useCourseCompletion";
import type { QuizNotesDto } from "@/types/learning";
import { getErrorMessage } from "@/_lib/fetcher";
import { ProgressBar } from "../components/shared/LearnerUI";

export function QuizResultPage() {
  const search = useSearchParams();
  const courseId = Number(search.get("courseId"));
  const query = useCourseCompletion(courseId);
  const notes = useQuery({
    queryKey: ["learning", "quiz-notes", "result", courseId],
    enabled: Number.isInteger(courseId) && courseId > 0,
    queryFn: async ({ signal }) => {
      const response = await api.get<QuizNotesDto>({ endpoint: "/me/quiz-notes?status=ALL", signal });
      if (!response) throw new Error("오답노트 응답이 비어 있습니다.");
      return response.data;
    },
  });
  const completion = query.data;
  if (query.isLoading) return <main className="p-8 text-center text-sm text-muted">수료 여부를 확인하는 중이에요.</main>;
  if (query.isError || !completion) return <main className="p-8 text-center text-sm text-muted">{getErrorMessage(query.error, "수료 여부를 불러오지 못했습니다.")}</main>;
  const needsReview = completion.redirectTarget === "LIBRARY_QUIZ_NOTES";
  const courseNotes = (notes.data?.quizNotes ?? []).filter((note) => note.courseId === courseId);
  const courseWrongNotes = courseNotes.filter((note) => note.status === "REVIEW_NEEDED");
  const courseCorrectCount = courseNotes.filter((note) => note.status === "CORRECT").length;
  const title = completion.isCompleted ? "수료를 축하해요!" : needsReview ? "거의 다 왔어요!" : "조금만 더 학습해요";
  return <main className="flex min-h-dvh flex-col px-5 pb-6 pt-6">
    <header className="text-right"><Link href="/learner" className="text-xs text-muted">닫기 ×</Link></header>
    <div className="py-7 text-center"><span className={`mx-auto flex size-16 items-center justify-center rounded-full text-2xl ${completion.isCompleted ? "bg-success-soft-bg text-success" : "bg-selected text-accent"}`}>{completion.isCompleted ? "✓" : "!"}</span><p className="mt-4 text-xs text-accent">코스 종합 퀴즈 결과</p><h1 className="mt-2 text-2xl font-medium">{title}</h1><p className="mt-2 text-xs text-muted">{completion.message}</p></div>
    <div className="flex gap-2"><Card padding="md" className="flex-1 border border-line bg-panel"><p className="text-[10px] text-muted">진도</p><p className="mt-2 text-lg">{completion.progressPercent}%</p><ProgressBar value={completion.progressPercent} className="mt-3" /></Card><Card padding="md" className="flex-1 border border-line bg-panel"><p className="text-[10px] text-muted">맞힌 문제</p><p className="mt-2 text-lg">{notes.isLoading ? "…" : `${courseCorrectCount}개`}</p></Card><Card padding="md" className="flex-1 border border-line bg-panel"><p className="text-[10px] text-muted">남은 오답</p><p className="mt-2 text-lg">{completion.unresolvedWrongCount}개</p></Card></div>
    {completion.unresolvedWrongCount > 0 && <section className="mt-5"><div className="flex items-center justify-between"><h2 className="text-sm font-medium">다시 풀 문제</h2><Link href="/learner/library/quiz" className="text-[10px] text-accent">오답노트 전체 보기 →</Link></div>{notes.isLoading && <p className="py-4 text-xs text-muted">오답 문제를 불러오는 중이에요.</p>}{notes.isError && <p role="alert" className="py-3 text-xs text-danger">오답 문제 목록을 불러오지 못했습니다. 오답노트에서 다시 확인해 주세요.</p>}{courseWrongNotes.map((note) => <Card key={note.recordId} padding="md" className="mt-2 border border-line bg-panel"><p className="text-[10px] text-muted">{note.quizType === "UNIT" ? "단위 퀴즈" : "종합 퀴즈"} · {note.wrongCount}회 오답</p><p className="mt-2 text-xs leading-5">{note.questionContent}</p><Link href={`/learner/quiz/${note.courseId}?attemptType=WRONG_REVIEW&questionId=${note.questionId}`} className="mt-3 inline-block text-xs text-accent">이 문제 다시 풀기 →</Link></Card>)}{!notes.isLoading && !notes.isError && courseWrongNotes.length === 0 && <p className="mt-3 text-xs text-muted">이 코스에서 남은 오답이 없어요.</p>}</section>}
    <div className="mt-auto space-y-2 pt-6">{needsReview && <Link href="/learner/library/quiz" className="block"><Button fullWidth>오답노트에서 다시 풀기</Button></Link>}{!completion.isCompleted && !needsReview && <Link href={`/learner/courses/${completion.courseId}`} className="block"><Button fullWidth>강좌로 돌아가기</Button></Link>}<Link href="/learner" className="block"><Button fullWidth variant={completion.isCompleted ? "primary" : "outline"}>홈으로</Button></Link></div>
  </main>;
}
