import Link from "next/link";
import { Card } from "@/components/common";
import { BrandHeader } from "./LearnerHeader";
import { ProgressBar } from "./LearnerUI";
import { myCourses, recommendations } from "../../data";

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
      {active === "courses" ? <Courses /> : active === "likes" ? <Likes /> : <QuizNotes />}
    </main>
  </>;
}

function TabLink({ active }: { active: Tab }) {
  return <>{TAB_LINKS.map((item) => <Link key={item.key} href={item.href} aria-current={active === item.key ? "page" : undefined} className={`border-b-2 pb-3 text-xs ${active === item.key ? "border-accent text-text" : "border-transparent text-muted"}`}>{item.label}</Link>)}</>;
}

function CountFilters({ labels }: { labels: string[] }) {
  return <div className="mt-4 flex gap-2 overflow-x-auto">{labels.map((label, index) => <span key={label} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] ${index === 0 ? "border-accent text-accent" : "border-line text-muted"}`}>{label}</span>)}</div>;
}

function Courses() {
  return <><CountFilters labels={["전체 3", "수강 중 2", "수료 1"]} /><div className="mt-4 space-y-3">{myCourses.map((course) => <Card key={course.title} padding="md" className="border border-line bg-panel"><div className="flex items-center justify-between"><span className="text-[10px] text-accent">{course.status}</span><span className="text-[10px] text-muted">{course.last}</span></div><h2 className="mt-2 text-sm font-medium">{course.title}</h2><div className="mt-4 flex items-center gap-3"><ProgressBar value={course.pct} className="flex-1" /><span className="text-[10px] text-muted">{course.pct}%</span></div><p className="mt-3 text-right"><Link href={course.pct === 100 ? "/learner/library/quiz" : "/learner/learn/lesson-2"} className="text-xs text-accent">{course.action} →</Link></p></Card>)}</div></>;
}

function Likes() {
  return <><CountFilters labels={["전체 4", "무료 OT 2", "강의 2"]} /><div className="mt-4 space-y-3">{[...recommendations, { tag: "강의", duration: "5:10", title: "3강. 윈도 함수 맛보기", course: "현업 SQL: 조인부터 윈도 함수까지", href: "/learner/learn/lesson-2" }].map((video) => <Link key={video.title} href={video.href}><Card padding="none" className="flex overflow-hidden border border-line bg-panel"><div className="w-[112px] shrink-0 bg-[linear-gradient(135deg,#293247,#16181b)]" /><div className="min-w-0 flex-1 p-3"><div className="flex justify-between text-[10px] text-muted"><span>{video.tag}</span><span>{video.duration}</span></div><h2 className="mt-2 text-xs font-medium leading-5">{video.title}</h2><p className="mt-1 truncate text-[10px] text-muted">{video.course}</p></div></Card></Link>)}</div></>;
}

function QuizNotes() {
  return <><CountFilters labels={["전체 7", "복습 필요 2", "해결 5"]} /><Card padding="md" className="mt-4 border border-warning-line bg-warning-bg"><p className="text-xs font-medium">현업 SQL 강좌는 오답 2개만 풀면 수료예요</p><p className="mt-2 text-[10px] leading-4 text-muted">맞히면 오답노트에서 빠지고 수료가 바로 반영돼요</p></Card><div className="mt-3 space-y-2">{["보고서의 목적을 정의할 때 포함할 내용은?", "핵심 메시지를 배치하기 좋은 위치는?"] .map((question, i) => <Card key={question} padding="md" className="border border-line bg-panel"><div className="flex justify-between text-[10px] text-muted"><span>{i ? "일잘러의 보고서 작성법" : "현업 SQL 강좌"} · 단위 퀴즈</span><span>2번 틀림</span></div><p className="mt-3 text-xs leading-5">{question}</p><div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-muted">마지막 풀이 10월 26일</span><Link href="/learner/quiz/unit-1" className="text-xs text-accent">다시 풀기</Link></div></Card>)}</div><Link href="/learner/quiz/unit-1" className="mt-4 block rounded-full bg-text py-3 text-center text-xs font-medium text-bg">복습 필요 2문제 한 번에 풀기</Link></>;
}
