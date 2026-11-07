import type { CodesDto, JobCategoryCode, TopicCode } from "@/types/codes";

/** 공통 코드가 아직 없을 때도 화면이 깨지지 않도록 id로 대신 보여준다. */
export const findJobCategory = (codes: CodesDto | undefined, categoryId?: number | null, categoryCode?: string | null): JobCategoryCode | undefined =>
  codes?.jobCategories.find((category) =>
    (categoryId != null && category.id === categoryId) || (categoryCode != null && category.code === categoryCode));

export const findJobCategoryByLabel = (codes: CodesDto | undefined, label: string) =>
  codes?.jobCategories.find((category) => category.label === label);

/** 화면에서 이름으로 고른 주제를 API에 보낼 id로 바꾼다. */
export const getTopicIdsByLabels = (codes: CodesDto | undefined, categoryId: number, labels: string[]) =>
  getTopicsOfCategory(codes, categoryId).filter(({ label }) => labels.includes(label)).map(({ id }) => id);

export const getJobCategoryLabel = (codes: CodesDto | undefined, categoryId?: number | null, categoryCode?: string | null) =>
  findJobCategory(codes, categoryId, categoryCode)?.label;

export const getTopicsOfCategory = (codes: CodesDto | undefined, categoryId?: number | null): TopicCode[] =>
  codes?.topics.filter((topic) => topic.categoryId === categoryId) ?? [];

export const getDifficultyLabel = (codes: CodesDto | undefined, difficulty: string) =>
  codes?.difficulties.find(({ code }) => code === difficulty)?.label ?? difficulty;

export const getTopicLabel = (codes: CodesDto | undefined, topicId: number) =>
  codes?.topics.find((topic) => topic.id === topicId)?.label ?? `주제 #${topicId}`;
