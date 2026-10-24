interface Props {
  onClick: () => void;
  children: string;
  emphasized?: boolean;
  disabled?: boolean;
}

export const RoleOptionCard = ({ onClick, children, emphasized = false, disabled }: Props) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={
      emphasized
        ? "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-accent text-[15px] font-semibold text-bg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
        : "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-line-focus text-[15px] font-semibold text-accent transition hover:bg-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
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
  </button>
);
