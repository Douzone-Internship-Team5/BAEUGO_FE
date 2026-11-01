import { Suspense } from "react";
import { QuizPage } from "../../screens/QuizPage";
export default function Page() { return <Suspense fallback={<main className="p-8 text-center text-sm text-muted">퀴즈를 불러오는 중이에요.</main>}><QuizPage /></Suspense>; }
