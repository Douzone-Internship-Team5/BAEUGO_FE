import type { CourseStatus } from "@/constants/colors";

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
  otVideo: { videoId: number; title: string; duration: string; transcriptReviewed: boolean };
  sections: InstructorSection[];
  finalQuiz: { status: "COMPLETED" | "PROCESSING" | "PENDING"; reviewed: boolean };
  publishRequirements: Array<{ label: string; complete: boolean }>;
}

export const INSTRUCTOR_COURSES: InstructorCourse[] = [
  {
    courseId: 201,
    title: "실무 보고서, 한 장으로 설득하기",
    summary: "읽는 사람의 결정을 이끌어내는 보고서 작성법",
    category: "기획·PM",
    topic: "문서 작성",
    status: "PUBLISHED",
    priceKrw: 35000,
    enrollmentCount: 128,
    sectionCount: 4,
    lessonCount: 12,
    lessonViews: 1842,
    estimatedRevenue: 4480000,
    publishedAt: "2026-10-12T09:00:00+09:00",
    processing: { completed: 16, total: 16 },
  },
  {
    courseId: 202,
    title: "처음 시작하는 데이터 시각화",
    summary: "데이터를 읽기 쉬운 차트와 이야기로 바꾸기",
    category: "데이터 분석",
    topic: "데이터 시각화",
    status: "EDITING",
    priceKrw: 42000,
    enrollmentCount: 46,
    sectionCount: 3,
    lessonCount: 8,
    lessonViews: 674,
    estimatedRevenue: 1932000,
    publishedAt: "2026-08-28T14:20:00+09:00",
    processing: { completed: 9, total: 12 },
  },
  {
    courseId: 203,
    title: "회의 시간을 절반으로 줄이는 퍼실리테이션",
    summary: "목표 설정부터 액션 아이템 정리까지",
    category: "기획·PM",
    topic: "협업·커뮤니케이션",
    status: "DRAFT",
    priceKrw: 29000,
    enrollmentCount: 0,
    sectionCount: 2,
    lessonCount: 5,
    lessonViews: 0,
    estimatedRevenue: 0,
    publishedAt: null,
    processing: { completed: 4, total: 8 },
  },
  {
    courseId: 204,
    title: "기획자를 위한 SQL 첫걸음",
    summary: "필요한 데이터를 직접 조회하고 해석하기",
    category: "데이터 분석",
    topic: "SQL",
    status: "OPERATOR_HIDDEN",
    priceKrw: 39000,
    enrollmentCount: 31,
    sectionCount: 3,
    lessonCount: 9,
    lessonViews: 390,
    estimatedRevenue: 1209000,
    publishedAt: "2026-07-16T11:00:00+09:00",
    processing: { completed: 12, total: 12 },
  },
];

