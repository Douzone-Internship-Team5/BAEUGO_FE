import { Suspense } from "react";
import { QuizResultPage } from "../../screens/QuizResultPage";
export default function Page() { return <Suspense fallback={<main className="p-8 text-center text-sm text-muted">수료 여부를 확인하는 중이에요.</main>}><QuizResultPage /></Suspense>; }
