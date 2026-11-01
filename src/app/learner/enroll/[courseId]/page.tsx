import { Suspense } from "react";
import { EnrollmentPage } from "../../screens/EnrollmentPage";
export default function Page() { return <Suspense fallback={<main className="p-8 text-center text-sm text-muted">수강 정보를 불러오는 중이에요.</main>}><EnrollmentPage /></Suspense>; }
