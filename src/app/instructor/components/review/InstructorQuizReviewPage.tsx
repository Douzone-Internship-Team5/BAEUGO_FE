"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, getErrorMessage } from "@/_lib/fetcher";
import useInstructorCourse from "@/api/instructor/useInstructorCourse";
import useInstructorQuiz from "@/api/instructor/useInstructorQuiz";
import useSaveInstructorQuiz from "@/api/instructor/useSaveInstructorQuiz";
import useRegenerateInstructorQuiz from "@/api/instructor/useRegenerateInstructorQuiz";
import type { InstructorQuestionDto } from "@/types/instructor";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";

interface Props { courseId: string; sectionId?: string }

export const InstructorQuizReviewPage = ({ courseId: rawCourseId, sectionId: initialSectionId }: Props) => {
  const router = useRouter();
  const courseId = Number(rawCourseId);
  const [sectionId, setSectionId] = useState<number | undefined>(() => initialSectionId && initialSectionId !== "final" ? Number(initialSectionId) : undefined);
  const courseQuery = useInstructorCourse(courseId);
  const quizQuery = useInstructorQuiz(courseId, sectionId);
  const saveMutation = useSaveInstructorQuiz(courseId, sectionId);
  const regenerateMutation = useRegenerateInstructorQuiz(courseId, sectionId ?? 0);
  const [draft, setDraft] = useState<{ key: string; questions: InstructorQuestionDto[] } | null>(null);
  const [notice, setNotice] = useState("");
  const [validationAlert, setValidationAlert] = useState("");
  const backHref = `/instructor/courses/${rawCourseId}`;
  const draftKey = sectionId === undefined ? "final" : String(sectionId);
  const questions = draft?.key === draftKey ? draft.questions : quizQuery.data?.questions ?? [];
  const updateQuestions = (updater: (current: InstructorQuestionDto[]) => InstructorQuestionDto[]) => {
    setDraft((current) => ({ key: draftKey, questions: updater(current?.key === draftKey ? current.questions : quizQuery.data?.questions ?? []) }));
    setNotice("");
    setValidationAlert("");
  };

  const updateQuestion = (index: number, update: Partial<InstructorQuestionDto>) => {
    updateQuestions((current) => current.map((question, questionIndex) => questionIndex === index ? { ...question, ...update } : question));
  };
  const handleSave = async () => {
    const hasValidQuestionCount = questions.length >= 3 && questions.length <= 5;
    const hasValidQuestionStructure = questions.every((question) =>
      question.choices.length === 4 &&
      Number.isInteger(question.correctChoiceNo) &&
      question.correctChoiceNo >= 1 &&
      question.correctChoiceNo <= 4,
    );

    if (!hasValidQuestionCount || !hasValidQuestionStructure) {
      setValidationAlert("퀴즈는 3~5문항이어야 하며, 각 문항의 보기(choices)는 정확히 4개, 정답 번호(correctChoiceNo)는 1~4여야 합니다.");
      return;
    }
    if (questions.some((question) => !question.explanation.trim())) {
      setValidationAlert("모든 문항의 해설을 입력해 주세요.");
      return;
    }

    setValidationAlert("");
    try {
      const saved = await saveMutation.mutateAsync(questions.map((question, index) => ({ ...question, orderNo: index + 1 })));
      setDraft({ key: draftKey, questions: saved.questions });
      router.push(backHref);
    } catch (error) {
      setValidationAlert(getErrorMessage(error, "퀴즈 저장에 실패했습니다."));
      setNotice("");
    }
  };
  const handleRegenerate = async () => {
    try {
      await regenerateMutation.mutateAsync();
      setNotice("AI 퀴즈 재생성을 요청했습니다.");
    } catch {
      setNotice("");
    }
  };
  const addQuestion = () => {
    if (questions.length >= 5) return;
    updateQuestions((current) => [...current, {
      content: "",
      choices: ["", "", "", ""],
      correctChoiceNo: 1,
      explanation: "",
    }]);
  };
  const activeQuiz = quizQuery.data;
  const quizNotCreated = quizQuery.error instanceof ApiError && quizQuery.error.status === 404;
  const isFinal = sectionId === undefined;

  return <div className="min-h-dvh pb-24"><InstructorScreenHeader title="퀴즈 검수" backHref={backHref} right={<button type="button" onClick={() => void handleRegenerate()} disabled={isFinal || regenerateMutation.isPending} className="cursor-pointer p-2 text-xs text-muted disabled:cursor-not-allowed disabled:opacity-50">{regenerateMutation.isPending ? "요청 중…" : "다시 생성"}</button>} />
    <main className="mx-auto max-w-3xl px-4 pt-5 md:px-8 md:pt-8"><p className="text-[10px] text-muted">강좌 콘텐츠</p><h1 className="mt-1 text-lg font-medium">퀴즈 검수</h1>
      {courseQuery.data && <div className="mt-5 flex gap-4 overflow-x-auto border-b border-line"><button type="button" role="tab" aria-selected={isFinal} onClick={() => setSectionId(undefined)} className={`cursor-pointer whitespace-nowrap border-b-2 pb-3 text-xs ${isFinal ? "border-accent text-text" : "border-transparent text-muted"}`}>종합 퀴즈</button>{courseQuery.data.sections.map((section) => <button key={section.sectionId} type="button" role="tab" aria-selected={sectionId === section.sectionId} onClick={() => setSectionId(section.sectionId)} className={`cursor-pointer whitespace-nowrap border-b-2 pb-3 text-xs ${sectionId === section.sectionId ? "border-accent text-text" : "border-transparent text-muted"}`}>섹션 {section.sortOrder}</button>)}</div>}
      {courseQuery.isPending || (quizQuery.isPending && !quizNotCreated) ? <p className="py-12 text-center text-sm text-muted">퀴즈를 불러오는 중입니다.</p> : quizQuery.error && !quizNotCreated ? <p role="alert" className="mt-4 rounded border border-danger-line bg-danger-bg p-3 text-xs text-danger">{quizQuery.error.message}</p> : <>
        <div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-muted">문항 {questions.length}개 · 3~5개 필요</span><span className={`text-[10px] ${activeQuiz?.reviewedAt ? "text-success" : "text-warning"}`}>{activeQuiz?.reviewedAt ? "검수 완료" : activeQuiz?.aiStatus === "PROCESSING" || activeQuiz?.aiStatus === "PENDING" ? "AI 생성 중" : "검수 필요"}</span></div>
        {questions.map((question, index) => <article key={question.questionId ?? `new-${index}`} className="mt-3 rounded-[4px] border border-line bg-panel p-3.5"><div className="mb-2 flex items-center justify-between"><p className="text-[10px] text-muted">문항 {index + 1}</p><button type="button" onClick={() => updateQuestions((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="cursor-pointer p-1 text-[10px] text-muted hover:text-danger">삭제</button></div><textarea value={question.content} onChange={(event) => updateQuestion(index, { content: event.target.value })} rows={2} aria-label={`문항 ${index + 1}`} className="w-full resize-y bg-transparent text-xs leading-5 text-text outline-none" /><fieldset className="mt-3 flex flex-col gap-2">{question.choices.map((choice, choiceIndex) => <label key={`choice-${choiceIndex}`} className={`flex cursor-pointer items-center gap-2.5 rounded-[3px] border px-2.5 py-2.5 text-[11px] ${question.correctChoiceNo === choiceIndex + 1 ? "border-success-line bg-success-soft-bg text-text-sub" : "border-line text-muted"}`}><input type="radio" name={`answer-${question.questionId ?? index}`} checked={question.correctChoiceNo === choiceIndex + 1} onChange={() => updateQuestion(index, { correctChoiceNo: choiceIndex + 1 })} className="accent-[#9DB8FF]" /><input value={choice} onChange={(event) => updateQuestion(index, { choices: question.choices.map((item, i) => i === choiceIndex ? event.target.value : item) })} placeholder={`보기 ${choiceIndex + 1}`} aria-label={`문항 ${index + 1} 보기 ${choiceIndex + 1}`} className="min-w-0 flex-1 bg-transparent outline-none" />{question.correctChoiceNo === choiceIndex + 1 && <span className="text-[9px] text-success">정답</span>}</label>)}</fieldset><label className="mt-3 block text-[10px] text-muted">해설<textarea value={question.explanation} onChange={(event) => updateQuestion(index, { explanation: event.target.value })} rows={2} className="mt-1.5 w-full resize-y rounded-[3px] border border-line bg-bg p-2.5 text-[11px] leading-5 text-text-sub outline-none" /></label></article>)}
        {questions.length < 5 && <button type="button" onClick={addQuestion} className="mt-3 h-10 w-full cursor-pointer rounded-[4px] border border-dashed border-line-strong text-xs text-muted">＋ 문항 추가</button>}
      </>}
      {regenerateMutation.error && <p role="alert" className="mt-4 rounded border border-danger-line bg-danger-bg p-3 text-xs text-danger">{regenerateMutation.error.message}</p>}
      {validationAlert && <p role="alert" className="mt-4 rounded border border-danger-line bg-danger-bg p-3 text-xs leading-5 text-danger">{validationAlert}</p>}
      {notice && <p role="status" className="mt-4 rounded border border-success-line bg-success-soft-bg p-3 text-xs text-success">{notice}</p>}
      <div className="mt-8 flex justify-center pb-6"><button type="button" onClick={() => void handleSave()} disabled={saveMutation.isPending} className="h-11 w-full cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50">{saveMutation.isPending ? "저장 중…" : "저장하고 검수 완료"}</button></div>
    </main>
  </div>;
};
