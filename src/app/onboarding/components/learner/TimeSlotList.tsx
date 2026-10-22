import { useState } from "react";
import type { TimeSlot } from "../../data/options";

interface Props {
  slots: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
}

export const TimeSlotList = ({ slots, onChange }: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const addSlot = () => {
    if (slots.length >= 5 || !start || !end || start >= end) return;
    onChange([
      ...slots,
      {
        id: `${Date.now()}`,
        start,
        end,
        tag: "직접 설정",
      },
    ]);
    setIsAdding(false);
  };

  return (
    <section
      className="flex flex-col gap-3"
      aria-labelledby="time-slot-heading"
    >
      <h2 id="time-slot-heading" className="text-[15px] font-medium">
        주로 배우는 시간{" "}
        <span className="text-xs font-normal text-muted">선택</span>
      </h2>
      <div className="flex flex-col gap-2">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="flex h-[52px] items-center gap-2.5 rounded-[4px] bg-panel pr-1.5 pl-4"
          >
            <span className="flex-1 text-[15px]">
              {slot.start} <span className="text-dim">–</span> {slot.end}
            </span>
            <span className="text-xs text-muted">{slot.tag}</span>
            <button
              type="button"
              aria-label={`${slot.start} 시간대 삭제`}
              onClick={() => onChange(slots.filter(({ id }) => id !== slot.id))}
              className="flex size-11 cursor-pointer items-center justify-center text-muted hover:text-text"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {isAdding ? (
        <div className="flex flex-col gap-3 rounded-[4px] border border-line p-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-xs text-muted">
              시작
              <input
                type="time"
                value={start}
                onChange={(event) => setStart(event.target.value)}
                className="h-10 rounded-[4px] border border-line-strong bg-bg px-2 text-sm text-text"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs text-muted">
              종료
              <input
                type="time"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                className="h-10 rounded-[4px] border border-line-strong bg-bg px-2 text-sm text-text"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 text-sm">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="cursor-pointer px-3 py-2 text-muted"
            >
              취소
            </button>
            <button
              type="button"
              onClick={addSlot}
              disabled={!start || !end || start >= end || slots.length >= 5}
              className="cursor-pointer px-3 py-2 font-medium text-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              시간 추가
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          disabled={slots.length >= 5}
          className="h-12 cursor-pointer rounded-[4px] border border-dashed border-line-focus text-[13px] text-text-sub disabled:cursor-not-allowed disabled:opacity-40"
        >
          + 시간대 추가
        </button>
      )}
    </section>
  );
};
