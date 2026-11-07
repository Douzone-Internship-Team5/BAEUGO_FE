export type OnboardingRole = "LEARNER" | "INSTRUCTOR";

export interface SelectOnboardingRoleResponse {
  role: OnboardingRole;
  activeMode: OnboardingRole;
  roles: OnboardingRole[];
  onboarded: boolean;
}

export interface OnboardingResponse {
  activeMode: OnboardingRole;
  onboarded: boolean;
  onboarding: Record<string, unknown> | null;
}

export type LearnerOnboardingRequest = {
  /** 빼고 보내면 기존 이름을 유지한다. 1~50자 */
  name?: string;
  jobCategory: string;
  currentStatus: "JOB_SEEKER" | "EMPLOYED" | "CAREER_CHANGE";
  interestTopicIds: number[];
  dailyGoalMinutes: number;
  timeSlots: Array<{
    startTime: string;
    endTime: string;
    sortOrder: number;
  }>;
};

export type InstructorOnboardingRequest = {
  jobCategory: string;
  lectureTopicIds: number[];
  bio: string;
};

export type SaveOnboardingRequest =
  | LearnerOnboardingRequest
  | InstructorOnboardingRequest;

// 화면에서 쓰는 형태 (API 응답을 변환한 값)
export type TimeSlot = {
  id: string;
  start: string;
  end: string;
  tag: string;
};
