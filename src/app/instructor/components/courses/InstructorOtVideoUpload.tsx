"use client";

import { useState, type FormEvent } from "react";
import useUploadInstructorVideo from "@/api/instructor/useUploadInstructorVideo";
import { getErrorMessage } from "@/_lib/fetcher";

interface Props {
  courseId: number;
  currentTitle?: string;
}

export const InstructorOtVideoUpload = ({ courseId, currentTitle }: Props) => {
  const uploadMutation = useUploadInstructorVideo();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !title.trim() || uploadMutation.isPending) return;

    setError("");
    setMessage("");
    try {
      await uploadMutation.mutateAsync({
        courseId,
        videoType: "OT",
        title: title.trim(),
        file,
      });
      setFile(null);
      setIsFormOpen(false);
      setMessage("무료 OT 영상을 등록했습니다.");
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "무료 OT 영상 등록에 실패했습니다."));
    }
  };

  return <div className="border-t border-line px-3 py-3">
    {!isFormOpen ? (
      <button type="button" onClick={() => setIsFormOpen(true)} className="h-10 w-full cursor-pointer rounded-[4px] border border-line-strong text-xs font-medium text-text-sub transition-colors hover:bg-panel">
        {currentTitle ? "무료 OT 영상 교체" : "＋ 무료 OT 영상 올리기"}
      </button>
    ) : (
      <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-[11px] font-medium">영상 제목
          <input required maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="무료 OT 영상 제목" className="h-10 rounded-[4px] border border-line bg-bg px-3 text-xs font-normal outline-none focus:border-line-focus" />
        </label>
        <label className="flex cursor-pointer flex-col gap-1.5 text-[11px] font-medium">영상 파일
          <input required type="file" accept=".mp4,.mov,.webm,.avi,.mkv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="w-full rounded-[4px] border border-line bg-bg px-3 py-2 text-[10px] font-normal text-muted file:mr-3 file:cursor-pointer file:rounded-[3px] file:border-0 file:bg-panel file:px-2.5 file:py-1.5 file:text-[10px] file:text-text-sub" />
        </label>
        {error && <p role="alert" className="rounded-[4px] border border-danger-line bg-danger-bg p-2.5 text-[11px] leading-5 text-danger">{error}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={() => { setIsFormOpen(false); setError(""); }} disabled={uploadMutation.isPending} className="h-10 flex-1 cursor-pointer rounded-[4px] border border-line text-xs text-muted disabled:cursor-not-allowed">취소</button>
          <button type="submit" disabled={!title.trim() || !file || uploadMutation.isPending} className="h-10 flex-1 cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50">{uploadMutation.isPending ? "업로드 중…" : "무료 OT 등록"}</button>
        </div>
      </form>
    )}
    {message && <p role="status" className="mt-2 text-[10px] text-success">{message}</p>}
  </div>;
};
