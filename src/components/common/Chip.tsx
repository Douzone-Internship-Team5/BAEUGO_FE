import type { ComponentPropsWithRef } from "react";
import { cn } from "@/_lib/cn";

interface Props extends Omit<ComponentPropsWithRef<"button">, "onChange"> {
  selected?: boolean;
  /** 하나만 고르면 radio, 여러 개면 checkbox */
  mode?: "radio" | "checkbox";
  onChange?: (selected: boolean) => void;
}

/** 직무·주제처럼 고르는 칩 */
export const Chip = ({
  selected = false,
  mode = "checkbox",
  onChange,
  onClick,
  className,
  type = "button",
  ...rest
}: Props) => (
  <button
    type={type}
    role={mode}
    aria-checked={selected}
    onClick={(e) => {
      onClick?.(e);
      onChange?.(mode === "radio" ? true : !selected);
    }}
    className={cn(
      "h-10 rounded-full border px-4 text-[13px] transition-colors cursor-pointer",
      selected
        ? "border-accent bg-success-bg font-medium text-text"
        : "border-line-strong text-text-sub hover:border-line-focus",
      className,
    )}
    {...rest}
  />
);
