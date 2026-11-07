import type { EnrollmentNextDto } from "@/types/learning";

/** 단위 퀴즈를 마친 뒤 같은 강좌의 다음 학습으로 돌아올 수 있도록 courseId를 함께 넘긴다. */
export const unitQuizHref = (sectionId: number, courseId: number) => `/learner/quiz/${sectionId}?courseId=${courseId}`;
export const finalQuizHref = (courseId: number) => `/learner/quiz/${courseId}?attemptType=FINAL`;
/** 오답 복습(Q-1-2). questionId가 없으면 이 강좌의 미해결 오답을 모두 다시 출제한다. */
export const wrongReviewHref = (courseId: number, questionId?: number) => `/learner/quiz/${courseId}?attemptType=WRONG_REVIEW${questionId ? `&questionId=${questionId}` : ""}`;
export const continueLearningHref = (courseId: number) => `/learner/continue/${courseId}`;

/** 이어가기 API(C-4) 결과로 다음 학습 화면을 정한다. 조회 전이거나 남은 항목이 없으면 강좌 상세로 보낸다. */
export const getNextLearningHref = (next: EnrollmentNextDto | undefined, courseId: number) => {
  if (next?.nextItemType === "VIDEO" && next.videoId) return `/learner/learn/${next.videoId}`;
  if (next?.nextItemType === "UNIT_QUIZ" && next.sectionId) return unitQuizHref(next.sectionId, courseId);
  if (next?.nextItemType === "FINAL_QUIZ") return finalQuizHref(courseId);
  if (next?.nextItemType === "WRONG_REVIEW") return wrongReviewHref(courseId);
  return `/learner/courses/${courseId}`;
};
