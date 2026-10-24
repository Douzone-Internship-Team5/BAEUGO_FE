import type { AdminCoursesParams, AdminUsersParams } from "@/types/admin";

export const adminQueryKeys = {
  all: ["admin"] as const,
  users: () => [...adminQueryKeys.all, "users"] as const,
  userList: (params: AdminUsersParams) => [...adminQueryKeys.users(), params] as const,
  user: (userId: number) => [...adminQueryKeys.users(), userId] as const,
  courses: () => [...adminQueryKeys.all, "courses"] as const,
  courseList: (params: AdminCoursesParams) => [...adminQueryKeys.courses(), params] as const,
  course: (courseId: number) => [...adminQueryKeys.courses(), courseId] as const,
};
