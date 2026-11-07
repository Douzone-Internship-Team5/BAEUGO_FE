import type { AdminUserDetail } from "@/types/admin";
import { getJobCategoryLabel, getTopicLabel } from "@/_lib/codes";
import type { CodesDto } from "@/types/codes";
import type { AdminUserDetailDto } from "@/types/admin";

export default function toAdminUserDetail(dto: AdminUserDetailDto, codes?: CodesDto): AdminUserDetail {
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
          currentStatus: codes?.currentStatuses.find(({ code }) => code === dto.onboarding?.currentStatus)?.label ?? dto.onboarding.currentStatus ?? "미설정",
          jobCategory: getJobCategoryLabel(codes, dto.onboarding.categoryId, dto.onboarding.jobCategory) ?? (dto.onboarding.categoryId ? `직무 #${dto.onboarding.categoryId}` : "미설정"),
          interestTopics: (dto.onboarding.interestTopicIds ?? []).map((id) => getTopicLabel(codes, id)),
        }
      : {
          kind: "INSTRUCTOR" as const,
          jobCategory: getJobCategoryLabel(codes, dto.onboarding.categoryId, dto.onboarding.jobCategory) ?? (dto.onboarding.categoryId ? `직무 #${dto.onboarding.categoryId}` : "미설정"),
          lectureTopics: (dto.onboarding.lectureTopicIds ?? []).map((id) => getTopicLabel(codes, id)),
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
