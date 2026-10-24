import type { ComponentPropsWithRef } from "react";
import { cn } from "@/_lib/cn";

type CardTone = "panel" | "card" | "outline";
type CardPadding = "none" | "sm" | "md" | "lg";

interface Props extends ComponentPropsWithRef<"div"> {
  tone?: CardTone;
  padding?: CardPadding;
}

const toneClass: Record<CardTone, string> = {
  panel: "bg-panel",
  card: "bg-card",
  outline: "border border-line",
};

const paddingClass: Record<CardPadding, string> = {
  none: "",
  sm: "p-3.5",
  md: "p-4.5",
  lg: "p-6",
};

/** 모서리 4px 기본 카드 */
export const Card = ({
  tone = "panel",
  padding = "md",
  className,
  ...rest
}: Props) => (
  <div
    className={cn(
      "rounded-[4px]",
      toneClass[tone],
      paddingClass[padding],
      className,
    )}
    {...rest}
  />
);
