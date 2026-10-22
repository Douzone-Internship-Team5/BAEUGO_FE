import { LEARNING_GOALS } from "../../data/options";
import { cn } from "@/lib/cn";

interface Props {
  value: number | null;
  onChange: (value: number) => void;
}

export const LearningGoalSelector = ({ value, onChange }: Props) => (
  <fieldset className="flex flex-col gap-3">
    <div className="grid grid-cols-3 gap-2">
      {LEARNING_GOALS.map((minutes) => (
        <label
          key={minutes}
          className={cn(
            "flex h-16 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[4px] border transition-colors",
            value === minutes
              ? "border-accent bg-success-bg"
              : "border-line-strong",
          )}
        >
          <input
            className="sr-only"
            type="radio"
            name="learning-goal"
            value={minutes}
            checked={value === minutes}
            onChange={() => onChange(minutes)}
          />
          <span className="text-xl font-light">{minutes}</span>
          <span className="text-[11px] text-muted">분</span>
        </label>
      ))}
    </div>
  </fieldset>
);
