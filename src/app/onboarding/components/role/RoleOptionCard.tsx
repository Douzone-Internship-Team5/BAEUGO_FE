import Link from "next/link";

interface Props {
  href: string;
  children: string;
  emphasized?: boolean;
}

export const RoleOptionCard = ({ href, children, emphasized = false }: Props) => (
  <Link
    href={href}
    className={
      emphasized
        ? "flex h-14 items-center justify-center gap-2 rounded-[14px] bg-accent text-[15px] font-semibold text-bg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        : "flex h-14 items-center justify-center gap-2 rounded-[14px] border border-line-focus text-[15px] font-semibold text-accent transition hover:bg-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    }
  >
    {children}
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  </Link>
);
