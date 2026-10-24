"use client";

import { useRouter } from "next/navigation";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";

interface Props { courseId: string; videoId: string }
const INITIAL_SEGMENTS = [
  { time: "00:00", text: "안녕하세요. 이번 강의에서는 보고서의 목적과 핵심 메시지를 정리하는 방법을 알아보겠습니다." },
  { time: "00:18", text: "먼저 보고서를 읽는 사람이 누구인지, 어떤 결정을 내려야 하는지 생각해 봅니다." },
  { time: "00:42", text: "독자의 상황을 이해하면 전달해야 할 정보의 우선순위가 명확해집니다." },
];

export const InstructorScriptReviewPage = ({ courseId, videoId }: Props) => {
  const router = useRouter();
  const backHref = `/instructor/courses/${courseId}`;
  return <div className="min-h-dvh pb-24"><InstructorScreenHeader title="대본 검수" backHref={backHref} />
    <main className="mx-auto max-w-3xl px-4 pt-5 md:px-8 md:pt-8"><div className="flex items-center justify-between"><div><p className="text-[10px] text-muted">무료 OT · 04:32</p><h1 className="mt-1 text-base font-medium">좋은 보고서는 무엇이 다를까요?</h1></div><button type="button" disabled className="cursor-not-allowed rounded-full border border-line px-3 py-2 text-[10px] text-muted opacity-60">대본 다시 생성</button></div>
      <div className="mt-4 flex aspect-video items-center justify-center rounded-[4px] border border-line bg-panel"><button type="button" aria-label="영상 미리보기" className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-selected text-accent">▶</button></div>
      <div className="mt-4 rounded-[4px] border border-warning-line bg-warning-bg px-3 py-2.5 text-[10px] leading-5 text-warning">음성 인식 결과를 확인하고 잘못 인식된 문장을 수정해 주세요. 시간 표시를 눌러 해당 구간을 확인할 수 있습니다.</div>
      <section className="mt-5 flex flex-col gap-2.5">{INITIAL_SEGMENTS.map((segment) => <TranscriptSegment key={segment.time} time={segment.time} initialText={segment.text} />)}</section>
      <p className="mt-5 text-[10px] text-dim">대본 예시 데이터입니다. 영상 재생 및 저장은 API 연동 후 활성화됩니다. 영상 ID: {videoId}</p>
    </main>
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur"><button type="button" onClick={() => router.push(backHref)} className="h-11 w-full cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg md:mx-auto md:block md:max-w-3xl">저장하고 검수 완료</button></div>
  </div>;
};

interface TranscriptSegmentProps { time: string; initialText: string }
const TranscriptSegment = ({ time, initialText }: TranscriptSegmentProps) => <label className="grid grid-cols-[48px_1fr] gap-2.5 rounded-[4px] border border-line bg-panel p-3"><button type="button" className="cursor-pointer self-start pt-2 text-[10px] tabular-nums text-accent">{time}</button><textarea defaultValue={initialText} rows={3} aria-label={`${time} 대본`} className="resize-y bg-transparent text-xs leading-5 text-text-sub outline-none" /></label>;
