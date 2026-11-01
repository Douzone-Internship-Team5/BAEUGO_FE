export interface MeDto {
  id: number;
  email: string;
  name: string;
  accountType: string;
  role: string | null;
  activeMode: string | null;
  roles: string[];
  onboarded: boolean;
  profileImageKey: string | null;
  profileImageUrl: string | null;
  demoPaymentLabel?: string | null;
  demoSettlementLabel?: string | null;
  onboarding: { currentStatus: string; categoryId: number | null; jobCategory: string | null; interestTopicIds: number[]; dailyGoalMinutes: number | null; timeZone: string | null; timeSlots: Array<{ id: number; startTime: string; endTime: string; sortOrder: number }> } | { categoryId: number; jobCategory: string; lectureTopicIds: number[]; bio: string } | null;
}

export interface DemoLabelDto { label: string | null }
export interface DemoLabelRequest { label: string }
export interface ChangePasswordRequest { currentPassword: string; newPassword: string }
export type UpdateProfileImageRequest = { presetId: number } | { file: File };
export interface ProfileImageDto { profileImageKey: string; profileImageUrl: string | null }
