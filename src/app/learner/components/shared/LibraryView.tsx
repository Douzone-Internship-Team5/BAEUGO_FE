import Link from "next/link";
import { BrandHeader } from "./LearnerHeader";
import { LibraryTabContent } from "./LibraryTabContent";

type Tab = "courses" | "likes" | "quiz";
const TAB_LINKS = [
  { key: "courses", label: "내 강좌", href: "/learner/library" },
  { key: "likes", label: "좋아요", href: "/learner/library/likes" },
  { key: "quiz", label: "퀴즈", href: "/learner/library/quiz" },
] as const;

export function LibraryView({ active }: { active: Tab }) {
  return <>
    <BrandHeader />
    <main className="px-5 pb-8">
      <p className="text-[10px] tracking-[2px] text-muted">LIBRARY</p><h1 className="mt-2 text-[23px] font-medium">내 보관함</h1>
      <nav className="mt-5 flex gap-6 border-b border-line" aria-label="보관함"><TabLink active={active} /></nav>
      <LibraryTabContent active={active} />
    </main>
  </>;
}

function TabLink({ active }: { active: Tab }) {
  return <>{TAB_LINKS.map((item) => <Link key={item.key} href={item.href} aria-current={active === item.key ? "page" : undefined} className={`border-b-2 pb-3 text-xs ${active === item.key ? "border-accent text-text" : "border-transparent text-muted"}`}>{item.label}</Link>)}</>;
}
