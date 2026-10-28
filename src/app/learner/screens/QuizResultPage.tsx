import Link from "next/link";
import { Button, Card } from "@/components/common";
import { ProgressBar } from "../components/shared/LearnerUI";

export function QuizResultPage() {
  return <main className="flex min-h-dvh flex-col px-5 pb-6 pt-6">
    <header className="text-right"><Link href="/learner" className="text-xs text-muted">닫기 ×</Link></header>
    <div className="py-7 text-center"><span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success-soft-bg text-2xl text-success">✓</span><p className="mt-4 text-xs text-accent">코스 종합 퀴즈 결과</p><h1 className="mt-2 text-2xl font-medium">거의 다 왔어요!</h1><p className="mt-2 text-xs text-muted">오답 2개만 복습하면 수료할 수 있어요.</p></div>
    <div className="flex gap-2"><Card padding="md" className="flex-1 border border-line bg-panel"><p className="text-[10px] text-muted">맞힌 문제</p><p className="mt-2 text-lg">8 / 10</p></Card><Card padding="md" className="flex-1 border border-line bg-panel"><p className="text-[10px] text-muted">진도</p><p className="mt-2 text-lg">100%</p></Card><Card padding="md" className="flex-1 border border-line bg-panel"><p className="text-[10px] text-muted">남은 오답</p><p className="mt-2 text-lg">2개</p></Card></div>
    <section className="mt-7"><h2 className="mb-3 text-sm font-medium">복습할 문제</h2><div className="space-y-2">{["보고서의 목적을 정의할 때 포함할 내용은?", "핵심 메시지를 배치하기 좋은 위치는?"] .map((question, index) => <Card key={question} padding="md" className="border border-line bg-panel"><p className="text-[10px] text-muted">Q{index + 2} · 오답</p><p className="mt-2 text-xs">{question}</p><ProgressBar value={100} className="mt-3" /></Card>)}</div></section>
    <div className="mt-auto space-y-2 pt-6"><Link href="/learner/library/quiz"><Button fullWidth>오답노트에서 다시 풀기</Button></Link><Link href="/learner"><Button fullWidth variant="outline">홈으로</Button></Link></div>
  </main>;
}
