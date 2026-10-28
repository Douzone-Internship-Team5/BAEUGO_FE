import Link from "next/link";
import { Button, Card } from "@/components/common";
import { LearnerHeader } from "../components/shared/LearnerHeader";
import { ProgressBar, SectionTitle, Stat } from "../components/shared/LearnerUI";
import { course } from "../data";

const lessons = ["보고서의 목적과 구조", "데이터 정리하기", "핵심 메시지 작성", "최종 보고서 점검"];

export function CourseDetailPage() {
  return <>
    <LearnerHeader title="강좌 상세" backHref="/learner/explore" />
    <main className="pb-28">
      <Link href="/learner/feed" aria-label="무료 OT 재생" className="flex h-[230px] items-end bg-[linear-gradient(135deg,#273247,#141619_75%)] p-5"><span className="rounded-full bg-black/40 px-3 py-1.5 text-xs">무료 OT · 0:45 <span aria-hidden="true">▶</span></span></Link>
      <section className="space-y-3 px-5 py-5"><p className="text-[11px] text-muted">{course.category} · {course.topic} · {course.level}</p><h1 className="text-xl font-medium">{course.title}</h1><p className="text-xs leading-5 text-muted">{course.description}</p><div className="flex gap-2 pt-2"><Stat label="총 학습" value="19분" /><Stat label="강의" value="4개" /><Stat label="예상 완료" value="2일" /></div><p className="text-[10px] text-dim">하루 20분 목표 기준이에요</p></section>
      <section className="border-y border-line px-5 py-4"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-selected text-sm">이</span><div><p className="text-sm font-medium">{course.instructor}</p><p className="mt-1 text-[11px] text-muted">{course.bio}</p></div></div></section>
      <section className="px-5 py-5"><SectionTitle>커리큘럼</SectionTitle><p className="mb-3 text-[10px] text-muted">총 4강 · 학습 진도 29%</p><div className="space-y-2">{lessons.map((lesson, i) => <Card key={lesson} padding="sm" className="flex items-center gap-3 border border-line bg-panel"><span className="text-xs text-muted">{i === 0 ? "✓" : `${i + 1}강`}</span><span className="flex-1 text-xs">{lesson}</span><span className="text-[10px] text-muted">{i === 0 ? "완료" : `${4 + i}:00`}</span></Card>)}</div></section>
    </main>
    <div className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-[430px] items-center justify-between border-t border-line bg-panel px-5 py-3"><div><p className="text-[10px] text-muted">수강료</p><p className="mt-0.5 text-sm font-medium">29,000원</p></div><Link href="/learner/enroll/course-1"><Button>수강 신청하기</Button></Link></div>
  </>;
}
