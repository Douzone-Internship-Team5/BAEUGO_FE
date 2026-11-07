"use client";

import { useState } from "react";
import { Button } from "@/components/common";
import { accountInputClass as inputClass, PasswordSection, ProfileImageSection, SettingsCard, SettingsStatus } from "@/components/account/AccountSections";
import usePaymentMethod from "@/api/user/usePaymentMethod";
import useUpdatePaymentMethod from "@/api/user/useUpdatePaymentMethod";
import { LearnerHeader } from "../components/shared/LearnerHeader";

export function AccountSettingsPage() {
  return <>
    <LearnerHeader title="계정 설정" backHref="/learner/mypage" />
    <main className="space-y-4 px-5 pb-8 pt-4">
      <ProfileImageSection />
      <PasswordSection />
      <PaymentMethodSection />
    </main>
  </>;
}

function PaymentMethodSection() {
  const payment = usePaymentMethod();
  const update = useUpdatePaymentMethod();
  const [label, setLabel] = useState<string | null>(null);
  const value = label ?? payment.data?.label ?? "";
  return <SettingsCard title="결제수단">
    <form onSubmit={(event) => { event.preventDefault(); update.mutate({ label: value.trim() }, { onSuccess: () => setLabel(null) }); }} className="space-y-2.5">
      <input required maxLength={50} placeholder="예: 데모카드 1234" value={value} onChange={(event) => setLabel(event.target.value)} className={inputClass} />
      <p className="text-[10px] text-muted">데모용 결제수단 이름이에요. 실제 카드 번호는 입력하지 마세요.</p>
      <Button type="submit" fullWidth variant="outline" disabled={update.isPending || payment.isLoading || !value.trim()}>{update.isPending ? "저장 중…" : "결제수단 저장"}</Button>
    </form>
    <SettingsStatus error={update.error ?? payment.error} success={update.isSuccess ? "결제수단을 저장했어요." : null} />
  </SettingsCard>;
}
