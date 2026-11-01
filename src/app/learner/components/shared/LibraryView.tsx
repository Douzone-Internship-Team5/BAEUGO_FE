import Link from "next/link";
import { Card } from "@/components/common";
import { BrandHeader } from "./LearnerHeader";
import { ProgressBar } from "./LearnerUI";
import useMyEnrollments from "@/api/learning/useMyEnrollments";
import useMyLikes from "@/api/learning/useMyLikes";
import { useQuery } from "@tanstack/react-query";
import api from "@/_lib/fetcher";
import type { QuizNotesDto } from "@/types/learning";

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
  const query = useMyEnrollments();
  const items = query.data?.enrollments ?? [];
  const counts = query.data?.counts;
  return <><CountFilters labels={[`전체 ${counts?.all ?? 0}`, `수강 중 ${counts?.inProgress ?? 0}`, `수료 ${counts?.completed ?? 0}`]} /><div className="mt-4 space-y-3">{items.map((course) => <Card key={course.enrollmentId} padding="md" className="border border-line bg-panel"><div className="flex items-center justify-between"><span className="text-[10px] text-accent">{course.status === "COMPLETED" ? "수료" : "수강 중"}</span><span className="text-[10px] text-muted">{course.statusMessage}</span></div><h2 className="mt-2 text-sm font-medium">{course.title}</h2><div className="mt-4 flex items-center gap-3"><ProgressBar value={course.progressPercent} className="flex-1" /><span className="text-[10px] text-muted">{course.progressPercent}%</span></div><p className="mt-3 text-right"><Link href={`/learner/courses/${course.courseId}`} className="text-xs text-accent">{course.status === "COMPLETED" ? "복습하기" : "이어서 학습"} →</Link></p></Card>)}{query.isLoading && <p className="py-8 text-center text-xs text-muted">내 강좌를 불러오는 중이에요.</p>}{!query.isLoading && items.length === 0 && <p className="py-8 text-center text-xs text-muted">수강 중인 강좌가 없습니다.</p>}</div></>;
}

function Likes() {
  const query = useMyLikes();
  const videos = query.data?.likedVideos ?? [];
  return <><CountFilters labels={[`전체 ${query.data?.totalCount ?? 0}`, `무료 OT ${videos.filter((item) => item.videoType === "OT").length}`, `강의 ${videos.filter((item) => item.videoType !== "OT").length}`]} /><div className="mt-4 space-y-3">{videos.map((video) => <Link key={video.videoId} href={`/learner/learn/${video.videoId}`}><Card padding="none" className="flex overflow-hidden border border-line bg-panel"><div className="w-[112px] shrink-0 bg-[linear-gradient(135deg,#293247,#16181b)]" /><div className="min-w-0 flex-1 p-3"><div className="flex justify-between text-[10px] text-muted"><span>{video.videoType === "OT" ? "무료 OT" : "강의"}</span><span>{Math.floor(video.durationSeconds / 60)}:{String(video.durationSeconds % 60).padStart(2, "0")}</span></div><h2 className="mt-2 text-xs font-medium leading-5">{video.videoTitle}</h2><p className="mt-1 truncate text-[10px] text-muted">{video.courseTitle}</p></div></Card></Link>)}{query.isLoading && <p className="py-8 text-center text-xs text-muted">좋아요 목록을 불러오는 중이에요.</p>}{!query.isLoading && videos.length === 0 && <p className="py-8 text-center text-xs text-muted">좋아요한 영상이 없습니다.</p>}</div></>;
}

function QuizNotes() {
  const query = useQuery({ queryKey: ["learning", "quiz-notes"], queryFn: async ({ signal }) => { const response = await api.get<QuizNotesDto>({ endpoint: "/me/quiz-notes", signal }); if (!response) throw new Error("오답노트 응답이 비어 있습니다."); return response.data; } });
  const data = query.data;
  return <><CountFilters labels={[`전체 ${data?.counts.all ?? 0}`, `복습 필요 ${data?.counts.reviewNeeded ?? 0}`, `해결 ${data?.counts.correct ?? 0}`]} />{(data?.quizNotes ?? []).map((note) => <Card key={note.recordId} padding="md" className="mt-3 border border-line bg-panel"><div className="flex justify-between text-[10px] text-muted"><span>{note.courseTitle} · {note.quizType === "UNIT" ? "단위 퀴즈" : "최종 퀴즈"}</span><span>{note.wrongCount}번 틀림</span></div><p className="mt-3 text-xs leading-5">{note.questionContent}</p><div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-muted">{new Date(note.lastAnsweredAt).toLocaleDateString("ko-KR")}</span><Link href={`/learner/quiz/${note.courseId}?attemptType=WRONG_REVIEW&questionId=${note.questionId}`} className="text-xs text-accent">다시 풀기</Link></div></Card>)}{query.isLoading && <p className="py-8 text-center text-xs text-muted">오답노트를 불러오는 중이에요.</p>}{!query.isLoading && data?.quizNotes.length === 0 && <p className="py-8 text-center text-xs text-muted">복습할 퀴즈가 없습니다.</p>}</>;
}
