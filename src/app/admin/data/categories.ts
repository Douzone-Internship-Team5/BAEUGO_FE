export const JOB_CATEGORIES = [
  { id: 1, code: "PLANNING_PM", name: "기획·PM" },
  { id: 2, code: "MARKETING", name: "마케팅" },
  { id: 3, code: "DATA_ANALYSIS", name: "데이터 분석" },
  { id: 4, code: "DEV_IT", name: "개발·IT" },
  { id: 5, code: "DESIGN", name: "디자인" },
  { id: 6, code: "OFFICE_PRODUCTIVITY", name: "사무 생산성" },
  { id: 7, code: "CAREER", name: "커리어" },
] as const;

export const getJobCategoryName = (
  categoryId?: number | null,
  categoryCode?: string | null,
) =>
  JOB_CATEGORIES.find(
    (category) =>
      (categoryId != null && category.id === categoryId) ||
      (categoryCode != null && category.code === categoryCode),
  )?.name;
