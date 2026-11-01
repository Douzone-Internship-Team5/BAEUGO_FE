"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/common";
import api from "@/_lib/fetcher";
import useMyEnrollments from "@/api/learning/useMyEnrollments";
import useMyLikes from "@/api/learning/useMyLikes";
import type { QuizNotesDto } from "@/types/learning";
import { ProgressBar } from "./LearnerUI";

type Tab = "courses" | "likes" | "quiz";

export function LibraryTabContent({ active }: { active: Tab }) {
  if (active === "courses") return <Courses />;
  if (active === "likes") return <Likes />;
  return <QuizNotes />;
}

function CountFilters<T extends string>({ options, value, onChange }: { options: Array<{ value: T; label: string }>; value: T; onChange: (value: T) => void }) {
  return <div className="mt-4 flex gap-2 overflow-x-auto">{options.map((option) => <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${value === option.value ? "border-accent text-accent" : "border-line text-muted"}`}>{option.label}</button>)}</div>;
}

function Courses() {
  const [filter, setFilter] = useState<"ALL" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const query = useMyEnrollments();
  const items = query.data?.enrollments ?? [];
  const counts = query.data?.counts;
  const filteredItems = items.filter((course) => filter === "ALL" || course.status === filter);
  return <><CountFilters value={filter} onChange={setFilter} options={[{ value: "ALL", label: `전체 ${counts?.all ?? 0}` }, { value: "IN_PROGRESS", label: `수강 중 ${counts?.inProgress ?? 0}` }, { value: "COMPLETED", label: `수료 ${counts?.completed ?? 0}` }]} /><div className="mt-4 space-y-3">{filteredItems.map((course) => <Card key={course.enrollmentId} padding="md" className="border border-line bg-panel"><div className="flex items-center justify-between"><span className="text-[10px] text-accent">{course.status === "COMPLETED" ? "수료" : "수강 중"}</span><span className="text-[10px] text-muted">{course.statusMessage}</span></div><h2 className="mt-2 text-sm font-medium">{course.title}</h2><div className="mt-4 flex items-center gap-3"><ProgressBar value={course.progressPercent} className="flex-1" /><span className="text-[10px] text-muted">{course.progressPercent}%</span></div><p className="mt-3 text-right"><Link href={`/learner/courses/${course.courseId}`} className="text-xs text-accent">{course.status === "COMPLETED" ? "복습하기" : "이어서 학습"} →</Link></p></Card>)}{query.isLoading && <p className="py-8 text-center text-xs text-muted">내 강좌를 불러오는 중이에요.</p>}{!query.isLoading && filteredItems.length === 0 && <p className="py-8 text-center text-xs text-muted">조건에 맞는 강좌가 없습니다.</p>}</div></>;
}

function Likes() {
  const [filter, setFilter] = useState<"ALL" | "OT" | "LESSON">("ALL");
  const query = useMyLikes();
  const videos = query.data?.likedVideos ?? [];
  const filteredVideos = videos.filter((video) => filter === "ALL" || video.videoType === filter);
  return <><CountFilters value={filter} onChange={setFilter} options={[{ value: "ALL", label: `전체 ${videos.length}` }, { value: "OT", label: `무료 OT ${videos.filter((item) => item.videoType === "OT").length}` }, { value: "LESSON", label: `강의 ${videos.filter((item) => item.videoType === "LESSON").length}` }]} /><div className="mt-4 space-y-4">{filteredVideos.map((video) => <Link key={video.videoId} href={`/learner/learn/${video.videoId}`} className="block"><Card padding="none" className="flex overflow-hidden border border-line bg-panel"><div className="w-[112px] shrink-0 bg-[linear-gradient(135deg,#293247,#16181b)]" /><div className="min-w-0 flex-1 p-3"><div className="flex justify-between text-[10px] text-muted"><span>{video.videoType === "OT" ? "무료 OT" : "강의"}</span><span>{Math.floor(video.durationSeconds / 60)}:{String(video.durationSeconds % 60).padStart(2, "0")}</span></div><h2 className="mt-2 text-xs font-medium leading-5">{video.videoTitle}</h2><p className="mt-1 truncate text-[10px] text-muted">{video.courseTitle}</p></div></Card></Link>)}{query.isLoading && <p className="py-8 text-center text-xs text-muted">좋아요 목록을 불러오는 중이에요.</p>}{!query.isLoading && filteredVideos.length === 0 && <p className="py-8 text-center text-xs text-muted">조건에 맞는 영상이 없습니다.</p>}</div></>;
}

function QuizNotes() {
  const [filter, setFilter] = useState<"ALL" | "REVIEW_NEEDED" | "CORRECT">("ALL");
  const query = useQuery({ queryKey: ["learning", "quiz-notes", filter], queryFn: async ({ signal }) => { const response = await api.get<QuizNotesDto>({ endpoint: `/me/quiz-notes?status=${filter}`, signal }); if (!response) throw new Error("오답노트 응답이 비어 있습니다."); return response.data; } });
  const data = query.data;
  return <><CountFilters value={filter} onChange={setFilter} options={[{ value: "ALL", label: `전체 ${data?.counts.all ?? 0}` }, { value: "REVIEW_NEEDED", label: `복습 필요 ${data?.counts.reviewNeeded ?? 0}` }, { value: "CORRECT", label: `해결 ${data?.counts.correct ?? 0}` }]} />{(data?.quizNotes ?? []).map((note) => <Card key={note.recordId} padding="md" className="mt-3 border border-line bg-panel"><div className="flex justify-between text-[10px] text-muted"><span>{note.courseTitle} · {note.quizType === "UNIT" ? "단위 퀴즈" : "최종 퀴즈"}</span><span>{note.wrongCount}번 틀림</span></div><p className="mt-3 text-xs leading-5">{note.questionContent}</p><div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-muted">{new Date(note.lastAnsweredAt).toLocaleDateString("ko-KR")}</span><Link href={`/learner/quiz/${note.courseId}?attemptType=WRONG_REVIEW&questionId=${note.questionId}`} className="text-xs text-accent">다시 풀기</Link></div></Card>)}{query.isLoading && <p className="py-8 text-center text-xs text-muted">오답노트를 불러오는 중이에요.</p>}{!query.isLoading && data?.quizNotes.length === 0 && <p className="py-8 text-center text-xs text-muted">조건에 맞는 퀴즈가 없습니다.</p>}</>;
}
