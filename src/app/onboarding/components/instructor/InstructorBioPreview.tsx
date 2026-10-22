interface Props {
  job: string;
  topics: string[];
  bio: string;
  instructorName?: string;
}

export const InstructorBioPreview = ({
  job,
  topics,
  bio,
  instructorName = "내 이름",
}: Props) => (
  <section className="flex flex-col gap-2.5" aria-labelledby="instructor-preview-heading">
    <h2 id="instructor-preview-heading" className="text-xs font-medium tracking-[1px] text-muted">
      수강자에게 이렇게 보여요
    </h2>
    <div className="flex items-start gap-3.5 rounded-[4px] border border-line p-[18px]">
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-base font-light"
      >
        {instructorName.slice(0, 1)}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="text-[15px] font-medium">
          {instructorName} <span className="text-xs font-normal text-accent">강사</span>
        </div>
        <div className="text-xs text-muted">
          {job}
          {topics.length > 0 && ` · ${topics.join(" · ")}`}
        </div>
        <p className="m-0 text-[13px] leading-[1.6] text-text-sub">
          {bio || "약력을 입력하면 이곳에 표시돼요."}
        </p>
      </div>
    </div>
  </section>
);
