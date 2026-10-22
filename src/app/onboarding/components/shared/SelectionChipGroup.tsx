import { Chip } from "@/components/common";

interface Props {
  label: string;
  hint?: string;
  options: readonly string[];
  mode: "radio" | "checkbox";
  selected: string[];
  onChange: (value: string, selected: boolean) => void;
}

export const SelectionChipGroup = ({
  label,
  hint,
  options,
  mode,
  selected,
  onChange,
}: Props) => (
  <section
    className="flex flex-col gap-3"
    aria-labelledby={`selection-${label.replace(/\s+/g, "-")}-heading`}
  >
    <h2 id={`selection-${label.replace(/\s+/g, "-")}-heading`} className="text-[15px] font-medium">
      {label} {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </h2>
    <div role={mode === "radio" ? "radiogroup" : "group"} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip
          key={option}
          mode={mode}
          selected={selected.includes(option)}
          onChange={(isSelected) => onChange(option, isSelected)}
        >
          {option}
        </Chip>
      ))}
    </div>
  </section>
);
