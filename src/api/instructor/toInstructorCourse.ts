import { JOB_CATEGORIES } from "@/app/onboarding/data/options";
import type { InstructorCourse, InstructorCourseDetail } from "@/app/instructor/data/courses";
import type { InstructorCourseDetailDto, InstructorCourseItemDto, InstructorCourseStatus } from "@/types/instructor";

const getCategory = (categoryId: number) => JOB_CATEGORIES?.find((category) => category.id === categoryId);
const getTopicName = (categoryId: number, topicId: number) => getCategory(categoryId)?.topics.find((topic) => topic.id === topicId)?.name ?? `주제 #${topicId}`;
const formatDuration = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
const isCourseStatus = (status: string): status is InstructorCourseStatus => ["DRAFT", "PUBLISHED", "EDITING", "OPERATOR_HIDDEN"].includes(status);

export const toInstructorCourse = (dto: InstructorCourseItemDto): InstructorCourse => ({
  courseId: dto.courseId,
  title: dto.title,
  summary: "",
  category: getCategory(dto.categoryId)?.name ?? `직무 #${dto.categoryId}`,
  topic: getTopicName(dto.categoryId, dto.topicId),
  status: isCourseStatus(dto.status) ? dto.status : "DRAFT",
  priceKrw: dto.priceKrw,
  enrollmentCount: dto.enrollmentCount,
  sectionCount: dto.sectionCount,
  lessonCount: dto.videoCount,
  lessonViews: 0,
  estimatedRevenue: 0,
  publishedAt: dto.publishedAt,
  processing: dto.processing,
});

const quizSummary = (quiz: InstructorCourseDetailDto["finalQuiz"]) => ({
  status: quiz?.aiStatus === "COMPLETED" ? "COMPLETED" as const : quiz?.aiStatus === "PENDING" || quiz?.aiStatus === "PROCESSING" ? "PROCESSING" as const : "PENDING" as const,
  reviewed: Boolean(quiz?.reviewedAt),
});

export const toInstructorCourseDetail = (dto: InstructorCourseDetailDto): InstructorCourseDetail => {
  const base: InstructorCourse = {
    courseId: dto.courseId,
    title: dto.title,
    summary: dto.description,
    category: getCategory(dto.categoryId)?.name ?? `직무 #${dto.categoryId}`,
    topic: getTopicName(dto.categoryId, dto.topicId),
    status: dto.status,
    priceKrw: dto.priceKrw,
    enrollmentCount: 0,
    sectionCount: dto.sections.length,
    lessonCount: dto.sections.reduce((total, section) => total + section.videos.length, 0),
    lessonViews: 0,
    estimatedRevenue: 0,
    publishedAt: dto.publishedAt,
    processing: { completed: 0, total: 0 },
  };
  const missing = dto.publishCheck.missing;
  const requirements = [
    { code: "OT_VIDEO_MISSING", label: "무료 OT 영상 1개" },
    { code: "SECTION_MISSING", label: "모든 섹션에 학습 영상 포함" },
    { code: "TRANSCRIPT_NOT_REVIEWED", label: "모든 영상 대본 검수 완료" },
    { code: "UNIT_QUIZ", label: "단위 퀴즈 생성 및 검수 완료" },
    { code: "FINAL_QUIZ", label: "종합 퀴즈 검수 완료" },
    { code: "QUESTION_COUNT", label: "퀴즈 문항 및 보기 구성 완료" },
  ];
  return {
    ...base,
    summary: dto.description,
    description: dto.description,
    difficulty: dto.difficulty,
    otVideo: dto.otVideo ? {
      videoId: dto.otVideo.videoId,
      title: dto.otVideo.title,
      duration: formatDuration(dto.otVideo.durationSeconds),
      transcriptReviewed: Boolean(dto.otVideo.transcriptReviewedAt),
    } : null,
    sections: dto.sections.map((section) => ({
      sectionId: section.sectionId,
      title: section.title,
      videos: section.videos.map((video) => ({
        videoId: video.videoId,
        title: video.title,
        duration: formatDuration(video.durationSeconds),
        transcriptReviewed: Boolean(video.transcriptReviewedAt),
      })),
      quiz: quizSummary(section.unitQuiz),
    })),
    finalQuiz: quizSummary(dto.finalQuiz),
    publishRequirements: requirements.map((requirement) => ({
      label: requirement.label,
      complete: !missing.some((code) =>
        requirement.code === "QUESTION_COUNT"
          ? code.startsWith("QUESTION_COUNT") || code.startsWith("CHOICE_COUNT")
          : code.startsWith(requirement.code),
      ),
    })),
  };
};
