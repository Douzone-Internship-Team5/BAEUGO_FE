"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { findJobCategory, getTopicsOfCategory } from "@/_lib/codes";
import useCodes from "@/api/codes/useCodes";
import type { InstructorCourseCreateRequest, InstructorDifficulty } from "@/types/instructor";

export interface CourseInfoValues {
  title: string;
  description: string;
  categoryId: number | null;
  topicId: number | null;
  difficulty: InstructorDifficulty;
  priceKrw: number;
}

interface Props {
  formId: string;
  initial?: CourseInfoValues;
  /** 이미 등록된 썸네일. 새 파일을 고르지 않으면 그대로 둔다. */
  currentThumbnailUrl?: string | null;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (body: InstructorCourseCreateRequest, thumbnail: File | null) => void;
}

/** 강좌 만들기와 강좌 정보 수정이 함께 쓰는 기본 정보 입력 폼. */
export const InstructorCourseInfoForm = ({ formId, initial, currentThumbnailUrl, submitLabel, pendingLabel, isPending, errorMessage, onSubmit }: Props) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ? String(initial.categoryId) : "");
  const [topicId, setTopicId] = useState(initial?.topicId ? String(initial.topicId) : "");
  const [difficulty, setDifficulty] = useState<InstructorDifficulty>(initial?.difficulty ?? "BEGINNER");
  const [priceKrw, setPriceKrw] = useState(String(initial?.priceKrw ?? 0));
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const { data: codes } = useCodes();
  const category = findJobCategory(codes, categoryId ? Number(categoryId) : null);

  // 고른 이미지를 바로 미리 보여 주고, 바꾸거나 화면을 떠나면 임시 URL을 정리한다.
  const previewUrl = useMemo(() => (thumbnail ? URL.createObjectURL(thumbnail) : null), [thumbnail]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  const shownThumbnail = previewUrl || currentThumbnailUrl || null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryId || !topicId || isPending) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      categoryId: Number(categoryId),
      topicId: Number(topicId),
      difficulty,
      priceKrw: Number(priceKrw),
    }, thumbnail);
  };

  return <>
    <form id={formId} className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
      <label className="flex cursor-pointer flex-col gap-2">
        <span className="text-xs font-medium">강좌 썸네일 <span className="font-normal text-muted">선택</span></span>
        <span className="relative flex aspect-video max-h-56 items-center justify-center overflow-hidden rounded-[4px] border border-dashed border-line-strong bg-panel bg-cover bg-center text-xs text-muted" style={shownThumbnail ? { backgroundImage: `url("${shownThumbnail}")` } : undefined}>
          {shownThumbnail ? <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white">{thumbnail ? thumbnail.name : "이미지 바꾸기"}</span> : <>＋ 이미지 추가 <span className="ml-1 text-[10px]">16:9</span></>}
        </span>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setThumbnail(event.target.files?.[0] ?? null)} className="sr-only" />
      </label>
      <Field label="강좌명" required placeholder="예: 실무 보고서, 한 장으로 설득하기" maxLength={200} value={title} onChange={setTitle} />
      <label className="flex flex-col gap-2 text-xs font-medium">강좌 소개 <textarea required value={description} onChange={(event) => setDescription(event.target.value)} rows={4} maxLength={2000} placeholder="강좌에서 배우게 될 내용을 소개해 주세요." className="resize-y rounded-[4px] border border-line bg-panel px-3 py-3 text-xs font-normal text-text placeholder:text-dim focus:border-line-focus focus:outline-none" /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-2 text-xs font-medium">직무<select required value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setTopicId(""); }} className="h-11 rounded-[4px] border border-line bg-panel px-2 text-xs font-normal text-text-sub"><option value="">직무 선택</option>{(codes?.jobCategories ?? []).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label className="flex flex-col gap-2 text-xs font-medium">주제<select required value={topicId} onChange={(event) => setTopicId(event.target.value)} disabled={!category} className="h-11 rounded-[4px] border border-line bg-panel px-2 text-xs font-normal text-text-sub disabled:opacity-50"><option value="">주제 선택</option>{getTopicsOfCategory(codes, category?.id).map((topic) => <option key={topic.id} value={topic.id}>{topic.label}</option>)}</select></label>
      </div>
      <fieldset><legend className="mb-2 text-xs font-medium">난이도</legend><div className="grid grid-cols-3 gap-2">{(codes?.difficulties ?? []).map((item) => <button key={item.code} type="button" aria-pressed={difficulty === item.code} onClick={() => setDifficulty(item.code as InstructorDifficulty)} className={`cursor-pointer rounded-[4px] border py-2.5 text-xs ${difficulty === item.code ? "border-accent bg-selected text-accent" : "border-line text-muted"}`}>{item.label}</button>)}</div></fieldset>
      <label className="flex flex-col gap-2 text-xs font-medium">판매 가격 <span className="flex items-center rounded-[4px] border border-line bg-panel px-3"><input type="number" min="0" max="100000000" required value={priceKrw} onChange={(event) => setPriceKrw(event.target.value)} className="h-11 w-full bg-transparent text-xs font-normal outline-none" /><span className="text-xs text-muted">원</span></span></label>
      {errorMessage && <p role="alert" className="rounded-[4px] border border-danger-line bg-danger-bg p-3 text-xs leading-5 text-danger">{errorMessage}</p>}
    </form>
    <div className="mt-8 flex justify-center pb-6"><button type="submit" form={formId} disabled={isPending || !title.trim() || !description.trim() || !categoryId || !topicId} className="h-11 w-full cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50">{isPending ? pendingLabel : submitLabel}</button></div>
  </>;
};

interface FieldProps { label: string; required?: boolean; placeholder: string; maxLength?: number; value: string; onChange: (value: string) => void }
const Field = ({ label, required, placeholder, maxLength, value, onChange }: FieldProps) => <label className="flex flex-col gap-2 text-xs font-medium"><span>{label}{required && <span className="ml-1 text-warning">*</span>}</span><input required={required} maxLength={maxLength} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 rounded-[4px] border border-line bg-panel px-3 text-xs font-normal placeholder:text-dim focus:border-line-focus focus:outline-none" /></label>;
