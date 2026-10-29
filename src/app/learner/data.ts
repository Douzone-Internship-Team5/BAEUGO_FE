export const course = {
  title: "일잘러의 보고서 작성법",
  instructor: "이하늘",
  bio: "10년 차 사무 자동화 실무자",
  category: "기획·PM",
  topic: "문서 작성",
  level: "초급",
  description: "실무에서 바로 쓰는 핵심 보고서 구조화 강의입니다.",
  price: 29000,
};

export const myCourses = [
  { title: course.title, status: "수강 중", pct: 29, last: "오늘 학습 · 2강. 데이터 정리하기", action: "이어서 학습" },
  { title: "현업 SQL: 조인부터 윈도 함수까지", status: "수료 임박", pct: 100, last: "오답 2개를 풀면 수료예요", action: "오답 복습" },
  { title: "기획자의 문서 습관", status: "수료", pct: 100, last: "마지막 학습 · 10월 18일", action: "복습하기" },
];

export const recommendations = [
  { tag: "이어보기", duration: "4:00", title: "2강. 데이터 정리하기", course: course.title, href: "/learner/learn/lesson-2" },
  { tag: "무료 OT", duration: "0:45", title: "보고서 작성 핵심", course: course.title, href: "/learner/feed" },
  { tag: "무료 OT", duration: "0:52", title: "회의록 3줄 요약법", course: "기획자의 문서 습관", href: "/learner/feed" },
];

export const catalog = [
  { category: "기획·PM", topic: "문서 작성", title: course.title, instructor: "이하늘", level: "초급", students: "1,248", price: "29,000원" },
  { category: "데이터", topic: "SQL", title: "현업 SQL: 조인부터 윈도 함수까지", instructor: "박도현", level: "중급", students: "832", price: "35,000원" },
  { category: "기획·PM", topic: "업무 습관", title: "기획자의 문서 습관", instructor: "정유진", level: "초급", students: "645", price: "무료" },
];
