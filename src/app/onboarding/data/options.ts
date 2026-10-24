export const JOB_CATEGORIES = [
  {
    id: 1,
    code: "PLANNING_PM",
    name: "기획·PM",
    topics: [
      { id: 11, name: "문서 작성" },
      { id: 12, name: "서비스 기획" },
      { id: 13, name: "프로젝트 일정 관리" },
    ],
  },
  {
    id: 2,
    code: "MARKETING",
    name: "마케팅",
    topics: [
      { id: 21, name: "퍼포먼스 마케팅" },
      { id: 22, name: "콘텐츠 마케팅" },
      { id: 23, name: "SNS 채널 운영" },
    ],
  },
  {
    id: 3,
    code: "DATA_ANALYSIS",
    name: "데이터 분석",
    topics: [
      { id: 31, name: "엑셀 데이터 분석" },
      { id: 32, name: "SQL 기초" },
      { id: 33, name: "데이터 시각화" },
    ],
  },
  {
    id: 4,
    code: "DEV_IT",
    name: "개발·IT",
    topics: [
      { id: 41, name: "프로그래밍 기초" },
      { id: 42, name: "웹 개발" },
      { id: 43, name: "Git 협업" },
    ],
  },
  {
    id: 5,
    code: "DESIGN",
    name: "디자인",
    topics: [
      { id: 51, name: "UI·UX 디자인" },
      { id: 52, name: "피그마 활용" },
      { id: 53, name: "프레젠테이션 디자인" },
    ],
  },
  {
    id: 6,
    code: "OFFICE_PRODUCTIVITY",
    name: "사무 생산성",
    topics: [
      { id: 61, name: "업무 자동화" },
      { id: 62, name: "엑셀 실무" },
      { id: 63, name: "생성형 AI 업무 활용" },
    ],
  },
  {
    id: 7,
    code: "CAREER",
    name: "커리어",
    topics: [
      { id: 71, name: "이력서·자기소개서" },
      { id: 72, name: "면접 준비" },
      { id: 73, name: "비즈니스 커뮤니케이션" },
    ],
  },
] as const;

export const JOB_OPTIONS = JOB_CATEGORIES.map(({ name }) => name);

export const getJobCategory = (name: string) =>
  JOB_CATEGORIES.find((category) => category.name === name);

export const getSelectedTopicIds = (job: string, selectedTopics: string[]) => {
  const category = getJobCategory(job);
  return category?.topics
    .filter(({ name }) => selectedTopics.includes(name))
    .map(({ id }) => id) ?? [];
};

export const SITUATION_OPTIONS = [
  "취업 준비 중",
  "재직 중",
  "이직·직무 전환 준비 중",
] as const;

export const CURRENT_STATUS_VALUES = {
  "취업 준비 중": "JOB_SEEKER",
  "재직 중": "EMPLOYED",
  "이직·직무 전환 준비 중": "CAREER_CHANGE",
} as const;

export const LEARNING_GOALS = [10, 20, 30, 40, 50, 60] as const;

export type TimeSlot = {
  id: string;
  start: string;
  end: string;
  tag: string;
};
