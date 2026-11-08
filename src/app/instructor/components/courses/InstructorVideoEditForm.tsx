"use client";

import { useState, type FormEvent } from "react";
import { getErrorMessage } from "@/_lib/fetcher";
import useUpdateInstructorVideo from "@/api/instructor/useUpdateInstructorVideo";

interface Props {
  courseId: number;
  videoId: number;
  title: string;
  onClose: () => void;
}

/** 영상 제목 수정과 영상 파일 교체. 파일을 바꾸면 대본을 새로 만들어 다시 검수해야 한다. */
export const InstructorVideoEditForm = ({ courseId, videoId, title, onClose }: Props) => {
  const updateMutation = useUpdateInstructorVideo(courseId);
  const [draft, setDraft] = useState(title);
  const [file, setFile] = useState<File | null>(null);
  const trimmed = draft.trim();
  const unchanged = trimmed === title && !file;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmed || updateMutation.isPending) return;
    if (unchanged) return onClose();
    updateMutation.mutate({ videoId, title: trimmed, file }, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit} aria-label={`${title} 영상 수정`} className="flex flex-col gap-3 bg-panel/50 px-3 py-3">
      <label className="flex flex-col gap-1.5 text-[11px] font-medium">영상 제목
        <input required autoFocus maxLength={200} value={draft} onChange={(event) => setDraft(event.target.value)} className="h-10 rounded-[4px] border border-line bg-bg px-3 text-xs font-normal outline-none focus:border-line-focus" />
      </label>
      <label className="flex cursor-pointer flex-col gap-1.5 text-[11px] font-medium"><span>영상 파일 교체 <span className="font-normal text-muted">선택</span></span>
        <input type="file" accept=".mp4,.mov,.webm,.avi,.mkv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="w-full rounded-[4px] border border-line bg-bg px-3 py-2 text-[10px] font-normal text-muted file:mr-3 file:cursor-pointer file:rounded-[3px] file:border-0 file:bg-panel file:px-2.5 file:py-1.5 file:text-[10px] file:text-text-sub" />
      </label>
      {file && <p className="rounded-[4px] border border-warning-line bg-warning-bg p-2.5 text-[11px] leading-5 text-warning">새 영상으로 바꾸면 대본을 새로 만들어요. 대본 검수를 다시 해야 하고, 이 섹션의 단위 퀴즈도 다시 확인해 주세요.</p>}
      {updateMutation.error && <p role="alert" className="rounded-[4px] border border-danger-line bg-danger-bg p-2.5 text-[11px] leading-5 text-danger">{getErrorMessage(updateMutation.error, "영상 수정에 실패했습니다.")}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={onClose} disabled={updateMutation.isPending} className="h-10 flex-1 cursor-pointer rounded-[4px] border border-line text-xs text-muted disabled:cursor-not-allowed">취소</button>
        <button type="submit" disabled={!trimmed || updateMutation.isPending} className="h-10 flex-1 cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50">{updateMutation.isPending ? (file ? "업로드 중…" : "저장 중…") : file ? "영상 교체" : "저장"}</button>
      </div>
    </form>
  );
};
