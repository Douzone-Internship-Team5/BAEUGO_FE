"use client";

import { useMemo, useState } from "react";
import { Button, Chip } from "@/components/common";
import { BrandHeader } from "../components/shared/LearnerHeader";
import { CourseTile } from "../components/shared/LearnerUI";
import { catalog } from "../data";

const topics = ["문서 작성", "업무 자동화", "기획·PM", "데이터", "커뮤니케이션"];

export function ExplorePage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("문서 작성");
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState("추천순");
  const courses = useMemo(() => catalog.filter((item) => (item.title + item.topic + item.category).toLowerCase().includes(query.toLowerCase()) && (!freeOnly || item.price === "무료")), [query, freeOnly]);
  return <>
    <BrandHeader />
    <main className="px-5 pb-8">
      <p className="text-[10px] tracking-[2px] text-muted">EXPLORE</p><h1 className="mt-2 text-[23px] font-medium leading-8">어떤 걸<br />배워 볼까요?</h1>
      <label className="mt-5 flex h-11 items-center gap-2 rounded-[4px] border border-line bg-panel px-3 text-muted"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="강좌명 또는 소개 검색" className="min-w-0 flex-1 bg-transparent text-xs text-text outline-none" /></label>
      <div className="mt-4 flex flex-wrap gap-2">{topics.map((topic) => <Chip key={topic} selected={selected === topic} mode="radio" onChange={() => setSelected(topic)} className="h-8 px-3 text-[11px]">{topic}</Chip>)}</div>
      <div className="mt-5 flex items-center justify-between border-b border-line pb-4"><span className="text-xs font-medium">필터</span><label className="flex items-center gap-2 text-[11px] text-muted"><input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} className="accent-accent" />무료만</label></div>
      <div className="flex items-center justify-between py-3"><span className="text-[11px] text-muted">관심 주제 · {selected} 기준 추천이에요</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent text-[11px] text-text-sub outline-none" aria-label="정렬"><option>추천순</option><option>인기순</option><option>최신순</option><option>난이도순</option></select></div>
      <section aria-label="강좌 목록" className="space-y-3">{courses.map((item) => <CourseTile key={item.title} title={item.title} meta={`${item.category} · ${item.topic}`} price={item.price} />)}{courses.length === 0 && <p className="py-10 text-center text-sm text-muted">검색 결과가 없습니다.</p>}</section>
    </main>
  </>;
}
