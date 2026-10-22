/**
 * 디자인 색상 상수 (B. 세련된 다크).
 * 값은 디자인 캔버스와 같음. 색을 바꿀 땐 여기와 src/styles/theme.css를 같이 고칠 것.
 */
export const colors = {
  // 배경 · 면
  bg: "#0E0F11",
  panel: "#16171A",
  card: "#1C1E22",
  selected: "#22252B",

  // 선
  line: "#2A2C30",
  lineStrong: "#2E3035",
  lineFocus: "#3A3D42",

  // 글자
  text: "#F2F1EC",
  textSub: "#D6D5D0",
  muted: "#9A9DA3",
  dim: "#8A8D93",
  white: "#FFFFFF",

  // 포인트
  accent: "#9DB8FF",

  // 의미 색
  neutral: "#A1A4AA", // 작성 중 · 수정 중 · 대기
  success: "#8AA9D6", // 공개 중 · 완료 · 정답
  successBg: "#1A2130",
  successLine: "#3B5275",
  successSoftBg: "#131A25",
  warning: "#C9B68D",
  warningLine: "#4A4332",
  warningBg: "#1B1914",
  danger: "#D49A8C", // 운영자 비공개 · 실패 · 삭제
  dangerLine: "#5A403A",
  dangerBg: "#33201C",
  onDanger: "#2A0F08",

  overlay: "rgba(5, 6, 7, 0.78)",
} as const;

export type ColorToken = keyof typeof colors;

// API 타입 파일이 생기면 그쪽 타입으로 옮길 것
export type CourseStatus = "DRAFT" | "PUBLISHED" | "EDITING" | "OPERATOR_HIDDEN";
export type AiStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

type StatusStyle = { label: string; color: string };

/** 강좌 상태 배지 */
export const COURSE_STATUS: Record<CourseStatus, StatusStyle> = {
  DRAFT: { label: "작성 중", color: colors.neutral },
  PUBLISHED: { label: "공개 중", color: colors.success },
  EDITING: { label: "수정 중", color: colors.neutral },
  OPERATOR_HIDDEN: { label: "운영자 비공개", color: colors.danger },
};

/** STT · 퀴즈 생성 같은 AI 처리 상태 칩 */
export const AI_STATUS: Record<AiStatus, StatusStyle & { bg: string }> = {
  PENDING: { label: "대기", color: colors.neutral, bg: colors.card },
  PROCESSING: { label: "처리 중", color: colors.accent, bg: colors.card },
  COMPLETED: { label: "완료", color: colors.success, bg: colors.successBg },
  FAILED: { label: "실패", color: colors.danger, bg: colors.dangerBg },
};
