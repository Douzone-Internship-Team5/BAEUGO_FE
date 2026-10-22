import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  title?: ReactNode;
  /** 있으면 왼쪽에 뒤로 가기 버튼을 보여줌 */
  backHref?: string;
  /** 클라이언트 흐름에서 뒤로 이동할 때 사용 */
  onBack?: () => void;
  /** 오른쪽 영역 (프로필, 저장 버튼 등) */
  right?: ReactNode;
  /** 제목 대신 BAEUGO 로고를 보여줌 */
  showLogo?: boolean;
  /** 로고 옆 작은 글씨 (예: OPERATOR) */
  subLabel?: string;
  bordered?: boolean;
  className?: string;
}

/** 모바일 상단 바. 높이 60px. */
export const Header = ({
  title,
  backHref,
  onBack,
  right,
  showLogo = false,
  subLabel,
  bordered = false,
  className,
}: Props) => (
  <header
    className={cn(
      "flex h-15 shrink-0 items-center gap-1 px-3",
      bordered && "border-b border-line",
      className,
    )}
  >
    {backHref ? (
      <BackLink href={backHref} />
    ) : onBack ? (
      <button
        type="button"
        aria-label="뒤로"
        onClick={onBack}
        className="flex size-11 cursor-pointer items-center justify-center"
      >
        <BackIcon />
      </button>
    ) : null}
    {showLogo ? (
      <div className={cn("flex items-baseline gap-2", !backHref && "pl-2")}>
        <span className="text-[15px] font-semibold tracking-[4px]">BAEUGO</span>
        {subLabel && <span className="text-[10px] tracking-[2px] text-muted">{subLabel}</span>}
      </div>
    ) : (
      title && (
        <h1 className={cn("truncate text-[15px] font-medium", !backHref && "pl-2")}>{title}</h1>
      )
    )}
    {right && <div className="ml-auto flex items-center">{right}</div>}
  </header>
);

const BackLink = ({ href }: { href: string }) => (
  <Link href={href} aria-label="뒤로" className="flex size-11 cursor-pointer items-center justify-center">
    <BackIcon />
  </Link>
);

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
