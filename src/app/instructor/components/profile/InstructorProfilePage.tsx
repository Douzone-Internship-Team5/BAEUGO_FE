"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { InstructorScreenHeader } from "../shared/InstructorScreenHeader";
import { InstructorMobileNav } from "../shared/InstructorMobileNav";

interface Props { className?: string }
interface InstructorProfile {
  name: string;
  categoryId: number;
  jobCategory: string;
  lectureTopicIds: number[];
  bio: string;
}
interface ApiResponse<T> { data: T }
interface MyInfo {
  name: string;
  activeMode: string;
  onboarding: {
    categoryId?: number;
    jobCategory?: string;
    lectureTopicIds?: number[];
    bio?: string;
  } | null;
}
interface CategoryOption { id: number; code: string; label: string }
interface TopicOption { id: number; label: string }

const CATEGORIES: CategoryOption[] = [
  { id: 1, code: "PLANNING_PM", label: "기획·PM" },
  { id: 2, code: "MARKETING", label: "마케팅" },
  { id: 3, code: "DATA_ANALYSIS", label: "데이터 분석" },
  { id: 4, code: "DEV_IT", label: "개발·IT" },
  { id: 5, code: "DESIGN", label: "디자인" },
  { id: 6, code: "OFFICE_PRODUCTIVITY", label: "사무 생산성" },
  { id: 7, code: "CAREER", label: "커리어" },
];

const TOPICS_BY_CATEGORY: Record<number, TopicOption[]> = {
  1: [{ id: 11, label: "문서 작성" }, { id: 12, label: "서비스 기획" }, { id: 13, label: "프로젝트 일정 관리" }],
  2: [{ id: 21, label: "퍼포먼스 마케팅" }, { id: 22, label: "콘텐츠 마케팅" }, { id: 23, label: "SNS 채널 운영" }],
  3: [{ id: 31, label: "엑셀 데이터 분석" }, { id: 32, label: "SQL 기초" }, { id: 33, label: "데이터 시각화" }],
  4: [{ id: 41, label: "프로그래밍 기초" }, { id: 42, label: "웹 개발" }, { id: 43, label: "Git 협업" }],
  5: [{ id: 51, label: "UI·UX 디자인" }, { id: 52, label: "피그마 활용" }, { id: 53, label: "프레젠테이션 디자인" }],
  6: [{ id: 61, label: "업무 자동화" }, { id: 62, label: "엑셀 실무" }, { id: 63, label: "생성형 AI 업무 활용" }],
  7: [{ id: 71, label: "이력서·자기소개서" }, { id: 72, label: "면접 준비" }, { id: 73, label: "비즈니스 커뮤니케이션" }],
};

