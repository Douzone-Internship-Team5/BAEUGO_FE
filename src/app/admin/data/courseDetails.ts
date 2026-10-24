import type { AdminCourse } from "./courses";
import { ADMIN_COURSES } from "./courses";

export interface TranscriptSegment {
  id: number;
  seq: number;
  startMs: number;
  endMs: number;
  content: string;
}

export interface ReviewVideo {
  videoId: number;
  videoType: "OT" | "LESSON";
  title: string;
  durationSeconds: number;
  sortOrder: number;
  videoUrl: string;
  sttStatus: "COMPLETED" | "PROCESSING" | "FAILED";
  transcriptReviewedAt: string | null;
  segments: TranscriptSegment[];
}

export interface ReviewQuestion {
  questionId: number;
  orderNo: number;
  generatedBy: "AI" | "INSTRUCTOR";
  content: string;
  choices: string[];
  correctChoiceNo: number;
  explanation: string;
}

export interface ReviewQuiz {
  quizId: number;
  quizType: "UNIT" | "FINAL";
  aiStatus: string | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  questions: ReviewQuestion[];
}

export interface ReviewSection {
  sectionId: number;
  title: string;
  sortOrder: number;
  videos: ReviewVideo[];
  unitQuiz: ReviewQuiz | null;
}

export interface AdminCourseDetail {
  course: AdminCourse;
  description: string;
  topicName: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  instructor: {
    id: number;
    name: string;
    email: string;
    bio: string;
  };
  totalLessonDurationSeconds: number;
  totalLessonCount: number;
  otVideo: ReviewVideo | null;
  sections: ReviewSection[];
  finalQuiz: ReviewQuiz | null;
}

const sampleTranscript: TranscriptSegment[] = [
  {
    id: 9000,
    seq: 1,
    startMs: 0,
    endMs: 4200,
    content: "안녕하세요. 이번 강의에서 다룰 핵심 내용을 먼저 살펴보겠습니다.",
  },
  {
    id: 9001,
    seq: 2,
    startMs: 4200,
    endMs: 9300,
    content: "실무에서 바로 적용할 수 있도록 단계별 예시와 함께 설명합니다.",
  },
];

const unitQuiz: ReviewQuiz = {
  quizId: 701,
  quizType: "UNIT",
  aiStatus: "COMPLETED",
  reviewedBy: 6,
  reviewedAt: "2026-10-16T10:02:00+09:00",
  questions: [
    {
      questionId: 801,
      orderNo: 1,
      generatedBy: "AI",
      content: "강의에서 다룬 내용을 실무에 적용할 때 가장 먼저 해야 할 일은 무엇인가요?",
      choices: ["목표와 해결할 문제 정의", "자료를 모두 모으기", "결과부터 공유하기", "도구부터 선택하기"],
      correctChoiceNo: 1,
      explanation: "목표와 해결할 문제를 먼저 정해야 적절한 자료와 실행 방법을 선택할 수 있습니다.",
    },
  ],
};

const finalQuiz: ReviewQuiz = {
  quizId: 799,
  quizType: "FINAL",
  aiStatus: null,
  reviewedBy: 6,
  reviewedAt: "2026-10-16T10:05:00+09:00",
  questions: [
    {
      questionId: 890,
      orderNo: 1,
      generatedBy: "INSTRUCTOR",
      content: "이 강좌의 내용을 업무에 적용할 때 가장 적절한 접근은 무엇인가요?",
      choices: ["목적에 맞게 핵심 원칙을 적용한다", "모든 상황에 같은 방식을 적용한다", "검토 없이 결과를 공유한다", "필요한 맥락을 생략한다"],
      correctChoiceNo: 1,
      explanation: "상황과 목표를 확인한 뒤 강좌의 핵심 원칙을 적용해야 합니다.",
    },
  ],
};

export const getAdminCourseDetail = (courseId: number): AdminCourseDetail | undefined => {
  const course = ADMIN_COURSES.find((item) => item.courseId === courseId);
  if (!course) return undefined;

  const lessonVideos: ReviewVideo[] = [
    {
      videoId: course.courseId * 10 + 1,
      videoType: "LESSON",
      title: "1강. 핵심 개념과 시작하기",
      durationSeconds: 360,
      sortOrder: 1,
      videoUrl: `/api/v1/videos/${course.courseId * 10 + 1}/stream`,
      sttStatus: "COMPLETED",
      transcriptReviewedAt: "2026-10-16T10:00:00+09:00",
      segments: sampleTranscript,
    },
    {
      videoId: course.courseId * 10 + 2,
      videoType: "LESSON",
      title: "2강. 실무 예시와 적용 방법",
      durationSeconds: 420,
      sortOrder: 2,
      videoUrl: `/api/v1/videos/${course.courseId * 10 + 2}/stream`,
      sttStatus: "COMPLETED",
      transcriptReviewedAt: "2026-10-16T10:00:00+09:00",
      segments: sampleTranscript,
    },
  ];

  return {
    course,
    description: `${course.jobCategory} 실무에서 바로 활용할 수 있는 핵심 개념과 적용 방법을 배웁니다.`,
    topicName: course.jobCategory === "기획·PM" ? "문서 작성" : "업무 자동화",
    difficulty: "INTERMEDIATE",
    instructor: {
      id: course.instructorName === "이하늘" ? 6 : 8,
      name: course.instructorName,
      email: course.instructorName === "이하늘" ? "instructor1@baeugo.test" : "instructor2@baeugo.test",
      bio: "현업 경험을 바탕으로 실무에 적용할 수 있는 방법을 소개합니다.",
    },
    totalLessonDurationSeconds: lessonVideos.reduce((sum, video) => sum + video.durationSeconds, 0),
    totalLessonCount: lessonVideos.length,
    otVideo: {
      videoId: course.courseId * 10,
      videoType: "OT",
      title: `무료 OT - ${course.title}`,
      durationSeconds: 45,
      sortOrder: 0,
      videoUrl: `/api/v1/videos/${course.courseId * 10}/stream`,
      sttStatus: "COMPLETED",
      transcriptReviewedAt: "2026-10-16T09:50:00+09:00",
      segments: sampleTranscript,
    },
    sections: [
      {
        sectionId: course.courseId * 20,
        title: "섹션 1. 기본 개념 및 실무 적용",
        sortOrder: 1,
        videos: lessonVideos,
        unitQuiz,
      },
    ],
    finalQuiz,
  };
};
