import { Suspense } from "react";
import { CourseDetailPage } from "../../screens/CourseDetailPage";
export default function Page() { return <Suspense fallback={<main className="p-8 text-center text-sm text-muted">강좌 정보를 불러오는 중이에요.</main>}><CourseDetailPage /></Suspense>; }
