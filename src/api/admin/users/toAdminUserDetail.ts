import type { AdminUserDetail } from "@/app/admin/data/userDetails";
import type { AdminUserDetailDto } from "@/types/admin";

export default function toAdminUserDetail(dto: AdminUserDetailDto): AdminUserDetail {
  const role = dto.role ?? dto.activeMode ?? "LEARNER";
  const user = {
    userId: dto.userId,
    email: dto.email,
    name: dto.name,
    accountType: "MEMBER" as const,
    role,
    activeMode: dto.activeMode ?? role,
    isActive: dto.isActive,
  };
  const onboarding = dto.onboarding
    ? role === "LEARNER"
      ? {
          kind: "LEARNER" as const,
          currentStatus: dto.onboarding.currentStatus ?? "미설정",
          jobCategory: dto.onboarding.jobCategory ?? (dto.onboarding.categoryId ? `직무 #${dto.onboarding.categoryId}` : "미설정"),
          interestTopics: (dto.onboarding.interestTopicIds ?? []).map((id) => `주제 #${id}`),
        }
      : {
          kind: "INSTRUCTOR" as const,
          jobCategory: dto.onboarding.jobCategory ?? (dto.onboarding.categoryId ? `직무 #${dto.onboarding.categoryId}` : "미설정"),
          lectureTopics: (dto.onboarding.lectureTopicIds ?? []).map((id) => `주제 #${id}`),
          bio: dto.onboarding.bio ?? "등록된 약력이 없습니다.",
        }
    : null;

  return {
    user,
    onboarding,
    learningSummary: dto.learningSummary
      ? { ...dto.learningSummary, lastStudiedAt: dto.learningSummary.lastStudiedAt ?? "" }
      : undefined,
    instructorSummary: dto.instructorSummary,
  };
}
