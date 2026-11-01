export interface CategorySimpleDto { id: number; code: string; name: string }
export interface TopicSimpleDto { id: number; name: string }
export interface CourseDetailDto {
  courseId: number; status: string; category: CategorySimpleDto; topic: TopicSimpleDto;
  title: string; description: string; difficulty: string; priceKrw: number; isFree: boolean;
  thumbnailStorageKey: string | null; thumbnailUrl: string | null;
  instructor: { id: number; name: string; bio: string | null };
  totalLessonDurationSeconds: number; totalLessonCount: number; estimatedCompletionDays: number;
  otVideo: { videoId: number; title: string; videoStorageKey: string; videoUrl: string | null; durationSeconds: number } | null;
  enrollment: { isEnrolled: boolean; enrollmentId: number | null; status: string | null; progressPercent: number; actionButton: string };
  sections: Array<{ sectionId: number; title: string; sortOrder: number; videos: Array<{ videoId: number; title: string; durationSeconds: number; sortOrder: number; isCompleted: boolean; isLocked: boolean }>; unitQuiz: { quizId: number; isCompleted: boolean; isLocked: boolean } | null }>;
  finalQuiz: { quizId: number; isCompleted: boolean; isLocked: boolean } | null;
}
export interface EnrollRequest { accessSource?: string }
export interface EnrollDto { enrollmentId: number; learnerId: number; courseId: number; accessSource: string; priceSnapshotKrw: number; status: string; enrolledAt: string; firstVideoId: number | null }
export type EnrollmentStatusFilter = "ALL" | "IN_PROGRESS" | "COMPLETED";
export interface MyEnrollmentsDto {
  counts: { all: number; inProgress: number; completed: number };
  enrollments: Array<{ enrollmentId: number; courseId: number; title: string; thumbnailStorageKey: string | null; thumbnailUrl: string | null; status: string; progressPercent: number; unresolvedWrongCount: number; statusMessage: string; participatedQuizCount: number; enrolledAt: string; lastStudiedAt: string | null }>;
}
export interface EnrollmentNextDto { enrollmentId: number; courseId: number; nextItemType: string | null; sectionId: number | null; videoId: number | null; quizId: number | null; lastPositionSeconds: number | null }
export interface VideoDetailDto {
  videoId: number; courseId: number; courseTitle: string; sectionId: number | null; sectionTitle: string | null;
  videoType: string; title: string; videoStorageKey: string; videoUrl: string | null; thumbnailStorageKey: string | null; thumbnailUrl: string | null;
  durationSeconds: number; sortOrder: number; viewCount: number; likeCount: number; isLiked: boolean;
  progress: { watchedSeconds: number; lastPositionSeconds: number; isCompleted: boolean };
  segments: Array<{ id: number; seq: number; startMs: number; endMs: number; content: string }>;
  navigation: { prevVideoId: number | null; nextItemType: string | null; nextItemId: number | null; isNextUnlocked: boolean };
}
export interface VideoViewDto { videoId: number; viewDate: string; isIncremented: boolean; viewCount: number }
export interface VideoViewRequest { playedSeconds: number }
export interface VideoProgressRequest {
  lastPositionSeconds: number; watchedRange: number[];
  activitySession: { sessionKey: string; startedAt: string; endedAt: string; activeSeconds: number };
}
export interface VideoProgressDto { enrollmentId: number; videoId: number; watchedSeconds: number; durationSeconds: number; watchedRatioPercent: number; lastPositionSeconds: number; isCompleted: boolean; completedAt: string | null; remainingSecondsForCompletion: number; todayActiveSeconds: number; todayIsAttended: boolean }
export interface VideoLikeDto { videoId: number; videoType: string; isLiked: boolean; likeCount: number }
export type LikedVideoTypeFilter = "ALL" | "OT" | "LESSON";
export interface MyLikesDto { totalCount: number; likedVideos: Array<{ videoId: number; videoType: string; videoTitle: string; thumbnailStorageKey: string | null; thumbnailUrl: string | null; durationSeconds: number; courseId: number; courseTitle: string }> }
export interface CourseSearchDto { items: Array<{ courseId: number; title: string; thumbnailStorageKey: string | null; thumbnailUrl: string | null; instructorId: number; instructorName: string; category: CategorySimpleDto; topic: TopicSimpleDto; difficulty: string; priceKrw: number; isFree: boolean; enrollmentCount: number }>; page: number; size: number; total: number }
export interface TodayDto { studyDate: string; timeZone: string; goal: { dailyTargetMinutes: number; targetMinutesSnapshot: number; activeSeconds: number; remainingSeconds: number; achievementPercent: number; isAttended: boolean }; currentTimeSlot: { slotId: number; startTime: string; endTime: string; sortOrder: number; isInPreferredSlot: boolean } | null; recommendedShortforms: Array<{ recommendationType: string; videoId: number; videoType: string; title: string; durationSeconds: number; courseId: number; courseTitle: string; thumbnailStorageKey: string | null; thumbnailUrl: string | null; estimatedCompletionDays: number }> }
export interface AttendanceDto { year: number; month: number; streak: { currentStreakDays: number; bestStreakDays: number; monthlyAttendedDays: number }; calendarDays: Array<{ studyDate: string; targetMinutesSnapshot: number; activeSeconds: number; isAttended: boolean }> }
export interface FeedDto { items: Array<{ videoId: number; videoUrl: string; videoStorageKey: string; thumbnailUrl: string | null; thumbnailStorageKey: string | null; title: string; durationSeconds: number; viewCount: number; likeCount: number; isLiked: boolean; course: { courseId: number; title: string; description: string; categoryName: string; difficulty: string; priceKrw: number; isEnrolled: boolean }; instructor: { id: number; name: string; bio: string | null; profileImageUrl: string | null } }>; nextCursor: string | null; hasNext: boolean }
export interface QuizAttemptDto { attemptId: number; quizId: number | null; quizType: string | null; attemptType: string; attemptNo: number; status: string; totalQuestions: number; nextOrderNo: number | null; questions: Array<{ attemptQuestionId: number; questionId: number; orderNo: number; origin: string; content: string; choices: Array<{ choiceNo: number; content: string }> }> }
export interface QuizAnswerRequest { attemptId: number; attemptQuestionId: number; selectedChoiceNo: number; activitySession: { sessionKey: string; startedAt: string; endedAt: string; activeSeconds: number } }
export interface QuizAnswerDto { answerId: number; attemptQuestionId: number; questionId: number; selectedChoiceNo: number; isCorrect: boolean; correctChoiceNo: number; explanation: string; questionRecordStatus: string; attemptStatus: string; nextOrderNo: number | null; hasUnresolvedWrongAfterFinal: boolean; isCourseCompleted: boolean }
export interface QuizNotesDto { counts: { all: number; correct: number; reviewNeeded: number }; quizNotes: Array<{ recordId: number; enrollmentId: number; courseId: number; courseTitle: string; thumbnailStorageKey: string | null; thumbnailUrl: string | null; quizId: number; quizType: string; questionId: number; questionContent: string; status: string; wrongCount: number; lastAnswerId: number; lastAnsweredAt: string; resolvedAt: string | null }> }
export interface CodesDto { jobCategories: Array<{ id: number; code: string; name: string; label: string; sortOrder: number }>; topics: Array<{ id: number; categoryId: number; jobCategory: string; name: string; label: string; sortOrder: number }>; currentStatuses: Array<{ code: string; label: string }>; difficulties: Array<{ code: string; label: string }>; dailyGoalMinutes: number[] }
