export type InstructorNavIconName = "courses" | "new" | "stats" | "profile";

interface Props {
  name: InstructorNavIconName;
  className?: string;
}

export const InstructorNavIcon = ({ name, className = "" }: Props) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {name === "courses" ? (
      <><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H20v14H5.5A1.5 1.5 0 0 0 4 19.5z" /><path d="M4 5.5v14M8 8h8M8 11h8" /></>
    ) : name === "new" ? (
      <><path d="M12 5v14M5 12h14" /></>
    ) : name === "stats" ? (
      <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>
    ) : (
      <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>
    )}
  </svg>
);
