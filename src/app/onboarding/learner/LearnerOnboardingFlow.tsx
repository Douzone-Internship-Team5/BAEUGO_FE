"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/_lib/fetcher";
import useSaveOnboarding from "@/api/onboarding/useSaveOnboarding";
import { type TimeSlot } from "../data/options";
import { CURRENT_STATUS_VALUES, getJobCategory, getSelectedTopicIds } from "../data/options";
import { OnboardingComplete } from "../components/shared/OnboardingComplete";
import { OnboardingStepIntro } from "../components/shared/OnboardingStepIntro";
import { OnboardingStepScreen } from "../components/shared/OnboardingStepScreen";
import { LearnerSituationFields } from "../components/learner/LearnerSituationFields";
import { LearnerTopicFields } from "../components/learner/LearnerTopicFields";
import { LearningGoalSelector } from "../components/learner/LearningGoalSelector";
import { TimeSlotList } from "../components/learner/TimeSlotList";

interface Props {
  initialStep?: number;
}

export const LearnerOnboardingFlow = ({ initialStep = 1 }: Props) => {
  const router = useRouter();
  const saveMutation = useSaveOnboarding();
  const [step, setStep] = useState(Math.min(3, Math.max(1, initialStep)));
  const [situation, setSituation] = useState("");
  const [job, setJob] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [goal, setGoal] = useState<number | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: "commute", start: "08:00", end: "09:00", tag: "출근길" },
    { id: "bedtime", start: "21:30", end: "22:30", tag: "자기 전" },
  ]);
  const [completed, setCompleted] = useState(false);

  const toggleTopic = (topic: string) => {
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  };

  const handleJobChange = (value: string) => {
    setJob(value);
    setTopics([]);
  };

  const handleBack = () => {
    if (step === 1) router.push("/onboarding");
    else setStep((current) => current - 1);
  };
  const handleNext = async () => {
    if (step === 1 && (!situation || !job)) return;
    if (step < 3) setStep((current) => current + 1);
    else {
      const category = getJobCategory(job);
      if (!category || goal === null) return;

      try {
        await saveMutation.mutateAsync({
          jobCategory: category.code,
          currentStatus: CURRENT_STATUS_VALUES[situation as keyof typeof CURRENT_STATUS_VALUES],
          interestTopicIds: getSelectedTopicIds(job, topics),
          dailyGoalMinutes: goal,
          timeSlots: slots.map((slot, index) => ({
            startTime: `${slot.start}:00`,
            endTime: `${slot.end}:00`,
            sortOrder: index + 1,
          })),
        });
        setCompleted(true);
      } catch {
        // The shared footer shows the mutation error.
      }
    }
  };

  if (completed) {
    return (
      <OnboardingComplete
        title="수강자 설정을 마쳤어요"
        description={`${job}에 맞춘 주제와 하루 ${goal}분 목표로 시작할 준비가 됐어요.`}
      />
    );
  }

  const buttonLabel = step === 3 ? "배우고 시작하기" : "다음";
  const summary = step === 2 ? `${topics.length}개 선택했어요` : undefined;
  const isStepValid = step !== 1 || (Boolean(situation) && Boolean(job));
  const isTopicStepValid = step !== 2 || topics.length > 0;

  return (
    <OnboardingStepScreen
      roleLabel=""
      currentStep={step}
      totalSteps={3}
      onBack={handleBack}
      onSubmit={handleNext}
      buttonLabel={buttonLabel}
      summary={summary}
      disabled={!isStepValid || !isTopicStepValid || (step === 3 && goal === null)}
      loading={saveMutation.isPending}
      error={saveMutation.error instanceof ApiError ? saveMutation.error.message : saveMutation.error?.message}
    >
      <div className="flex flex-col gap-7">
        {step === 1 && (
          <>
            <OnboardingStepIntro
              step={1}
              title={
                <>
                  지금 어떤{" "}
                  <strong className="font-semibold">상황인가요?</strong>
                </>
              }
              description="상황과 희망 직무에 맞는 강좌부터 보여 드릴게요."
            />
            <LearnerSituationFields
              situation={situation}
              job={job}
              onSituationChange={setSituation}
              onJobChange={handleJobChange}
            />
          </>
        )}
        {step === 2 && (
          <>
            <OnboardingStepIntro
              step={2}
              title={
                <>
                  관심 있는{" "}
                  <strong className="font-semibold">주제를 골라 주세요</strong>
                </>
              }
              description="여러 개 골라도 돼요. 무료 OT 피드를 이 주제로 채워요."
            />
            <LearnerTopicFields
              job={job}
              selectedTopics={topics}
              onToggleTopic={toggleTopic}
            />
          </>
        )}
        {step === 3 && (
          <>
            <OnboardingStepIntro
              step={3}
              title={
                <>
                  하루에
                  <strong className="font-semibold">얼마나 배울까요?</strong>
                </>
              }
              description="목표 시간을 채운 날은 출석으로 기록돼요. 언제든 바꿀 수 있어요."
            />
            <LearningGoalSelector value={goal} onChange={setGoal} />
            <TimeSlotList slots={slots} onChange={setSlots} />
          </>
        )}
      </div>
    </OnboardingStepScreen>
  );
};
