"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useInstructorCourse from "@/api/instructor/useInstructorCourse";
import useInstructorScript from "@/api/instructor/useInstructorScript";
import useSaveInstructorScript from "@/api/instructor/useSaveInstructorScript";
import useRegenerateInstructorScript from "@/api/instructor/useRegenerateInstructorScript";
import type { InstructorScriptSegmentDto } from "@/types/instructor";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";

interface Props { courseId: string; videoId: string }
const formatTime = (milliseconds: number) => `${String(Math.floor(milliseconds / 60_000)).padStart(2, "0")}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, "0")}`;

export const InstructorScriptReviewPage = ({ courseId: rawCourseId, videoId: rawVideoId }: Props) => {
  const router = useRouter();
  const courseId = Number(rawCourseId);
  const videoId = Number(rawVideoId);
  const courseQuery = useInstructorCourse(courseId);
  const scriptQuery = useInstructorScript(videoId);
  const saveMutation = useSaveInstructorScript(videoId);
  const regenerateMutation = useRegenerateInstructorScript(videoId);
  const [draftSegments, setDraftSegments] = useState<InstructorScriptSegmentDto[] | null>(null);
  const segments = draftSegments ?? scriptQuery.data?.segments ?? [];
  const [notice, setNotice] = useState("");
  const backHref = `/instructor/courses/${rawCourseId}`;

  const video = useMemo(() => {
    const course = courseQuery.data;
    if (!course) return undefined;
    return [course.otVideo, ...course.sections.flatMap((section) => section.videos)].find((item) => item?.videoId === videoId) ?? undefined;
  }, [courseQuery.data, videoId]);

  const updateContent = (index: number, content: string) => {
    setDraftSegments((current) => (current ?? scriptQuery.data?.segments ?? []).map((segment, itemIndex) => itemIndex === index ? { ...segment, content } : segment));
    setNotice("");
  };
  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(segments.map((segment, index) => ({ ...segment, seq: index + 1 })));
      router.push(backHref);
    } catch {
      setNotice("");
    }
  };
  const handleRegenerate = async () => {
    try {
      await regenerateMutation.mutateAsync();
      setNotice("대본 다시 생성 요청을 보냈습니다.");
    } catch {
      setNotice("");
    }
  };

  return <div className="min-h-dvh pb-24"><InstructorScreenHeader title="대본 검수" backHref={backHref} right={<button type="button" onClick={() => void handleRegenerate()} disabled={regenerateMutation.isPending} className="cursor-pointer rounded-full border border-line px-3 py-2 text-[10px] text-text-sub disabled:cursor-not-allowed disabled:opacity-50">{regenerateMutation.isPending ? "요청 중…" : "대본 다시 생성"}</button>} />
    <main className="mx-auto max-w-3xl px-4 pt-5 md:px-8 md:pt-8"><div className="flex items-center justify-between"><div><p className="text-[10px] text-muted">{video?.videoType === "OT" ? "무료 OT" : "강의 영상"}{video ? ` · ${formatTime(video.durationSeconds * 1000)}` : ""}</p><h1 className="mt-1 text-base font-medium">{video?.title ?? "영상 대본"}</h1></div><span className={`text-[10px] ${scriptQuery.data?.transcriptReviewedAt ? "text-success" : "text-warning"}`}>{scriptQuery.data?.transcriptReviewedAt ? "검수 완료" : scriptQuery.data?.sttStatus ?? "불러오는 중"}</span></div>
      <div className="mt-4 flex aspect-video items-center justify-center rounded-[4px] border border-line bg-panel"><span className="text-xs text-muted">영상 미리보기는 영상 재생 API 연동 후 제공됩니다.</span></div>
      {scriptQuery.isPending && <p className="py-8 text-center text-sm text-muted">대본을 불러오는 중입니다.</p>}
      {scriptQuery.error && <p role="alert" className="mt-4 rounded border border-danger-line bg-danger-bg p-3 text-xs text-danger">{scriptQuery.error.message}</p>}
      {segments.length > 0 ? <><div className="mt-4 rounded-[4px] border border-warning-line bg-warning-bg px-3 py-2.5 text-[10px] leading-5 text-warning">음성 인식 결과를 확인하고 잘못 인식된 문장을 수정해 주세요.</div><section className="mt-5 flex flex-col gap-2.5">{segments.map((segment, index) => <TranscriptSegment key={`${videoId}-${segment.seq}`} time={`${formatTime(segment.startMs)} – ${formatTime(segment.endMs)}`} value={segment.content} onChange={(content) => updateContent(index, content)} />)}</section></> : !scriptQuery.isPending && !scriptQuery.error && <p className="mt-5 rounded border border-line bg-panel p-4 text-center text-xs text-muted">검수할 대본 구간이 없습니다. 대본을 다시 생성해 주세요.</p>}
      {(saveMutation.error || regenerateMutation.error) && <p role="alert" className="mt-4 rounded border border-danger-line bg-danger-bg p-3 text-xs text-danger">{(saveMutation.error ?? regenerateMutation.error)?.message}</p>}
      {notice && <p role="status" className="mt-4 rounded border border-success-line bg-success-soft-bg p-3 text-xs text-success">{notice}</p>}
    </main>
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur"><button type="button" onClick={() => void handleSave()} disabled={saveMutation.isPending || segments.length === 0 || segments.some((segment) => !segment.content.trim())} className="h-11 w-full cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50 md:mx-auto md:block md:max-w-3xl">{saveMutation.isPending ? "저장 중…" : "저장하고 검수 완료"}</button></div>
  </div>;
};

interface TranscriptSegmentProps { time: string; value: string; onChange: (value: string) => void }
const TranscriptSegment = ({ time, value, onChange }: TranscriptSegmentProps) => <label className="grid grid-cols-[100px_1fr] gap-2.5 rounded-[4px] border border-line bg-panel p-3"><span className="self-start pt-2 text-[10px] tabular-nums text-accent">{time}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} aria-label={`${time} 대본`} className="resize-y bg-transparent text-xs leading-5 text-text-sub outline-none" /></label>;
