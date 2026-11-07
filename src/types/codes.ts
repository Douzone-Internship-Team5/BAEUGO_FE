export interface JobCategoryCode { id: number; code: string; name: string; label: string; sortOrder: number }
export interface TopicCode { id: number; categoryId: number; jobCategory: string; name: string; label: string; sortOrder: number }
export interface CodeLabel { code: string; label: string }

/** GET /codes 응답 */
export interface CodesDto {
  jobCategories: JobCategoryCode[];
  topics: TopicCode[];
  currentStatuses: CodeLabel[];
  difficulties: CodeLabel[];
  dailyGoalMinutes: number[];
}
