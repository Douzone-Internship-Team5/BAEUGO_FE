"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button, Card } from "@/components/common";
import { getErrorMessage } from "@/_lib/fetcher";
import useMe from "@/api/user/useMe";
import useChangePassword from "@/api/user/useChangePassword";
import useUpdateProfileImage from "@/api/user/useUpdateProfileImage";

/** 수강자·강사 계정 설정에서 함께 쓰는 입력 칸 스타일 */
export const accountInputClass = "h-11 w-full rounded-[4px] border border-line bg-panel px-3 text-xs text-text placeholder:text-dim focus:border-line-focus focus:outline-none";
const inputClass = accountInputClass;

export function ProfileImageSection() {
  const me = useMe();
  const update = useUpdateProfileImage();
  const name = me.data?.name?.trim() || "김배우";
  const imageUrl = update.data?.profileImageUrl ?? me.data?.profileImageUrl;
  const presets = [1, 2, 3, 4];
  const selectedPreset = Number((update.data?.profileImageKey ?? me.data?.profileImageKey)?.match(/presets\/(\d+)\.png$/)?.[1]);
  return <SettingsCard title="프로필 사진">
    <div className="flex items-center gap-4">
      {imageUrl
        ? <span role="img" aria-label="프로필 사진" className="size-14 shrink-0 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${imageUrl}")` }} />
        : <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-selected text-lg">{name.slice(0, 1)}</span>}
      <label className="cursor-pointer rounded-[4px] border border-line px-3 py-2 text-xs transition hover:border-line-focus">
        {update.isPending ? "올리는 중…" : "사진 변경"}
        <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={update.isPending} onChange={(event) => { const file = event.target.files?.[0]; if (file) update.mutate({ file }); event.target.value = ""; }} />
      </label>
    </div>
    <p className="mt-4 text-xs font-medium">기본 프로필</p>
    <div className="mt-2 flex gap-3" role="group" aria-label="기본 프로필 선택">
      {presets.map((presetId) => <button key={presetId} type="button" aria-label={`기본 프로필 ${presetId}번`} aria-pressed={selectedPreset === presetId} disabled={update.isPending} onClick={() => update.mutate({ presetId })} className={`size-14 overflow-hidden rounded-full border-2 transition ${selectedPreset === presetId ? "border-accent ring-2 ring-accent/20" : "border-line hover:border-line-focus"}`}>
        <span role="img" aria-label={`프로필 ${presetId}`} className="block size-full bg-cover bg-center" style={{ backgroundImage: `url("/api/v1/media/profiles/presets/${presetId}.png")` }} />
      </button>)}
    </div>
    <p className="mt-3 text-[10px] text-muted">PNG, JPG, WEBP 사진을 올리거나 기본 프로필을 선택할 수 있어요.</p>
    <SettingsStatus error={update.error} success={update.isSuccess ? "프로필 사진을 변경했어요." : null} />
  </SettingsCard>;
}

export function PasswordSection() {
  const change = useChangePassword();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const mismatch = form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword;
  const newPasswordBytes = new TextEncoder().encode(form.newPassword).length;
  const passwordRuleInvalid = form.newPassword.length > 0 && (
    form.newPassword.length < 8 || !/[A-Za-z]/.test(form.newPassword) || !/[0-9]/.test(form.newPassword)
  );
  const passwordTooLong = newPasswordBytes > 72;
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (mismatch) return;
    change.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword }, { onSuccess: () => setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }) });
  };
  return <SettingsCard title="비밀번호 변경">
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <input type="password" autoComplete="current-password" required placeholder="현재 비밀번호" value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} className={inputClass} />
      <input type="password" autoComplete="new-password" required placeholder="새 비밀번호 (8자 이상, 영문·숫자 포함)" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} className={inputClass} />
      <input type="password" autoComplete="new-password" required placeholder="새 비밀번호 확인" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} className={inputClass} />
      {passwordRuleInvalid && <p className="text-[10px] text-danger">새 비밀번호는 8자 이상이며 영문과 숫자를 포함해야 해요.</p>}
      {passwordTooLong && <p className="text-[10px] text-danger">새 비밀번호는 한글·영문을 포함해 UTF-8 기준 72바이트 이하여야 해요.</p>}
      {mismatch && <p className="text-[10px] text-danger">새 비밀번호가 일치하지 않아요.</p>}
      <Button type="submit" fullWidth disabled={change.isPending || mismatch || passwordRuleInvalid || passwordTooLong}>{change.isPending ? "변경 중…" : "비밀번호 변경"}</Button>
    </form>
    <SettingsStatus error={change.error} success={change.isSuccess ? "비밀번호를 변경했어요." : null} />
  </SettingsCard>;
}

export function SettingsCard({ title, children }: { title: string; children: ReactNode }) {
  return <Card padding="md" className="border border-line bg-panel"><h2 className="mb-3 text-sm font-medium">{title}</h2>{children}</Card>;
}

export function SettingsStatus({ error, success }: { error: unknown; success: string | null }) {
  if (error) return <p role="alert" className="mt-3 text-xs text-danger">{getErrorMessage(error)}</p>;
  if (success) return <p role="status" className="mt-3 text-xs text-success">{success}</p>;
  return null;
}
