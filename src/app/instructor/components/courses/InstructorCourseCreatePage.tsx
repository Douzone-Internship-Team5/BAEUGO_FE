"use client";

import { useState } from "react";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";

interface Props { className?: string }

export const InstructorCourseCreatePage = ({ className = "" }: Props) => {
  const [difficulty, setDifficulty] = useState("입문");
  return <div className={`min-h-dvh pb-24 ${className}`}>
    <InstructorScreenHeader title="새 강좌 · 기본 정보" />
    <main className="mx-auto max-w-2xl px-4 pt-5 md:px-8 md:pt-8">
      <p className="text-sm leading-6 text-text-sub">강좌 기본 정보를 입력해 주세요.<br />나중에 강좌 편집 화면에서 수정할 수 있어요.</p>
      <form className="mt-6 flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
        <label className="flex cursor-pointer flex-col gap-2"><span className="text-xs font-medium">강좌 썸네일 <span className="font-normal text-muted">선택</span></span><span className="flex aspect-video max-h-56 items-center justify-center rounded-[4px] border border-dashed border-line-strong bg-panel text-xs text-muted">＋ 이미지 추가 <span className="ml-1 text-[10px]">16:9</span></span><input type="file" accept="image/*" className="sr-only" /></label>
        <Field label="강좌명" required placeholder="예: 실무 보고서, 한 장으로 설득하기" maxLength={200} />
        <label className="flex flex-col gap-2 text-xs font-medium">강좌 소개 <textarea rows={4} placeholder="강좌에서 배우게 될 내용을 소개해 주세요." className="resize-y rounded-[4px] border border-line bg-panel px-3 py-3 text-xs font-normal text-text placeholder:text-dim focus:border-line-focus focus:outline-none" /></label>
        <div className="grid grid-cols-2 gap-3"><SelectField label="직무" values={["직무 선택", "기획·PM", "데이터 분석", "디자인", "개발"]} /><SelectField label="주제" values={["주제 선택", "문서 작성", "데이터 시각화", "협업·커뮤니케이션", "SQL"]} /></div>
        <fieldset><legend className="mb-2 text-xs font-medium">난이도</legend><div className="grid grid-cols-3 gap-2">{["입문", "중급", "고급"].map((item) => <button key={item} type="button" aria-pressed={difficulty === item} onClick={() => setDifficulty(item)} className={`cursor-pointer rounded-[4px] border py-2.5 text-xs ${difficulty === item ? "border-accent bg-selected text-accent" : "border-line text-muted"}`}>{item}</button>)}</div></fieldset>
        <label className="flex flex-col gap-2 text-xs font-medium">판매 가격 <span className="flex items-center rounded-[4px] border border-line bg-panel px-3"><input type="number" min="0" placeholder="0" className="h-11 w-full bg-transparent text-xs font-normal outline-none" /><span className="text-xs text-muted">원</span></span></label>
      </form>
      <p className="mt-6 text-[10px] leading-5 text-dim">임시 화면입니다. 강좌 생성 API가 연결되면 저장 후 커리큘럼 설정으로 이동합니다.</p>
    </main>
    <div className="fixed inset-x-0 bottom-[58px] z-20 border-t border-line bg-bg/95 p-3 backdrop-blur"><button type="button" disabled className="h-11 w-full cursor-not-allowed rounded-[4px] bg-accent text-xs font-medium text-bg opacity-50 md:mx-auto md:block md:max-w-2xl">저장하고 커리큘럼 만들기</button></div>
    <InstructorMobileNav active="new" />
  </div>;
};

interface FieldProps { label: string; required?: boolean; placeholder: string; maxLength?: number }
const Field = ({ label, required, placeholder, maxLength }: FieldProps) => <label className="flex flex-col gap-2 text-xs font-medium">{label}{required && <span className="ml-1 text-warning">*</span>}<input required={required} maxLength={maxLength} placeholder={placeholder} className="h-11 rounded-[4px] border border-line bg-panel px-3 text-xs font-normal placeholder:text-dim focus:border-line-focus focus:outline-none" /></label>;

interface SelectFieldProps { label: string; values: string[] }
const SelectField = ({ label, values }: SelectFieldProps) => <label className="flex flex-col gap-2 text-xs font-medium">{label}<select defaultValue={values[0]} className="h-11 rounded-[4px] border border-line bg-panel px-2 text-xs font-normal text-text-sub">{values.map((value, index) => <option key={value} value={index ? value : ""}>{value}</option>)}</select></label>;
