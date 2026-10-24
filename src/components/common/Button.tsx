import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/_lib/cn";

type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface Props extends ComponentPropsWithRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-text text-bg hover:bg-white",
  accent: "bg-accent text-bg hover:brightness-110",
  outline: "border border-line-strong text-text hover:border-line-focus",
  ghost: "text-muted hover:text-text",
  danger: "border border-danger-line text-danger hover:bg-danger-bg",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-[15px]",
};

/** 알약 모양 기본 버튼. 링크 모양이 필요하면 buttonClass()를 Link에 붙여서 씀. */
export const buttonClass = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: Pick<Props, "variant" | "size" | "fullWidth"> = {}) =>
  cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    variantClass[variant],
    sizeClass[size],
    fullWidth && "w-full",
  );

export const Button = ({
  variant,
  size,
  fullWidth,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: Props) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={cn(buttonClass({ variant, size, fullWidth }), className)}
    {...rest}
  >
    {loading ? <Spinner /> : leftIcon}
    {children}
    {!loading && rightIcon}
  </button>
);

const Spinner = () => (
  <span
    aria-hidden="true"
    className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
  />
);
