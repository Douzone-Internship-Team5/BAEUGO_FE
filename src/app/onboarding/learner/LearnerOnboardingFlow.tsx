"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEARNING_GOALS, type TimeSlot } from "../data/options";
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

const initialTopics = ["문서 작성", "데이터 기반 의사결정", "업무 자동화"];

export const LearnerOnboardingFlow = ({ initialStep = 1 }: Props) => {
  const router = useRouter();
  const [step, setStep] = useState(Math.min(3, Math.max(1, initialStep)));
  const [situation, setSituation] = useState("재직 중");
  const [job, setJob] = useState("기획·PM");
  const [topics, setTopics] = useState(initialTopics);
  const [goal, setGoal] = useState<number>(LEARNING_GOALS[1]);
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

  const handleBack = () => {
    if (step === 1) router.push("/onboarding");
    else setStep((current) => current - 1);
  };
  const handleNext = () => {
    if (step < 3) setStep((current) => current + 1);
    else setCompleted(true);
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
      disabled={!isStepValid || !isTopicStepValid}
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
              onJobChange={setJob}
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
                  하루에{" "}
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
