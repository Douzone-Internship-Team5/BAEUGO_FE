import Link from "next/link";
import { InstructorNavIcon, type InstructorNavIconName } from "./InstructorNavIcon";

type Tab = "courses" | "new" | "stats" | "profile";

interface Props {
  active: Tab;
}

const TABS: Array<{ id: Tab; label: string; href: string; icon: InstructorNavIconName }> = [
  { id: "courses", label: "내 강좌", href: "/instructor", icon: "courses" },
  { id: "new", label: "새 강좌", href: "/instructor/courses/new", icon: "new" },
  { id: "stats", label: "통계", href: "/instructor/stats", icon: "stats" },
  { id: "profile", label: "강사 정보", href: "/instructor/profile", icon: "profile" },
];

export const InstructorMobileNav = ({ active }: Props) => (
  <nav aria-label="강사 메뉴" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-bg/95 px-2 pt-1 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
    {TABS.map((tab) => (
      <Link key={tab.id} href={tab.href} aria-current={active === tab.id ? "page" : undefined} className={`flex min-h-12 cursor-pointer flex-col items-center justify-center gap-1 text-[10px] ${active === tab.id ? "text-accent" : "text-dim"}`}>
        <InstructorNavIcon name={tab.icon} className="size-[18px]" />
        {tab.label}
      </Link>
    ))}
  </nav>
);
