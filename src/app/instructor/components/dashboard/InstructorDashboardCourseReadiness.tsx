"use client";

import useInstructorCourse from "@/api/instructor/useInstructorCourse";
import { toInstructorCourseDetail } from "@/api/instructor/toInstructorCourse";

interface Props {
  courseId: number;
}

export const InstructorDashboardCourseReadiness = ({ courseId }: Props) => {
  const { data, error, isPending } = useInstructorCourse(courseId);

  if (isPending) {
    return <ReadinessStatus message="공개 조건 확인 중…" />;
  }

  if (error || !data) {
    return <ReadinessStatus message="공개 조건을 불러오지 못했습니다." />;
  }

  const requirements = toInstructorCourseDetail(data).publishRequirements;
  const completed = requirements.filter((requirement) => requirement.complete).length;
  const total = requirements.length;

  return (
    <div className="mt-4" aria-label={`공개 준비 ${completed}/${total}`}>
      <div className="flex justify-between text-[10px] text-muted">
        <span>공개 준비</span>
        <span className="tabular-nums">{completed}/{total}</span>
      </div>
      <div
        className="mt-2 h-1 overflow-hidden rounded-full bg-card"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
      >
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
};

interface ReadinessStatusProps {
  message: string;
}

const ReadinessStatus = ({ message }: ReadinessStatusProps) => (
  <div className="mt-4 flex justify-between text-[10px] text-muted">
    <span>공개 준비</span>
    <span>{message}</span>
  </div>
);
