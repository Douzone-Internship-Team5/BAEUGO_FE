"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, Chip } from "@/components/common";
import { getErrorMessage } from "@/_lib/fetcher";
import useCodes from "@/api/learning/useCodes";
import { learningQueryKeys } from "@/api/learning/queryKeys";
import useSaveOnboarding from "@/api/onboarding/useSaveOnboarding";
import { userQueryKeys } from "@/api/user/queryKeys";
import useMe from "@/api/user/useMe";
import type { TimeSlot } from "@/app/onboarding/data/options";
import { TimeSlotList } from "@/app/onboarding/components/learner/TimeSlotList";
import type { LearnerOnboardingRequest } from "@/types/onboarding";
import type { CodesDto } from "@/types/learning";
import type { MeDto } from "@/types/user";
import { LearnerHeader } from "../components/shared/LearnerHeader";

type LearnerOnboarding = Extract<NonNullable<MeDto["onboarding"]>, { interestTopicIds: number[] }>;

export function LearningSettingsPage() {
  const me = useMe();
  const codes = useCodes();
  const onboarding = me.data?.onboarding && "interestTopicIds" in me.data.onboarding ? me.data.onboarding : null;

  return <>
    <LearnerHeader title="학습 설정" backHref="/learner/mypage" />
    <main className="px-5 pb-8 pt-4">
      {me.isPending || codes.isPending
        ? <p className="py-10 text-center text-sm text-muted">학습 설정을 불러오는 중이에요.</p>
        : me.isError || codes.isError
          ? <p role="alert" className="py-10 text-center text-sm text-danger">{getErrorMessage(me.error ?? codes.error, "학습 설정을 불러오지 못했습니다.")}</p>
          : <LearningSettingsForm key={me.dataUpdatedAt} onboarding={onboarding} codes={codes.data} />}
    </main>
  </>;
}

interface FormProps {
  onboarding: LearnerOnboarding | null;
  codes: CodesDto;
}

function LearningSettingsForm({ onboarding, codes }: FormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const save = useSaveOnboarding();
  const [currentStatus, setCurrentStatus] = useState(onboarding?.currentStatus ?? "");
  const [categoryId, setCategoryId] = useState<number | null>(onboarding?.categoryId ?? null);
  const [topicIds, setTopicIds] = useState<number[]>(onboarding?.interestTopicIds ?? []);
  const [goal, setGoal] = useState<number | null>(onboarding?.dailyGoalMinutes ?? null);
  const [slots, setSlots] = useState<TimeSlot[]>(
    (onboarding?.timeSlots ?? []).map((slot) => ({
      id: String(slot.id),
      start: slot.startTime.slice(0, 5),
      end: slot.endTime.slice(0, 5),
      tag: "저장된 시간",
    })),
  );

  const category = codes.jobCategories.find(({ id }) => id === categoryId);
  const topics = codes.topics.filter((topic) => topic.categoryId === categoryId);
  const isValid = Boolean(currentStatus) && Boolean(category) && topicIds.length > 0 && goal !== null;

  const handleCategoryChange = (nextId: number) => {
    if (nextId === categoryId) return;
    setCategoryId(nextId);
    // 주제는 직무에 속해야 하므로 직무를 바꾸면 다시 고른다.
    setTopicIds([]);
  };

  const toggleTopic = (topicId: number) => {
    setTopicIds((current) => current.includes(topicId) ? current.filter((id) => id !== topicId) : [...current, topicId]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid || !category || goal === null) return;
    save.mutate({
      jobCategory: category.code,
      currentStatus: currentStatus as LearnerOnboardingRequest["currentStatus"],
      interestTopicIds: topicIds,
      dailyGoalMinutes: goal,
      timeSlots: slots.map((slot, index) => ({ startTime: `${slot.start}:00`, endTime: `${slot.end}:00`, sortOrder: index + 1 })),
    }, {
      onSuccess: async () => {
        // 하루 목표가 바뀌면 오늘 출석 목표도 다시 계산되므로 학습 데이터도 새로 받는다.
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: userQueryKeys.me() }),
          queryClient.invalidateQueries({ queryKey: learningQueryKeys.all }),
        ]);
        router.push("/learner/mypage");
      },
    });
  };

  return <form onSubmit={handleSubmit} className="space-y-4">
    <SettingsCard title="현재 상황">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="현재 상황">
        {codes.currentStatuses.map(({ code, label }) => <Chip key={code} mode="radio" selected={currentStatus === code} onChange={() => setCurrentStatus(code)}>{label}</Chip>)}
      </div>
    </SettingsCard>
    <SettingsCard title="희망 직무">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="희망 직무">
        {codes.jobCategories.map(({ id, label }) => <Chip key={id} mode="radio" selected={categoryId === id} onChange={() => handleCategoryChange(id)}>{label}</Chip>)}
      </div>
    </SettingsCard>
    <SettingsCard title="관심 주제">
      {topics.length > 0
        ? <div className="flex flex-wrap gap-2" role="group" aria-label="관심 주제">
          {topics.map(({ id, label }) => <Chip key={id} selected={topicIds.includes(id)} onChange={() => toggleTopic(id)}>{label}</Chip>)}
        </div>
        : <p className="text-xs text-muted">희망 직무를 먼저 골라 주세요.</p>}
    </SettingsCard>
    <SettingsCard title="하루 학습 목표">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="하루 학습 목표">
        {codes.dailyGoalMinutes.map((minutes) => <Chip key={minutes} mode="radio" selected={goal === minutes} onChange={() => setGoal(minutes)}>{minutes}분</Chip>)}
      </div>
    </SettingsCard>
    <Card padding="md" className="border border-line bg-panel">
      <TimeSlotList slots={slots} onChange={setSlots} />
    </Card>
    {save.error && <p role="alert" className="text-xs text-danger">{getErrorMessage(save.error, "학습 설정을 저장하지 못했습니다.")}</p>}
    <Button type="submit" fullWidth disabled={!isValid || save.isPending}>{save.isPending ? "저장 중…" : "저장하기"}</Button>
  </form>;
}

function SettingsCard({ title, children }: { title: string; children: ReactNode }) {
  return <Card padding="md" className="border border-line bg-panel"><h2 className="mb-3 text-sm font-medium">{title}</h2>{children}</Card>;
}
