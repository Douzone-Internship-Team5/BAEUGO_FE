"use client";

import { useState } from "react";
import { getErrorMessage } from "@/_lib/fetcher";
import useSettlementAccount from "@/api/user/useSettlementAccount";
import useUpdateSettlementAccount from "@/api/user/useUpdateSettlementAccount";

export const SettlementAccountSection = () => {
  const account = useSettlementAccount();
  const update = useUpdateSettlementAccount();
  const [label, setLabel] = useState<string | null>(null);
  const value = label ?? account.data?.label ?? "";
  const error = update.error ?? account.error;
  return <section className="mt-8 border-t border-line pt-6">
    <h2 className="text-sm font-medium">정산 계좌</h2>
    <p className="mt-1 text-[10px] text-muted">데모용 계좌 이름이에요. 실제 계좌 번호는 입력하지 마세요.</p>
    <form onSubmit={(event) => { event.preventDefault(); update.mutate({ label: value.trim() }, { onSuccess: () => setLabel(null) }); }} className="mt-3 flex gap-2">
      <input required maxLength={50} placeholder="예: 데모은행 1234" value={value} onChange={(event) => setLabel(event.target.value)} className="h-11 min-w-0 flex-1 rounded-[4px] border border-line bg-panel px-3 text-xs text-text placeholder:text-dim focus:border-line-focus focus:outline-none" />
      <button type="submit" disabled={update.isPending || account.isLoading || !value.trim()} className="h-11 shrink-0 cursor-pointer rounded-[4px] border border-line px-4 text-xs transition hover:border-line-focus disabled:cursor-not-allowed disabled:opacity-50">{update.isPending ? "저장 중…" : "저장"}</button>
    </form>
    {error ? <p role="alert" className="mt-2 text-xs text-danger">{getErrorMessage(error)}</p> : update.isSuccess && <p role="status" className="mt-2 text-xs text-success">정산 계좌를 저장했어요.</p>}
  </section>;
};
