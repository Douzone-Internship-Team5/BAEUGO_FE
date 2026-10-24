interface Props {
  open: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const StartEditingConfirmDialog = ({
  open,
  isPending,
  onCancel,
  onConfirm,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-editing-title"
        aria-describedby="start-editing-description"
        className="w-full max-w-sm rounded-[6px] border border-line bg-panel p-5 shadow-xl"
      >
        <h2 id="start-editing-title" className="text-base font-semibold">
          강좌 수정을 시작할까요?
        </h2>
        <p id="start-editing-description" className="mt-3 text-xs leading-5 text-muted">
          수정 중에는 강좌가 수강자에게 공개되지 않습니다. 수정 후 공개 조건 6개를 모두
          충족하면 다시 공개할 수 있습니다.
        </p>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="h-10 flex-1 cursor-pointer rounded-[4px] border border-line-strong text-xs text-text-sub disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="h-10 flex-1 cursor-pointer rounded-[4px] bg-accent text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "전환 중…" : "수정 시작"}
          </button>
        </div>
      </section>
    </div>
  );
};
