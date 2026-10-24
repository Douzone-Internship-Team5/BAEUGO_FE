import Link from "next/link";

type Tab = "courses" | "new" | "stats" | "profile";

interface Props {
  active: Tab;
}

const TABS: Array<{ id: Tab; label: string; href: string }> = [
  { id: "courses", label: "내 강좌", href: "/instructor" },
  { id: "new", label: "새 강좌", href: "/instructor/courses/new" },
  { id: "stats", label: "통계", href: "/instructor/stats" },
  { id: "profile", label: "강사 정보", href: "/instructor/profile" },
];

export const InstructorMobileNav = ({ active }: Props) => (
  <nav aria-label="강사 메뉴" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-bg/95 px-2 pt-1 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
    {TABS.map((tab) => (
      <Link key={tab.id} href={tab.href} aria-current={active === tab.id ? "page" : undefined} className={`flex min-h-12 cursor-pointer flex-col items-center justify-center gap-1 text-[11px] ${active === tab.id ? "text-text" : "text-dim"}`}>
        <span className={`size-1 rounded-full ${active === tab.id ? "bg-accent" : "bg-transparent"}`} aria-hidden="true" />
        {tab.label}
      </Link>
    ))}
  </nav>
);
