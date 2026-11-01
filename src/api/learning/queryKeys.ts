export const learningQueryKeys = {
  all: ["learning"] as const,
  feed: () => [...learningQueryKeys.all, "feed"] as const,
  course: (courseId: number) => [...learningQueryKeys.all, "course", courseId] as const,
  enrollments: (status?: string) => [...learningQueryKeys.all, "enrollments", status ?? "ALL"] as const,
  completion: (courseId: number) => [...learningQueryKeys.all, "course", courseId, "completion"] as const,
  next: (enrollmentId: number) => [...learningQueryKeys.all, "enrollment", enrollmentId, "next"] as const,
  video: (videoId: number) => [...learningQueryKeys.all, "video", videoId] as const,
  likes: (videoType?: string) => [...learningQueryKeys.all, "likes", videoType ?? "ALL"] as const,
};
