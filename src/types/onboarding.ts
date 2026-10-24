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
