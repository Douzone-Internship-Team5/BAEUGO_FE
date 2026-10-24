"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingComplete } from "../components/shared/OnboardingComplete";
import { OnboardingStepIntro } from "../components/shared/OnboardingStepIntro";
import { OnboardingStepScreen } from "../components/shared/OnboardingStepScreen";
import { InstructorBioField } from "../components/instructor/InstructorBioField";
import { InstructorBioPreview } from "../components/instructor/InstructorBioPreview";
import { InstructorExpertiseFields } from "../components/instructor/InstructorExpertiseFields";

interface Props {
  initialStep?: number;
}

export const InstructorOnboardingFlow = ({ initialStep = 1 }: Props) => {
  const router = useRouter();
  const [step, setStep] = useState(Math.min(2, Math.max(1, initialStep)));
  const [job, setJob] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [bio, setBio] = useState("");
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
    else setStep(1);
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else setCompleted(true);
  };

  if (completed) {
    return (
      <OnboardingComplete
        title="강사 설정을 마쳤어요"
        description={`${job} · ${topics.join(" · ")} 분야로 시작할 준비가 됐어요.`}
        href="/instructor"
        actionLabel="강사 페이지로 이동"
      />
    );
  }

  return (
    <OnboardingStepScreen
      roleLabel="강사"
      currentStep={step}
      totalSteps={2}
      onBack={handleBack}
      onSubmit={handleNext}
      buttonLabel={step === 2 ? "강사로 시작하기" : "다음"}
      disabled={step === 1 ? topics.length === 0 : bio.trim().length < 5}
    >
      <div className="flex flex-col gap-7">
        {step === 1 && (
          <>
            <OnboardingStepIntro
              step={1}
              title={
                <>
                  어떤 직무를{" "}
                  <strong className="font-semibold">가르치나요?</strong>
                </>
              }
              description="강좌를 등록할 때 이 직무와 주제가 기본으로 채워져요."
            />
            <InstructorExpertiseFields
              job={job}
              topics={topics}
              onJobChange={setJob}
              onToggleTopic={toggleTopic}
            />
          </>
        )}
        {step === 2 && (
          <>
            <OnboardingStepIntro
              step={2}
              title={
                <>
                  수강자에게{" "}
                  <strong className="font-semibold">나를 소개해 주세요</strong>
                </>
              }
              description="강좌 상세에 그대로 보여요. 검수 없이 바로 반영돼요."
            />
            <InstructorBioField value={bio} onChange={setBio} />
            <InstructorBioPreview job={job} topics={topics} bio={bio} />
          </>
        )}
      </div>
    </OnboardingStepScreen>
  );
};
