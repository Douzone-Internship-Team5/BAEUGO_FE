import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  title: string;
  backHref?: string;
  right?: ReactNode;
}

export const InstructorScreenHeader = ({
  title,
  backHref = "/instructor",
  right,
}: Props) => (
  <header className="flex h-[60px] items-center gap-1 border-b border-line px-3 md:hidden">
    <Link
      href={backHref}
      aria-label="뒤로"
      className="flex size-11 cursor-pointer items-center justify-center"
    >
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
    </Link>
    <h1 className="truncate text-[15px] font-medium">{title}</h1>
    {right && <div className="ml-auto flex items-center">{right}</div>}
  </header>
);

interface StudioHeaderProps {
  title?: string;
  count?: number;
}

export const StudioHeader = ({ title, count }: StudioHeaderProps) => (
  <header className="flex h-[60px] items-center justify-between px-5 md:h-[72px] md:border-b md:border-line md:px-8">
    {title ? (
      <div className="flex w-full min-w-0 items-baseline justify-between gap-2.5 md:gap-3">
        <span className="min-w-0 truncate text-[26px] font-light leading-[1.35] tracking-[-0.5px]">
          {title}
          {count !== undefined && (
            <span className="ml-2 font-semibold">{count}개</span>
          )}
        </span>
        <Link href="/instructor/profile" className="shrink-0 cursor-pointer text-[15px] text-muted transition hover:text-text">강사 이하늘님</Link>
      </div>
    ) : (
      <div className="flex items-baseline gap-2">
        <span className="text-[15px] font-semibold tracking-[4px]">BAEUGO</span>
        <span className="text-[10px] tracking-[2px] text-muted">STUDIO</span>
      </div>
    )}
    {!title && (
      <span className="flex size-8 items-center justify-center rounded-full bg-card text-[13px]">
        이
      </span>
    )}
  </header>
);
