import type { CourseStatus } from "@/constants/colors";

export type InstructorCourseStatus = "DRAFT" | "PUBLISHED" | "EDITING" | "OPERATOR_HIDDEN";
export type InstructorDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface ProcessingInfoDto { completed: number; total: number }
export interface InstructorCourseItemDto {
  courseId: number;
  title: string;
  thumbnailUrl: string | null;
  categoryId: number;
  topicId: number;
  difficulty: InstructorDifficulty;
  priceKrw: number;
  status: InstructorCourseStatus;
  closedReason: string | null;
  publishedAt: string | null;
  sectionCount: number;
  videoCount: number;
  enrollmentCount: number;
  processing: ProcessingInfoDto;
}
export interface InstructorCourseListDto {
  counts: Record<InstructorCourseStatus, number>;
  items: InstructorCourseItemDto[];
  page: number;
  size: number;
  total: number;
}
export interface InstructorVideoDto {
  videoId: number;
  videoType: "OT" | "LESSON";
  title: string;
  durationSeconds: number;
  sortOrder: number;
  sttStatus: string;
  transcriptReviewedAt: string | null;
}
export interface InstructorQuizSummaryDto {
  quizId: number;
  quizType: "UNIT" | "FINAL";
  sectionId: number | null;
  aiStatus: string | null;
  reviewedAt: string | null;
  questionCount: number;
}
export interface InstructorSectionDetailDto {
  sectionId: number;
  title: string;
  sortOrder: number;
  videos: InstructorVideoDto[];
  unitQuiz: InstructorQuizSummaryDto | null;
}
export interface InstructorCourseDetailDto {
  courseId: number;
  status: InstructorCourseStatus;
  closedReason: string | null;
  publishedAt: string | null;
  title: string;
  description: string;
  categoryId: number;
  topicId: number;
  difficulty: InstructorDifficulty;
  priceKrw: number;
  thumbnailUrl: string | null;
  totalLessonDurationSeconds: number;
  otVideo: InstructorVideoDto | null;
  sections: InstructorSectionDetailDto[];
  finalQuiz: InstructorQuizSummaryDto | null;
  publishCheck: { isReady: boolean; missing: string[] };
}
export interface InstructorCourseCreateRequest {
  title: string;
  description: string;
  categoryId: number;
  topicId: number;
  difficulty: InstructorDifficulty;
  priceKrw: number;
}
export type InstructorCourseUpdateRequest = Partial<InstructorCourseCreateRequest>;
export interface InstructorCourseMutationResponse extends InstructorCourseCreateRequest {
  courseId: number;
  status: InstructorCourseStatus;
  thumbnailStorageKey: string | null;
  thumbnailUrl: string | null;
}
export interface InstructorCourseStatusResponse {
  courseId: number;
  status: InstructorCourseStatus;
  publishedAt: string | null;
  closedByUserId: number | null;
  closedAt: string | null;
}
export interface InstructorCourseDeleteResponse { deletedCourseId: number; deleted: boolean }
export interface InstructorSectionDto { sectionId: number; courseId: number; title: string; sortOrder: number; isActive: boolean }
export interface InstructorSectionDeleteDto { sectionId: number; courseId: number; isActive: boolean }
export interface InstructorVideoMutationDto {
  videoId: number;
  courseId: number;
  sectionId: number | null;
  videoType: "OT" | "LESSON";
  title: string;
  durationSeconds: number;
  sortOrder: number;
  sttStatus: string;
  transcriptReviewedAt: string | null;
  isActive: boolean;
}
export interface InstructorVideoDeleteDto { videoId: number; courseId: number; isActive: boolean }
export interface InstructorQuestionDto {
  questionId?: number | null;
  orderNo?: number | null;
  generatedBy?: string | null;
  content: string;
  choices: string[];
  correctChoiceNo: number;
  explanation: string;
}
export interface InstructorQuizDto {
  quizId: number;
  courseId: number;
  sectionId: number | null;
  quizType: "UNIT" | "FINAL";
  aiStatus: string | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  questions: InstructorQuestionDto[];
}
export interface InstructorJobResponse {
  quizId?: number;
  videoId?: number;
  sectionId?: number | null;
  quizType?: "UNIT" | "FINAL";
  aiStatus?: string;
  sttStatus?: string;
  message: string;
}
export interface InstructorScriptSegmentDto {
  seq: number;
  startMs: number;
  endMs: number;
  content: string;
}
export interface InstructorScriptDto {
  videoId: number;
  sttStatus: string;
  transcriptReviewedAt: string | null;
  segments: InstructorScriptSegmentDto[];
}
export interface InstructorStatsDto {
  period: { from: string; to: string; groupBy: string };
  summary: {
    publishedCourseCount: number;
    lessonViews: number;
    newStudents: number;
    expectedRevenue: number;
    quizResponseRate: number | null;
    quizCorrectRate: number | null;
    comparison: {
      publishedCourseDiff: number;
      lessonViewsDiffPercent: number;
      newStudentsDiffPercent: number;
      expectedRevenueDiffPercent: number;
      quizResponseRateDiffPoint: number | null;
      quizCorrectRateDiffPoint: number | null;
    };
  };
  dailyStats: Array<{
    date: string;
    lessonViews: number;
    newStudents: number;
    expectedRevenue: number;
    availableQuizCnt: number;
    firstSubmittedCnt: number;
    firstAnswerCnt: number;
    firstCorrectCnt: number;
  }> | null;
  courseStats: Array<{
    courseId: number;
    title: string;
    lessonViews: number;
    newStudents: number;
    expectedRevenue: number;
    quizResponseRate: number | null;
    quizCorrectRate: number | null;
  }> | null;
}

// 화면에서 쓰는 형태 (API 응답을 변환한 값)
export interface InstructorCourse {
  courseId: number;
  title: string;
  summary: string;
  category: string;
  topic: string;
  status: CourseStatus;
  priceKrw: number;
  enrollmentCount: number;
  sectionCount: number;
  lessonCount: number;
  lessonViews: number;
  estimatedRevenue: number;
  publishedAt: string | null;
  processing: { completed: number; total: number };
}

export interface InstructorSection {
  sectionId: number;
  title: string;
  videos: Array<{ videoId: number; title: string; duration: string; transcriptReviewed: boolean }>;
  quiz: { status: "COMPLETED" | "PROCESSING" | "PENDING"; reviewed: boolean };
}

export interface InstructorCourseDetail extends InstructorCourse {
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  otVideo: { videoId: number; title: string; duration: string; transcriptReviewed: boolean } | null;
  sections: InstructorSection[];
  finalQuiz: { status: "COMPLETED" | "PROCESSING" | "PENDING"; reviewed: boolean };
  publishRequirements: Array<{ label: string; complete: boolean }>;
}