export const InstructorProfilePage = ({ className = "" }: Props) => {
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const topics = useMemo(() => profile ? TOPICS_BY_CATEGORY[profile.categoryId] ?? [] : [], [profile]);

  useEffect(() => {
    const controller = new AbortController();
    const loadProfile = async () => {
      const accessToken = window.localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("로그인 정보를 찾을 수 없습니다. 다시 로그인해 주세요.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch("/api/v1/users/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("강사 정보를 불러오지 못했습니다.");
        const result = await response.json() as ApiResponse<MyInfo>;
        const data = result.data;
        if (data.activeMode !== "INSTRUCTOR" || !data.onboarding?.categoryId || !data.onboarding.jobCategory) {
          throw new Error("강사 온보딩 정보를 확인할 수 없습니다.");
        }
        setProfile({
          name: data.name ?? "",
          categoryId: data.onboarding.categoryId,
          jobCategory: data.onboarding.jobCategory,
          lectureTopicIds: data.onboarding.lectureTopicIds ?? [],
          bio: data.onboarding.bio ?? "",
        });
        setError("");
      } catch (loadError) {
        if (!controller.signal.aborted) setError(loadError instanceof Error ? loadError.message : "강사 정보를 불러오지 못했습니다.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    void loadProfile();
    return () => controller.abort();
  }, []);

  const updateProfile = (update: Partial<InstructorProfile>) => {
    setProfile((current) => current ? { ...current, ...update } : current);
    setNotice("");
  };

  const handleCategoryChange = (categoryId: number) => {
    const category = CATEGORIES.find((item) => item.id === categoryId);
    if (!category) return;
    updateProfile({ categoryId, jobCategory: category.code, lectureTopicIds: [] });
  };

  const toggleTopic = (topicId: number) => {
    if (!profile) return;
    const lectureTopicIds = profile.lectureTopicIds.includes(topicId)
      ? profile.lectureTopicIds.filter((id) => id !== topicId)
      : [...profile.lectureTopicIds, topicId];
    updateProfile({ lectureTopicIds });
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || profile.lectureTopicIds.length === 0 || profile.bio.trim().length < 5) return;
    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("로그인 정보를 찾을 수 없습니다. 다시 로그인해 주세요.");
      return;
    }
    setIsSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/v1/users/me/onboarding", {
        method: "PUT",
        headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ name: profile.name, categoryId: profile.categoryId, jobCategory: profile.jobCategory, lectureTopicIds: profile.lectureTopicIds, bio: profile.bio }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: { message?: string } } | null;
        throw new Error(result?.error?.message ?? "강사 정보 저장에 실패했습니다.");
      }
      setNotice("강사 정보를 저장했습니다.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "강사 정보 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return <div className={`min-h-dvh pb-24 ${className}`}>
    <InstructorScreenHeader title="강사 정보 수정" />
    <main className="mx-auto max-w-2xl px-4 pt-5 md:px-8 md:pt-8">
      <header className="mb-6"><p className="hidden text-[10px] tracking-[1.4px] text-muted md:block">INSTRUCTOR PROFILE</p><h1 className="mt-1 text-xl font-medium md:mt-2">강사 정보 수정</h1><p className="mt-2 text-xs leading-5 text-muted">강사 소개와 강의 분야를 관리합니다.</p></header>
      {isLoading && <ProfileNotice>강사 정보를 불러오는 중입니다.</ProfileNotice>}
      {error && <ProfileNotice tone="error">{error}</ProfileNotice>}
      {notice && <ProfileNotice tone="success">{notice}</ProfileNotice>}
      {profile && <form onSubmit={handleSave} className="flex flex-col gap-6">
        <ProfileTextField label="이름" value={profile.name} maxLength={50} onChange={(name) => updateProfile({ name })} />
        <fieldset><legend className="mb-2.5 text-xs font-medium">전문 직무 <span className="text-warning">*</span></legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{CATEGORIES.map((category) => <button key={category.id} type="button" aria-pressed={profile.categoryId === category.id} onClick={() => handleCategoryChange(category.id)} className={`cursor-pointer rounded-[4px] border px-3 py-3 text-left text-xs transition ${profile.categoryId === category.id ? "border-accent bg-selected text-accent" : "border-line bg-panel text-text-sub hover:border-line-focus"}`}>{category.label}</button>)}</div></fieldset>
        <fieldset><legend className="mb-2.5 text-xs font-medium">강의 주제 <span className="text-warning">* · 1개 이상</span></legend><div className="flex flex-wrap gap-2">{topics.map((topic) => { const selected = profile.lectureTopicIds.includes(topic.id); return <button key={topic.id} type="button" aria-pressed={selected} onClick={() => toggleTopic(topic.id)} className={`cursor-pointer rounded-full border px-3 py-2 text-xs transition ${selected ? "border-accent bg-selected text-accent" : "border-line bg-panel text-muted hover:border-line-focus"}`}>{topic.label}</button>; })}</div></fieldset>
        <label className="flex flex-col gap-2"><span className="flex justify-between text-xs font-medium"><span>강사 약력 <span className="text-warning">*</span></span><span className="font-normal text-muted">{profile.bio.length}/500</span></span><textarea required minLength={5} maxLength={500} rows={5} value={profile.bio} onChange={(event) => updateProfile({ bio: event.target.value })} placeholder="경력과 강의 경험을 소개해 주세요." className="resize-y rounded-[4px] border border-line bg-panel px-3 py-3 text-xs leading-5 text-text placeholder:text-dim focus:border-line-focus focus:outline-none" /><span className={`text-[10px] ${profile.bio.length > 0 && profile.bio.trim().length < 5 ? "text-danger" : "text-muted"}`}>{profile.bio.length > 0 && profile.bio.trim().length < 5 ? "약력은 5자 이상 입력해 주세요." : "강좌 상세에 표시되는 소개입니다."}</span></label>
        <button type="submit" disabled={isSaving || isLoading || profile.lectureTopicIds.length === 0 || profile.bio.trim().length < 5} className="h-11 cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? "저장 중…" : "변경 사항 저장"}</button>
      </form>}
    </main>
    <InstructorMobileNav active="profile" />
  </div>;
};

interface ProfileTextFieldProps { label: string; value: string; maxLength: number; onChange: (value: string) => void }
const ProfileTextField = ({ label, value, maxLength, onChange }: ProfileTextFieldProps) => <label className="flex flex-col gap-2"><span className="text-xs font-medium">{label} <span className="text-muted">선택</span></span><input value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} className="h-11 rounded-[4px] border border-line bg-panel px-3 text-xs text-text focus:border-line-focus focus:outline-none" /></label>;

interface ProfileNoticeProps { children: ReactNode; tone?: "error" | "success" }
const ProfileNotice = ({ children, tone }: ProfileNoticeProps) => <p role={tone ? "status" : undefined} className={`mb-4 rounded-[4px] border px-3 py-2.5 text-xs leading-5 ${tone === "error" ? "border-danger-line bg-danger-bg text-danger" : tone === "success" ? "border-success-line bg-success-soft-bg text-success" : "border-line bg-panel text-muted"}`}>{children}</p>;
