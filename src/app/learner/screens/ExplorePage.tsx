"use client";

import { useState } from "react";
import { Chip } from "@/components/common";
import useCourseSearch from "@/api/learning/useCourseSearch";
import useCodes from "@/api/learning/useCodes";
import { BrandHeader } from "../components/shared/LearnerHeader";
import { CourseTile } from "../components/shared/LearnerUI";
const difficultyLabel: Record<string, string> = { BEGINNER: "초급", INTERMEDIATE: "중급", ADVANCED: "고급" };

export function ExplorePage() {
  const [query, setQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [topicId, setTopicId] = useState<number | undefined>();
  const [sort, setSort] = useState("추천순");
  const codes = useCodes();
  const result = useCourseSearch({ q: query || undefined, categoryId, topicId, price: freeOnly ? "free" : undefined, sort: ({ "추천순": "recommended", "인기순": "popular", "최신순": "latest", "난이도순": "difficulty" } as const)[sort] });
  const courses = result.data?.items ?? [];
  return <>
    <BrandHeader />
    <main className="px-5 pb-8">
      <p className="text-[10px] tracking-[2px] text-muted">EXPLORE</p><h1 className="mt-2 text-[23px] font-medium leading-8">어떤 걸<br />배워 볼까요?</h1>
      <label className="mt-5 flex h-11 items-center gap-2 rounded-[4px] border border-line bg-panel px-3 text-muted"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="강좌명 또는 소개 검색" className="min-w-0 flex-1 bg-transparent text-xs text-text outline-none" /></label>
      <div className="mt-4 flex gap-2 overflow-x-auto">{(codes.data?.jobCategories ?? []).map((category) => <Chip key={category.id} selected={categoryId === category.id} mode="radio" onChange={() => { setCategoryId(categoryId === category.id ? undefined : category.id); setTopicId(undefined); }} className="h-8 whitespace-nowrap px-3 text-[11px]">{category.name}</Chip>)}</div>
      {categoryId && <div className="mt-2 flex gap-2 overflow-x-auto">{(codes.data?.topics ?? []).filter((topic) => topic.categoryId === categoryId).map((topic) => <Chip key={topic.id} selected={topicId === topic.id} mode="radio" onChange={() => setTopicId(topicId === topic.id ? undefined : topic.id)} className="h-8 whitespace-nowrap px-3 text-[11px]">{topic.name}</Chip>)}</div>}
      <div className="mt-5 flex items-center justify-between border-b border-line pb-4"><span className="text-xs font-medium">필터</span><label className="flex items-center gap-2 text-[11px] text-muted"><input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} className="accent-accent" />무료만</label></div>
      <div className="flex items-center justify-between py-3"><span className="text-[11px] text-muted">강좌 {result.data?.total ?? 0}개</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent text-[11px] text-text-sub outline-none" aria-label="정렬"><option>추천순</option><option>인기순</option><option>최신순</option><option>난이도순</option></select></div>
      <section aria-label="강좌 목록" className="space-y-3">{courses.map((item) => <CourseTile key={item.courseId} title={item.title} meta={`${item.category.name} · ${item.topic.name} · ${difficultyLabel[item.difficulty] ?? item.difficulty}`} price={item.isFree ? "무료" : `${item.priceKrw.toLocaleString()}원`} instructor={item.instructorName} stats={`수강생 ${item.enrollmentCount.toLocaleString()}`} href={`/learner/courses/${item.courseId}`} />)}{result.isLoading && <p className="py-10 text-center text-sm text-muted">강좌를 불러오는 중이에요.</p>}{result.isError && <p className="py-10 text-center text-sm text-muted">강좌 목록을 불러오지 못했습니다.</p>}{!result.isLoading && courses.length === 0 && <p className="py-10 text-center text-sm text-muted">검색 결과가 없습니다.</p>}</section>
    </main>
  </>;
}
