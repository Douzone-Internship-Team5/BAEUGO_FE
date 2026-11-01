"use client";
import { useQuery } from "@tanstack/react-query";
import searchCourses, { type CourseSearchParams } from "./searchCourses";
export default function useCourseSearch(params: CourseSearchParams = {}) {
  return useQuery({ queryKey: ["learning", "course-search", params], queryFn: ({ signal }) => searchCourses(params, signal) });
}
