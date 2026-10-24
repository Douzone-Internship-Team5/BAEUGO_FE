import type { AdminCourseDetail } from "@/app/admin/data/courseDetails";
import type { AdminCourseDetailDto } from "@/types/admin";

export default function toAdminCourseDetail(dto: AdminCourseDetailDto): AdminCourseDetail {
  const mapVideo = (video: NonNullable<AdminCourseDetailDto["otVideo"]>) => ({
    videoId: video.videoId,
    videoType: video.videoType,
    title: video.title,
    durationSeconds: video.durationSeconds,
    sortOrder: video.sortOrder,
    videoUrl: video.videoUrl,
    sttStatus: video.sttStatus as "COMPLETED" | "PROCESSING" | "FAILED",
    transcriptReviewedAt: video.transcriptReviewedAt,
    segments: video.segments.map(({ id, seq, startMs, endMs, content }) => ({ id, seq, startMs, endMs, content })),
  });
  const mapQuiz = (quiz: NonNullable<AdminCourseDetailDto["finalQuiz"]>) => ({
    quizId: quiz.quizId,
    quizType: quiz.quizType,
    aiStatus: quiz.aiStatus,
    reviewedBy: quiz.reviewedBy,
    reviewedAt: quiz.reviewedAt,
    questions: quiz.questions,
  });

  return {
    course: {
      courseId: dto.courseId,
      title: dto.title,
      instructorName: dto.instructor.name,
      categoryId: dto.categoryId,
      jobCategory: dto.categoryName,
      status: dto.status,
      priceKrw: dto.priceKrw,
      enrollmentCount: dto.enrollmentCount,
      publishedAt: dto.publishedAt ?? "",
      closedReason: dto.closedReason ?? undefined,
    },
    description: dto.description,
    topicName: dto.topicName,
    difficulty: dto.difficulty,
    instructor: { id: dto.instructor.id, name: dto.instructor.name, email: dto.instructor.email, bio: dto.instructor.bio ?? "등록된 약력이 없습니다." },
    totalLessonDurationSeconds: dto.totalLessonDurationSeconds,
    totalLessonCount: dto.totalLessonCount,
    otVideo: dto.otVideo ? mapVideo(dto.otVideo) : null,
    sections: dto.sections.map((section) => ({
      sectionId: section.sectionId,
      title: section.title,
      sortOrder: section.sortOrder,
      videos: section.videos.map(mapVideo),
      unitQuiz: section.unitQuiz ? mapQuiz(section.unitQuiz) : null,
    })),
    finalQuiz: dto.finalQuiz ? mapQuiz(dto.finalQuiz) : null,
  };
}