export const INSTRUCTOR_COURSE_DETAILS: InstructorCourseDetail[] = [
  {
    ...INSTRUCTOR_COURSES[0],
    description:
      "보고서의 목적과 핵심 메시지를 먼저 정리하고, 데이터와 근거를 구조화해 설득력 있는 한 장의 문서로 완성합니다.",
    difficulty: "INTERMEDIATE",
    otVideo: { videoId: 1001, title: "좋은 보고서는 무엇이 다를까요?", duration: "04:32", transcriptReviewed: true },
    sections: [
      {
        sectionId: 1,
        title: "보고서의 목적과 독자 정의하기",
        videos: [
          { videoId: 1101, title: "보고받는 사람부터 이해하기", duration: "12:40", transcriptReviewed: true },
          { videoId: 1102, title: "핵심 질문으로 범위 좁히기", duration: "10:18", transcriptReviewed: true },
        ],
        quiz: { status: "COMPLETED", reviewed: true },
      },
      {
        sectionId: 2,
        title: "핵심 메시지와 근거 구성하기",
        videos: [
          { videoId: 1201, title: "결론을 먼저 쓰는 구조", duration: "14:06", transcriptReviewed: true },
          { videoId: 1202, title: "데이터로 주장을 뒷받침하기", duration: "16:22", transcriptReviewed: true },
        ],
        quiz: { status: "COMPLETED", reviewed: true },
      },
      {
        sectionId: 3,
        title: "한 장으로 시각화하기",
        videos: [{ videoId: 1301, title: "읽히는 표와 차트 만들기", duration: "18:10", transcriptReviewed: true }],
        quiz: { status: "COMPLETED", reviewed: true },
      },
    ],
    finalQuiz: { status: "COMPLETED", reviewed: true },
    publishRequirements: [
      { label: "무료 OT 영상 1개", complete: true },
      { label: "모든 섹션에 학습 영상 포함", complete: true },
      { label: "모든 영상 대본 검수 완료", complete: true },
      { label: "단위 퀴즈 생성 및 검수 완료", complete: true },
      { label: "종합 퀴즈 검수 완료", complete: true },
      { label: "퀴즈 문항 및 보기 구성 완료", complete: true },
    ],
  },
  {
    ...INSTRUCTOR_COURSES[1],
    description:
      "목적에 맞는 차트를 선택하고 핵심 인사이트를 강조해 데이터가 말하는 내용을 명확하게 전달합니다.",
    difficulty: "BEGINNER",
    otVideo: { videoId: 2001, title: "차트보다 먼저 생각할 것", duration: "05:10", transcriptReviewed: true },
    sections: [
      {
        sectionId: 4,
        title: "데이터 정리와 시각화 원칙",
        videos: [
          { videoId: 2101, title: "데이터를 차트에 맞게 정리하기", duration: "13:40", transcriptReviewed: true },
          { videoId: 2102, title: "상황에 맞는 차트 선택하기", duration: "15:05", transcriptReviewed: false },
        ],
        quiz: { status: "COMPLETED", reviewed: false },
      },
    ],
    finalQuiz: { status: "PENDING", reviewed: false },
    publishRequirements: [
      { label: "무료 OT 영상 1개", complete: true },
      { label: "모든 섹션에 학습 영상 포함", complete: true },
      { label: "모든 영상 대본 검수 완료", complete: false },
      { label: "단위 퀴즈 생성 및 검수 완료", complete: false },
      { label: "종합 퀴즈 검수 완료", complete: false },
      { label: "퀴즈 문항 및 보기 구성 완료", complete: false },
    ],
  },
];

export const getInstructorCourse = (courseId: number): InstructorCourseDetail | undefined => {
  const detail = INSTRUCTOR_COURSE_DETAILS.find((course) => course.courseId === courseId);
  if (detail) return detail;
  const course = INSTRUCTOR_COURSES.find((item) => item.courseId === courseId);
  if (!course) return undefined;
  return {
    ...course,
    description: course.summary,
    difficulty: "BEGINNER",
    otVideo: { videoId: courseId * 10, title: "강좌 소개", duration: "03:20", transcriptReviewed: false },
    sections: [],
    finalQuiz: { status: "PENDING", reviewed: false },
    publishRequirements: [
      { label: "무료 OT 영상 1개", complete: false },
      { label: "모든 섹션에 학습 영상 포함", complete: false },
      { label: "모든 영상 대본 검수 완료", complete: false },
      { label: "단위 퀴즈 생성 및 검수 완료", complete: false },
      { label: "종합 퀴즈 검수 완료", complete: false },
      { label: "퀴즈 문항 및 보기 구성 완료", complete: false },
    ],
  };
};

export const COURSE_STATUS_FILTERS = [
  { value: "ALL", label: "전체" },
  { value: "PUBLISHED", label: "공개 중" },
  { value: "DRAFT", label: "작성 중" },
  { value: "EDITING", label: "수정 중" },
  { value: "OPERATOR_HIDDEN", label: "운영자 비공개" },
] as const;
