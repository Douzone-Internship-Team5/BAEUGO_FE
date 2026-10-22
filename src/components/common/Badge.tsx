import type { ReactNode } from "react";
import { AI_STATUS, COURSE_STATUS } from "@/constants/colors";
import type { AiStatus, CourseStatus } from "@/constants/colors";

interface Props {
  color: string;
  children: ReactNode;
  /** 넣으면 테두리 대신 이 배경색 칩으로 보여줌 */
  bg?: string;
}

/** 작은 상태 배지. 색은 constants/colors의 값을 넘김. */
export const Badge = ({ color, bg, children }: Props) => (
  <span
    className="inline-flex h-5.5 items-center whitespace-nowrap rounded-full px-2.5 text-[11px]"
    style={bg ? { color, background: bg } : { color, border: `1px solid ${color}` }}
  >
    {children}
  </span>
);

interface CourseStatusBadgeProps {
  status: CourseStatus;
}

export const CourseStatusBadge = ({ status }: CourseStatusBadgeProps) => {
  const { label, color } = COURSE_STATUS[status];
  return <Badge color={color}>{label}</Badge>;
};

interface AiStatusBadgeProps {
  status: AiStatus;
  /** 기본 라벨 앞에 붙일 말 (예: STT) */
  prefix?: string;
}

export const AiStatusBadge = ({ status, prefix }: AiStatusBadgeProps) => {
  const { label, color, bg } = AI_STATUS[status];
  return (
    <Badge color={color} bg={bg}>
      {prefix ? `${prefix} ${label}` : label}
    </Badge>
  );
};
