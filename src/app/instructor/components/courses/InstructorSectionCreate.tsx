"use client";

import { useState, type FormEvent } from "react";
import { getErrorMessage } from "@/_lib/fetcher";
import useCreateInstructorSection from "@/api/instructor/useCreateInstructorSection";

interface Props {
  courseId: number;
}

export const InstructorSectionCreate = ({ courseId }: Props) => {
  const createMutation = useCreateInstructorSection(courseId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || createMutation.isPending) return;
    createMutation.mutate(trimmed, {
      onSuccess: () => {
        setTitle("");
        setIsFormOpen(false);
      },
    });
  };

  if (!isFormOpen) {
    return (
      <button type="button" onClick={() => setIsFormOpen(true)} className="mb-3 h-11 w-full cursor-pointer rounded-[4px] border border-dashed border-line-focus text-xs font-medium text-text-sub transition-colors hover:bg-panel">
        ＋ 섹션 추가
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-3 flex flex-col gap-3 rounded-[4px] border border-line p-3">
      <label className="flex flex-col gap-1.5 text-[11px] font-medium">섹션 제목
        <input required autoFocus maxLength={150} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 엑셀 기본 함수" className="h-10 rounded-[4px] border border-line bg-bg px-3 text-xs font-normal outline-none focus:border-line-focus" />
      </label>
      {createMutation.error && <p role="alert" className="rounded-[4px] border border-danger-line bg-danger-bg p-2.5 text-[11px] leading-5 text-danger">{getErrorMessage(createMutation.error, "섹션을 추가하지 못했습니다.")}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => { setIsFormOpen(false); createMutation.reset(); }} disabled={createMutation.isPending} className="h-10 flex-1 cursor-pointer rounded-[4px] border border-line text-xs text-muted disabled:cursor-not-allowed">취소</button>
        <button type="submit" disabled={!title.trim() || createMutation.isPending} className="h-10 flex-1 cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50">{createMutation.isPending ? "추가 중…" : "섹션 추가"}</button>
      </div>
    </form>
  );
};
