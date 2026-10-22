export const JOB_OPTIONS = [
  "기획·PM",
  "마케팅",
  "데이터 분석",
  "개발·IT",
  "디자인",
  "사무 생산성",
  "커리어",
] as const;

export const SITUATION_OPTIONS = [
  "취업 준비 중",
  "재직 중",
  "이직·직무 전환 준비 중",
] as const;

export const TOPIC_GROUPS = [
  {
    name: "기획·PM",
    tag: "희망 직무",
    topics: ["문서 작성", "기획서 쓰기", "데이터 기반 의사결정", "프로젝트 관리", "회의 진행"],
  },
  {
    name: "사무 생산성",
    tag: "추천",
    topics: ["업무 자동화", "엑셀", "구글 시트", "보고서 시각화"],
  },
  {
    name: "마케팅",
    tag: "다른 직무",
    topics: ["콘텐츠 마케팅", "광고 성과 분석", "검색 최적화"],
  },
  {
    name: "데이터 분석",
    tag: "다른 직무",
    topics: ["SQL", "데이터 시각화", "스프레드시트 분석"],
  },
] as const;

export const INSTRUCTOR_TOPICS = [
  "업무 자동화",
  "엑셀",
  "구글 시트",
  "보고서 시각화",
  "메일·메신저 정리",
] as const;

export const LEARNING_GOALS = [10, 20, 30, 40, 50, 60] as const;

export type TimeSlot = {
  id: string;
  start: string;
  end: string;
  tag: string;
};
