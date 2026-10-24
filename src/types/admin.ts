export type AdminRole = "LEARNER" | "INSTRUCTOR";
export type AdminCourseStatus = "PUBLISHED" | "EDITING" | "OPERATOR_HIDDEN";

export interface AdminPage<TItem> {
  items: TItem[];
  page: number;
  size: number;
  total: number;
}

export interface AdminUserItemDto {
  userId: number;
  email: string;
  name: string;
  accountType: string;
  role: AdminRole | null;
  activeMode: AdminRole | null;
  isActive: boolean;
}

export interface AdminUsersParams {
  q?: string;
  role?: AdminRole;
  page: number;
  size: number;
}

export interface AdminCourseItemDto {
  courseId: number;
  title: string;
  instructorId: number;
  instructorName: string;
  categoryId: number;
  jobCategory: string;
  status: AdminCourseStatus;
  priceKrw: number;
  enrollmentCount: number;
  publishedAt: string | null;
  closedByUserId: number | null;
  closedAt: string | null;
  closedReason: string | null;
}

export interface AdminCoursesParams {
  q?: string;
  status?: AdminCourseStatus;
  sort: "recent" | "enrollments";
  categoryId?: number;
  jobCategory?: string;
  page: number;
  size: number;
}

export interface AdminUserDetailDto extends AdminUserItemDto {
  onboarding: {
    currentStatus?: string;
    categoryId?: number | null;
    jobCategory?: string | null;
    interestTopicIds?: number[];
    lectureTopicIds?: number[];
    bio?: string;
  } | null;
  learningSummary: {
    inProgressCount: number;
    completedCount: number;
    lastStudiedAt: string | null;
    attendanceStreak: number;
  };
  instructorSummary: {
    courseCount: Record<"DRAFT" | "PUBLISHED" | "EDITING" | "OPERATOR_HIDDEN", number>;
    totalEnrollments: number;
  };
}

export interface AdminCourseVideoDto {
  videoId: number;
  videoType: "OT" | "LESSON";
  title: string;
  durationSeconds: number;
  sortOrder: number;
  videoStorageKey: string;
  videoUrl: string;
  thumbnailStorageKey: string | null;
  thumbnailUrl: string | null;
  sttStatus: string;
  transcriptReviewedAt: string | null;
  segments: Array<{ id: number; seq: number; startMs: number; endMs: number; content: string }>;
}

export interface AdminQuizDto {
  quizId: number;
  quizType: "UNIT" | "FINAL";
  sectionId: number | null;
  aiStatus: string | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  questions: Array<{
    questionId: number;
    orderNo: number;
    generatedBy: "AI" | "INSTRUCTOR";
    content: string;
    choices: string[];
    correctChoiceNo: number;
    explanation: string;
  }>;
}

export interface AdminCourseDetailDto {
  courseId: number;
  status: AdminCourseStatus;
  title: string;
  description: string;
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  topicId: number;
  topicName: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  priceKrw: number;
  thumbnailStorageKey: string | null;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  closedAt: string | null;
  closedReason: string | null;
  closedByUserId: number | null;
  instructor: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    profileImageKey: string | null;
    profileImageUrl: string | null;
  };
  totalLessonDurationSeconds: number;
  totalLessonCount: number;
  enrollmentCount: number;
  otVideo: AdminCourseVideoDto | null;
  sections: Array<{
    sectionId: number;
    title: string;
    sortOrder: number;
    videos: AdminCourseVideoDto[];
    unitQuiz: AdminQuizDto | null;
  }>;
  finalQuiz: AdminQuizDto | null;
}

export interface AdminUnpublishRequest {
  reason: string;
}

export interface AdminUnpublishResponse {
  courseId: number;
  status: AdminCourseStatus;
  closedByUserId: number;
  closedReason: string;
  closedAt: string;
}
