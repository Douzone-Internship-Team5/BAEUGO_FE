/** 강사 강좌 목록·대시보드의 상태 필터 */
export const COURSE_STATUS_FILTERS = [
  { value: "ALL", label: "전체" },
  { value: "PUBLISHED", label: "공개 중" },
  { value: "DRAFT", label: "작성 중" },
  { value: "EDITING", label: "수정 중" },
  { value: "OPERATOR_HIDDEN", label: "운영자 비공개" },
] as const;
