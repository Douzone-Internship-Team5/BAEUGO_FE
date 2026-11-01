import { Suspense } from "react";
import { LearnerPlayer } from "../../screens/LearnerPlayer";
export default function Page() { return <Suspense fallback={<main className="p-8 text-center text-sm text-muted">영상을 불러오는 중이에요.</main>}><LearnerPlayer /></Suspense>; }
