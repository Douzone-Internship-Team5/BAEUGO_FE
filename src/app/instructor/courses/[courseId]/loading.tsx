export default function InstructorCourseLoading() {
  return (
    <main
      className="mx-auto min-h-dvh max-w-4xl animate-pulse px-4 pt-8 md:px-8"
      role="status"
      aria-label="강좌 화면 불러오는 중"
    >
      <div className="h-3 w-24 rounded bg-selected" />
      <div className="mt-4 h-7 max-w-md rounded bg-selected" />
      <div className="mt-2 h-3 w-48 rounded bg-selected" />
      <div className="mt-7 h-48 rounded border border-line bg-panel" />
      <div className="mt-7 h-5 w-32 rounded bg-selected" />
      <div className="mt-3 h-32 rounded border border-line bg-panel" />
      <span className="sr-only">강좌 상세를 불러오고 있습니다.</span>
    </main>
  );
}
