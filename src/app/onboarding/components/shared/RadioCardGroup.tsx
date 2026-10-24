import { cn } from "@/_lib/cn";

interface Props {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}

export const RadioCardGroup = ({ label, options, value, onChange }: Props) => (
  <fieldset className="flex flex-col gap-2">
    <legend className="sr-only">{label}</legend>
    {options.map((option) => {
      const selected = value === option;
      return (
        <label
          key={option}
          className={cn(
            "flex h-[52px] cursor-pointer items-center justify-between rounded-[4px] border px-4 text-sm transition-colors",
            "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent",
            selected
              ? "border-accent bg-success-bg"
              : "border-line-strong bg-transparent",
          )}
        >
          <input
            className="sr-only"
            type="radio"
            name={label}
            value={option}
            checked={selected}
            onChange={() => onChange(option)}
          />
          <span>{option}</span>
          {selected && <span className="text-xs text-accent">선택됨</span>}
        </label>
      );
    })}
  </fieldset>
);
