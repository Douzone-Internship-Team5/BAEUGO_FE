import { Suspense } from "react";
import { ContinueLearningPage } from "../../screens/ContinueLearningPage";
export default function Page() { return <Suspense fallback={<main className="p-8 text-center text-sm text-muted">마지막으로 학습한 곳을 찾는 중이에요.</main>}><ContinueLearningPage /></Suspense>; }
