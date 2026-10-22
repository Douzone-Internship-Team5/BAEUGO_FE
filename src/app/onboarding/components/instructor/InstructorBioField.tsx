interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const InstructorBioField = ({ value, onChange }: Props) => (
  <label className="flex flex-col gap-2">
    <span className="flex justify-between text-[13px] text-muted">
      <span>
        약력 <span className="text-danger">*</span>
      </span>
      <span>{value.length} / 500</span>
    </span>
    <textarea
      rows={5}
      required
      minLength={5}
      maxLength={500}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="경력, 하고 있는 일, 가르칠 수 있는 것을 적어 주세요"
      className="resize-none rounded-[4px] border border-accent bg-panel px-3.5 py-3 text-sm leading-[1.6] text-text placeholder:text-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    />
    <span className={value.length > 0 && value.trim().length < 5 ? "text-xs text-danger" : "text-xs text-dim"}>
      {value.length > 0 && value.trim().length < 5 ? "5자 이상 적어 주세요." : "강좌 상세에 그대로 보여요."}
    </span>
  </label>
);
