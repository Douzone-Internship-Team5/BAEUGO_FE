"use client";

import { useState, type FormEvent } from "react";
import { getErrorMessage } from "@/_lib/fetcher";
import useDeleteInstructorSection from "@/api/instructor/useDeleteInstructorSection";
import useRenameInstructorSection from "@/api/instructor/useRenameInstructorSection";

interface Props {
  courseId: number;
  sectionId: number;
  title: string;
}

type Mode = "idle" | "rename" | "confirmDelete";

/** 섹션 이름 변경과 삭제. 삭제는 한 번 더 확인한다. */
export const InstructorSectionActions = ({ courseId, sectionId, title }: Props) => {
  const renameMutation = useRenameInstructorSection(courseId);
  const deleteMutation = useDeleteInstructorSection(courseId);
  const [mode, setMode] = useState<Mode>("idle");
  const [draft, setDraft] = useState(title);
  const error = renameMutation.error ?? deleteMutation.error;
  const isPending = renameMutation.isPending || deleteMutation.isPending;

  const close = () => {
    setMode("idle");
    renameMutation.reset();
    deleteMutation.reset();
  };

  const handleRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isPending) return;
    if (trimmed === title) return close();
    renameMutation.mutate({ sectionId, title: trimmed }, { onSuccess: () => setMode("idle") });
  };

  return (
    <div className="border-t border-line px-3 py-2.5">
      {mode === "idle" && (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => { setDraft(title); setMode("rename"); }} className="cursor-pointer rounded-[4px] px-2 py-1 text-[10px] text-muted transition hover:text-text">이름 변경</button>
          <button type="button" onClick={() => setMode("confirmDelete")} className="cursor-pointer rounded-[4px] px-2 py-1 text-[10px] text-muted transition hover:text-danger">섹션 삭제</button>
        </div>
      )}
      {mode === "rename" && (
        <form onSubmit={handleRename} className="flex gap-2">
          <input required autoFocus maxLength={150} value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="섹션 제목" className="h-9 min-w-0 flex-1 rounded-[4px] border border-line bg-bg px-3 text-xs outline-none focus:border-line-focus" />
          <button type="button" onClick={close} disabled={isPending} className="h-9 shrink-0 cursor-pointer rounded-[4px] border border-line px-3 text-[11px] text-muted">취소</button>
          <button type="submit" disabled={!draft.trim() || isPending} className="h-9 shrink-0 cursor-pointer rounded-[4px] bg-accent px-3 text-[11px] font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50">{renameMutation.isPending ? "저장 중…" : "저장"}</button>
        </form>
      )}
      {mode === "confirmDelete" && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-danger">섹션 안의 학습 영상과 단위 퀴즈도 함께 삭제돼요.</p>
          <div className="flex gap-2">
            <button type="button" onClick={close} disabled={isPending} className="h-9 cursor-pointer rounded-[4px] border border-line px-3 text-[11px] text-muted">취소</button>
            <button type="button" onClick={() => deleteMutation.mutate(sectionId)} disabled={isPending} className="h-9 cursor-pointer rounded-[4px] border border-danger-line bg-danger-bg px-3 text-[11px] font-medium text-danger disabled:cursor-wait">{deleteMutation.isPending ? "삭제 중…" : "삭제"}</button>
          </div>
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-[11px] text-danger">{getErrorMessage(error)}</p>}
    </div>
  );
};
