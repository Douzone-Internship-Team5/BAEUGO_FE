"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/_lib/fetcher";
import useCreateInstructorCourse from "@/api/instructor/useCreateInstructorCourse";
import { JOB_CATEGORIES } from "@/app/onboarding/data/options";
import type { InstructorDifficulty } from "@/types/instructor";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";

interface Props { className?: string }

const DIFFICULTIES: Array<{ value: InstructorDifficulty; label: string }> = [
  { value: "BEGINNER", label: "입문" },
  { value: "INTERMEDIATE", label: "중급" },
  { value: "ADVANCED", label: "고급" },
];

export const InstructorCourseCreatePage = ({ className = "" }: Props) => {
  const router = useRouter();
  const createMutation = useCreateInstructorCourse();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [difficulty, setDifficulty] = useState<InstructorDifficulty>("BEGINNER");
  const [priceKrw, setPriceKrw] = useState("0");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const category = JOB_CATEGORIES.find((item) => String(item.id) === categoryId);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryId || !topicId || createMutation.isPending) return;
    try {
      const result = await createMutation.mutateAsync({
        body: {
          title: title.trim(),
          description: description.trim(),
          categoryId: Number(categoryId),
          topicId: Number(topicId),
          difficulty,
          priceKrw: Number(priceKrw),
        },
        thumbnail,
      });
      router.push(`/instructor/courses/${result.courseId}`);
    } catch {
      // The mutation error is shown next to the form.
    }
  };

  const errorMessage = createMutation.error instanceof ApiError
    ? createMutation.error.message
    : createMutation.error?.message;

  return <div className={`min-h-dvh pb-24 ${className}`}>
    <InstructorScreenHeader title="새 강좌 · 기본 정보" />
    <main className="mx-auto max-w-2xl px-4 pt-5 md:px-8 md:pt-8">
      <p className="text-sm leading-6 text-text-sub">강좌 기본 정보를 입력해 주세요.<br />나중에 강좌 편집 화면에서 수정할 수 있어요.</p>
      <form id="create-instructor-course" className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
        <label className="flex cursor-pointer flex-col gap-2"><span className="text-xs font-medium">강좌 썸네일 <span className="font-normal text-muted">선택</span></span><span className="flex aspect-video max-h-56 items-center justify-center rounded-[4px] border border-dashed border-line-strong bg-panel text-xs text-muted">{thumbnail ? thumbnail.name : <>＋ 이미지 추가 <span className="ml-1 text-[10px]">16:9</span></>}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setThumbnail(event.target.files?.[0] ?? null)} className="sr-only" /></label>
        <Field label="강좌명" required placeholder="예: 실무 보고서, 한 장으로 설득하기" maxLength={200} value={title} onChange={setTitle} />
        <label className="flex flex-col gap-2 text-xs font-medium">강좌 소개 <textarea required value={description} onChange={(event) => setDescription(event.target.value)} rows={4} maxLength={2000} placeholder="강좌에서 배우게 될 내용을 소개해 주세요." className="resize-y rounded-[4px] border border-line bg-panel px-3 py-3 text-xs font-normal text-text placeholder:text-dim focus:border-line-focus focus:outline-none" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-2 text-xs font-medium">직무<select required value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setTopicId(""); }} className="h-11 rounded-[4px] border border-line bg-panel px-2 text-xs font-normal text-text-sub"><option value="">직무 선택</option>{JOB_CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label className="flex flex-col gap-2 text-xs font-medium">주제<select required value={topicId} onChange={(event) => setTopicId(event.target.value)} disabled={!category} className="h-11 rounded-[4px] border border-line bg-panel px-2 text-xs font-normal text-text-sub disabled:opacity-50"><option value="">주제 선택</option>{category?.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label>
        </div>
        <fieldset><legend className="mb-2 text-xs font-medium">난이도</legend><div className="grid grid-cols-3 gap-2">{DIFFICULTIES.map((item) => <button key={item.value} type="button" aria-pressed={difficulty === item.value} onClick={() => setDifficulty(item.value)} className={`cursor-pointer rounded-[4px] border py-2.5 text-xs ${difficulty === item.value ? "border-accent bg-selected text-accent" : "border-line text-muted"}`}>{item.label}</button>)}</div></fieldset>
        <label className="flex flex-col gap-2 text-xs font-medium">판매 가격 <span className="flex items-center rounded-[4px] border border-line bg-panel px-3"><input type="number" min="0" max="100000000" required value={priceKrw} onChange={(event) => setPriceKrw(event.target.value)} className="h-11 w-full bg-transparent text-xs font-normal outline-none" /><span className="text-xs text-muted">원</span></span></label>
        {errorMessage && <p role="alert" className="rounded-[4px] border border-danger-line bg-danger-bg p-3 text-xs leading-5 text-danger">{errorMessage}</p>}
      </form>
    </main>
    <div className="fixed inset-x-0 bottom-[58px] z-20 border-t border-line bg-bg/95 p-3 backdrop-blur"><button type="submit" form="create-instructor-course" disabled={createMutation.isPending || !title.trim() || !description.trim() || !categoryId || !topicId} className="h-11 w-full cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50 md:mx-auto md:block md:max-w-2xl">{createMutation.isPending ? "저장 중…" : "저장하고 커리큘럼 만들기"}</button></div>
    <InstructorMobileNav active="new" />
  </div>;
};

interface FieldProps { label: string; required?: boolean; placeholder: string; maxLength?: number; value: string; onChange: (value: string) => void }
const Field = ({ label, required, placeholder, maxLength, value, onChange }: FieldProps) => <label className="flex flex-col gap-2 text-xs font-medium">{label}{required && <span className="ml-1 text-warning">*</span>}<input required={required} maxLength={maxLength} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 rounded-[4px] border border-line bg-panel px-3 text-xs font-normal placeholder:text-dim focus:border-line-focus focus:outline-none" /></label>;
