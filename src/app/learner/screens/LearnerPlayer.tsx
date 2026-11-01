"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/common";
import { ProgressBar } from "../components/shared/LearnerUI";

const lines = [
  { time: "00:00", text: "좋은 보고서는 읽는 사람이 바로 판단할 수 있도록 구성해야 합니다." },
  { time: "00:48", text: "이번 시간에는 데이터를 목적에 맞게 정리하는 방법을 알아봅니다." },
  { time: "01:36", text: "먼저 필요한 지표를 고르고, 비교 기준과 기간을 명확히 해 주세요." },
  { time: "02:24", text: "표와 그래프는 핵심 메시지를 뒷받침하는 만큼만 사용합니다." },
];

export function LearnerPlayer() {
  const [position, setPosition] = useState(45);
  const [quiet, setQuiet] = useState(false);
  const [completed, setCompleted] = useState(false);
  const pct = Math.min(100, Math.round(position / 2.4));
  return <main className="flex min-h-dvh flex-col bg-bg">
    <header className="flex h-[60px] items-center justify-between px-5"><Link href="/learner/library" aria-label="뒤로" className="text-xl">‹</Link><span className="text-[10px] text-muted">일잘러의 보고서 작성법 · 섹션 1</span><button type="button" onClick={() => setQuiet(!quiet)} className={`text-[10px] ${quiet ? "text-accent" : "text-muted"}`}>{quiet ? "방해금지 켬" : "방해금지"}</button></header>
    <div className="relative flex h-[310px] items-center justify-center bg-[radial-gradient(ellipse_at_center,#303848,#17191d_65%,#101113)]"><button type="button" onClick={() => setPosition((v) => Math.min(v + 12, 240))} aria-label="재생" className="flex size-14 items-center justify-center rounded-full border border-white/20 bg-black/30 text-xl">▶</button><div className="absolute inset-x-5 bottom-4"><p className="mb-2 text-xs">2강. 데이터 정리하기</p><div className="flex items-center gap-3"><input aria-label="재생 위치" type="range" min="0" max="240" value={position} onChange={(e) => setPosition(Number(e.target.value))} className="flex-1 accent-accent"/><span className="text-[10px] tabular-nums">{Math.floor(position / 60)}:{String(position % 60).padStart(2, "0")} / 4:00</span></div></div></div>
    <div className="flex flex-1 flex-col px-5 pb-6 pt-5"><div className="flex items-center justify-between"><h1 className="text-sm font-medium">대본</h1><span className="text-[10px] text-muted">{pct}% 시청</span></div><div className="mt-3 space-y-3">{lines.map((line, index) => <p key={line.time} className={`flex gap-3 text-xs leading-5 ${position >= index * 48 ? "text-text" : "text-muted"}`}><span className="shrink-0 font-mono text-[10px] text-dim">{line.time}</span>{line.text}</p>)}</div><div className="mt-auto pt-6"><ProgressBar value={pct} /><p className="mt-2 text-[10px] text-muted">90%까지 보면 다음 단계(단위 확인 퀴즈)가 열려요</p>{completed || pct >= 90 ? <div className="mt-4 rounded-[4px] border border-success-line bg-success-soft-bg p-4"><p className="text-xs">다 봤어요. 단위 확인 퀴즈가 열렸어요.</p><Link href="/learner/quiz/unit-1" className="mt-3 block"><Button fullWidth>퀴즈 풀기</Button></Link></div> : <Button fullWidth className="mt-4" variant="outline" onClick={() => { setPosition(240); setCompleted(true); }}>다 봤어요</Button>}</div></div>
  </main>;
}
