export const instructorQueryKeys = {
  all: ["instructor"] as const,
  courses: () => [...instructorQueryKeys.all, "courses"] as const,
  courseLists: () => [...instructorQueryKeys.courses(), "list"] as const,
  courseList: (status?: string) => [...instructorQueryKeys.courseLists(), status ?? "ALL"] as const,
  course: (courseId: number) => [...instructorQueryKeys.courses(), courseId] as const,
  quiz: (courseId: number, sectionId?: number) => [...instructorQueryKeys.course(courseId), "quiz", sectionId ?? "final"] as const,
  script: (videoId: number) => [...instructorQueryKeys.all, "script", videoId] as const,
  stats: (params: Record<string, string | number | undefined>) => [...instructorQueryKeys.all, "stats", params] as const,
};
