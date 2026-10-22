import { ADMIN_USERS } from "./users";
import type { AdminUser } from "./users";

export interface AdminUserDetail {
  user: AdminUser;
  onboarding:
    | {
        kind: "LEARNER";
        currentStatus: string;
        jobCategory: string;
        interestTopics: string[];
      }
    | {
        kind: "INSTRUCTOR";
        jobCategory: string;
        lectureTopics: string[];
        bio: string;
      };
  learningSummary?: {
    inProgressCount: number;
    completedCount: number;
    lastStudiedAt: string;
    attendanceStreak: number;
  };
  instructorSummary?: {
    courseCount: {
      DRAFT: number;
      PUBLISHED: number;
      EDITING: number;
      OPERATOR_HIDDEN: number;
    };
    totalEnrollments: number;
  };
}

export const getAdminUserDetail = (userId: number): AdminUserDetail | undefined => {
  const user = ADMIN_USERS.find((item) => item.userId === userId);
  if (!user) return undefined;

  if (user.role === "LEARNER") {
    return {
      user,
      onboarding: {
        kind: "LEARNER",
        currentStatus: user.userId === 2 ? "재직 중" : "취업 준비 중",
        jobCategory: user.userId === 2 ? "기획·PM" : "데이터 분석",
        interestTopics: user.userId === 2 ? ["문서 작성", "데이터 기반 의사결정"] : ["SQL", "데이터 시각화"],
      },
      learningSummary: {
        inProgressCount: user.userId === 2 ? 3 : 1,
        completedCount: user.userId === 2 ? 1 : 0,
        lastStudiedAt: user.userId === 2 ? "2026-10-15T08:30:00+09:00" : "2026-10-19T19:10:00+09:00",
        attendanceStreak: user.userId === 2 ? 5 : 2,
      },
    };
  }

  return {
    user,
    onboarding: {
      kind: "INSTRUCTOR",
      jobCategory: user.userId === 6 ? "사무 생산성" : "데이터 분석",
      lectureTopics: user.userId === 6 ? ["업무 자동화", "엑셀"] : ["SQL", "데이터 시각화"],
      bio: user.userId === 6
        ? "10년 차 사무 자동화 실무자입니다. 반복 업무를 줄이는 방법을 실제 사례와 함께 알려 드립니다."
        : "데이터 분석 실무 경험을 바탕으로 기초부터 차근차근 안내합니다.",
    },
    instructorSummary: {
      courseCount: {
        DRAFT: user.userId === 6 ? 1 : 0,
        PUBLISHED: user.userId === 6 ? 2 : 1,
        EDITING: 0,
        OPERATOR_HIDDEN: 0,
      },
      totalEnrollments: user.userId === 6 ? 70 : 18,
    },
  };
};
