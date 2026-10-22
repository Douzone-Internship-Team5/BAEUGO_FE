import { cn } from "@/lib/cn";

interface Props {
  /** 1부터 시작 */
  current: number;
  total: number;
  label?: string;
  className?: string;
}

/** 온보딩처럼 단계가 있는 화면의 진행 막대 */
export const StepProgress = ({ current, total, label = "진행 단계", className }: Props) => (
  <div
    role="progressbar"
    aria-label={label}
    aria-valuemin={1}
    aria-valuemax={total}
    aria-valuenow={current}
    className={cn("flex gap-1", className)}
  >
    {Array.from({ length: total }, (_, i) => (
      <span
        key={i}
        className={cn("h-[3px] flex-1 rounded-full", i < current ? "bg-accent" : "bg-line")}
      />
    ))}
  </div>
);
