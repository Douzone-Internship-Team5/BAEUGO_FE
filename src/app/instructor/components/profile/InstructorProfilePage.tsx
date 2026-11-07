"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import api, { ApiError, getErrorMessage } from "@/_lib/fetcher";
import { findJobCategory, getTopicsOfCategory } from "@/_lib/codes";
import useCodes from "@/api/codes/useCodes";
import { useAuthStore } from "@/app/login/store/useAuthStore";
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
interface MyInfo {
  name: string;
  activeMode?: string | null;
  onboarding: {
    categoryId?: number;
    jobCategory?: string;
    lectureTopicIds?: number[];
    bio?: string;
  } | null;
}
export const InstructorProfilePage = ({ className = "" }: Props) => {
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { data: codes } = useCodes();
  const categories = codes?.jobCategories ?? [];
  const topics = getTopicsOfCategory(codes, profile?.categoryId);

  useEffect(() => {
    const controller = new AbortController();
    const loadProfile = async () => {
      try {
        const response = await api.get<MyInfo>({ endpoint: "/users/me", signal: controller.signal });
        const data = response?.data;
        const activeMode = data?.activeMode ?? useAuthStore.getState().user?.activeMode;
        if (activeMode && activeMode !== "INSTRUCTOR") {
          throw new Error("강사 모드에서만 강사 정보를 수정할 수 있습니다.");
        }
        if (!data) throw new Error("강사 정보를 불러오지 못했습니다.");
        setProfile({
          name: data.name ?? "",
          categoryId: data.onboarding?.categoryId ?? 0,
          jobCategory: data.onboarding?.jobCategory ?? "",
          lectureTopicIds: data.onboarding?.lectureTopicIds ?? [],
          bio: data.onboarding?.bio ?? "",
        });
        setError("");
      } catch (loadError) {
        if (controller.signal.aborted) return;
        // 내 정보 조회(A-5)가 아직 없는 백엔드에서도 새로 입력해 저장할 수 있게 빈 양식을 보여준다.
        if (loadError instanceof ApiError && loadError.status === 404) {
          setProfile({ name: useAuthStore.getState().user?.name ?? "", categoryId: 0, jobCategory: "", lectureTopicIds: [], bio: "" });
          setNotice("");
          return;
        }
        setError(getErrorMessage(loadError, "강사 정보를 불러오지 못했습니다."));
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
    const category = findJobCategory(codes, categoryId);
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
    if (!profile || !profile.categoryId || profile.lectureTopicIds.length === 0 || profile.bio.trim().length < 5) return;
    setIsSaving(true);
    setError("");
    setNotice("");
    try {
      await api.put({
        endpoint: "/users/me/onboarding",
        body: {
          ...(profile.name.trim() ? { name: profile.name.trim() } : {}),
          categoryId: profile.categoryId,
          lectureTopicIds: profile.lectureTopicIds,
          bio: profile.bio.trim(),
        },
      });
      setNotice("강사 정보를 저장했습니다.");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "강사 정보 저장에 실패했습니다."));
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
        <fieldset><legend className="mb-2.5 text-xs font-medium">전문 직무 <span className="text-warning">*</span></legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{categories.map((category) => <button key={category.id} type="button" aria-pressed={profile.categoryId === category.id} onClick={() => handleCategoryChange(category.id)} className={`cursor-pointer rounded-[4px] border px-3 py-3 text-left text-xs transition ${profile.categoryId === category.id ? "border-accent bg-selected text-accent" : "border-line bg-panel text-text-sub hover:border-line-focus"}`}>{category.label}</button>)}</div></fieldset>
        <fieldset><legend className="mb-2.5 text-xs font-medium">강의 주제 <span className="text-warning">* · 1개 이상</span></legend><div className="flex flex-wrap gap-2">{topics.map((topic) => { const selected = profile.lectureTopicIds.includes(topic.id); return <button key={topic.id} type="button" aria-pressed={selected} onClick={() => toggleTopic(topic.id)} className={`cursor-pointer rounded-full border px-3 py-2 text-xs transition ${selected ? "border-accent bg-selected text-accent" : "border-line bg-panel text-muted hover:border-line-focus"}`}>{topic.label}</button>; })}</div></fieldset>
        <label className="flex flex-col gap-2"><span className="flex justify-between text-xs font-medium"><span>강사 약력 <span className="text-warning">*</span></span><span className="font-normal text-muted">{profile.bio.length}/500</span></span><textarea required minLength={5} maxLength={500} rows={5} value={profile.bio} onChange={(event) => updateProfile({ bio: event.target.value })} placeholder="경력과 강의 경험을 소개해 주세요." className="resize-y rounded-[4px] border border-line bg-panel px-3 py-3 text-xs leading-5 text-text placeholder:text-dim focus:border-line-focus focus:outline-none" /><span className={`text-[10px] ${profile.bio.length > 0 && profile.bio.trim().length < 5 ? "text-danger" : "text-muted"}`}>{profile.bio.length > 0 && profile.bio.trim().length < 5 ? "약력은 5자 이상 입력해 주세요." : "강좌 상세에 표시되는 소개입니다."}</span></label>
        <button type="submit" disabled={isSaving || isLoading || !profile.categoryId || profile.lectureTopicIds.length === 0 || profile.bio.trim().length < 5} className="h-11 cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? "저장 중…" : "변경 사항 저장"}</button>
      </form>}
      <Link href="/instructor/account" className="mt-8 flex items-center justify-between border-t border-line pt-6 text-sm">
        <span><span className="font-medium">계정 설정</span><span className="mt-1 block text-[10px] text-muted">프로필 사진 · 비밀번호 · 정산 계좌</span></span>
        <span aria-hidden="true" className="text-muted">›</span>
      </Link>
    </main>
    <InstructorMobileNav active="profile" />
  </div>;
};

interface ProfileTextFieldProps { label: string; value: string; maxLength: number; onChange: (value: string) => void }
const ProfileTextField = ({ label, value, maxLength, onChange }: ProfileTextFieldProps) => <label className="flex flex-col gap-2"><span className="text-xs font-medium">{label} <span className="text-muted">선택</span></span><input value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} className="h-11 rounded-[4px] border border-line bg-panel px-3 text-xs text-text focus:border-line-focus focus:outline-none" /></label>;

interface ProfileNoticeProps { children: ReactNode; tone?: "error" | "success" }
const ProfileNotice = ({ children, tone }: ProfileNoticeProps) => <p role={tone ? "status" : undefined} className={`mb-4 rounded-[4px] border px-3 py-2.5 text-xs leading-5 ${tone === "error" ? "border-danger-line bg-danger-bg text-danger" : tone === "success" ? "border-success-line bg-success-soft-bg text-success" : "border-line bg-panel text-muted"}`}>{children}</p>;
