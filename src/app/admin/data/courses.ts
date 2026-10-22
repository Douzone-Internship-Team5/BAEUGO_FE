import type { CourseStatus } from "@/constants/colors";

export interface AdminCourse {
  courseId: number;
  title: string;
  instructorName: string;
  categoryId: number;
  jobCategory: string;
  status: Extract<CourseStatus, "PUBLISHED" | "OPERATOR_HIDDEN">;
  priceKrw: number;
  enrollmentCount: number;
  publishedAt: string;
  closedReason?: string;
}

export const JOB_CATEGORIES = [
  { id: 1, name: "기획·PM" },
  { id: 2, name: "마케팅" },
  { id: 3, name: "데이터 분석" },
  { id: 4, name: "개발·IT" },
  { id: 5, name: "디자인" },
  { id: 6, name: "사무 생산성" },
  { id: 7, name: "커리어" },
] as const;

export const ADMIN_COURSES: AdminCourse[] = [
  {
    courseId: 101,
    title: "신임 팀장을 위한 1on1 미팅 가이드",
    instructorName: "이하늘",
    categoryId: 1,
    jobCategory: "기획·PM",
    status: "PUBLISHED",
    priceKrw: 35000,
    enrollmentCount: 52,
    publishedAt: "2026-10-10T12:00:00+09:00",
  },
  {
    courseId: 12,
    title: "실무자를 위한 엑셀 자동화",
    instructorName: "이하늘",
    categoryId: 6,
    jobCategory: "사무 생산성",
    status: "PUBLISHED",
    priceKrw: 29000,
    enrollmentCount: 52,
    publishedAt: "2026-10-21T15:00:00+09:00",
  },
  {
    courseId: 108,
    title: "데이터로 설득하는 기획서 작성법",
    instructorName: "박서윤",
    categoryId: 1,
    jobCategory: "기획·PM",
    status: "PUBLISHED",
    priceKrw: 32000,
    enrollmentCount: 38,
    publishedAt: "2026-10-18T09:30:00+09:00",
  },
  {
    courseId: 116,
    title: "초보자를 위한 SQL 데이터 분석",
    instructorName: "정민재",
    categoryId: 3,
    jobCategory: "데이터 분석",
    status: "PUBLISHED",
    priceKrw: 39000,
    enrollmentCount: 27,
    publishedAt: "2026-10-15T14:10:00+09:00",
  },
  {
    courseId: 119,
    title: "브랜드를 키우는 콘텐츠 마케팅",
    instructorName: "최윤아",
    categoryId: 2,
    jobCategory: "마케팅",
    status: "OPERATOR_HIDDEN",
    priceKrw: 25000,
    enrollmentCount: 19,
    publishedAt: "2026-10-12T10:00:00+09:00",
    closedReason: "강좌 소개에 표시된 강의 범위와 실제 영상 내용이 다릅니다.",
  },
  {
    courseId: 123,
    title: "업무 시간을 줄이는 노션 워크플로",
    instructorName: "김도현",
    categoryId: 6,
    jobCategory: "사무 생산성",
    status: "PUBLISHED",
    priceKrw: 27000,
    enrollmentCount: 14,
    publishedAt: "2026-10-08T08:20:00+09:00",
  },
  {
    courseId: 131,
    title: "사용자 관점의 프로덕트 디자인",
    instructorName: "한지우",
    categoryId: 5,
    jobCategory: "디자인",
    status: "OPERATOR_HIDDEN",
    priceKrw: 41000,
    enrollmentCount: 11,
    publishedAt: "2026-10-04T16:40:00+09:00",
    closedReason: "저작권 확인이 필요한 이미지가 포함되어 있습니다.",
  },
];
