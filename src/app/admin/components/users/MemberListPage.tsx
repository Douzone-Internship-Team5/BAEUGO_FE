"use client";

import Link from "next/link";
import { useState } from "react";
import useAdminUsers from "@/api/admin/users/useAdminUsers";
import type { AdminUser, MemberRole } from "../../data/users";

type RoleFilter = "ALL" | MemberRole;
const PAGE_SIZE = 5;

export const MemberListPage = () => {
  const [role, setRole] = useState<RoleFilter>("ALL");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const usersQuery = useAdminUsers({ q: query.trim() || undefined, role: role === "ALL" ? undefined : role, page, size: PAGE_SIZE });
  const users = usersQuery.data?.items.map((user) => ({
    ...user,
    accountType: "MEMBER" as const,
    role: user.role ?? user.activeMode ?? "LEARNER",
    activeMode: user.activeMode ?? user.role ?? "LEARNER",
  })) ?? [];
  const total = usersQuery.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = page;

  const updateFilter = (update: () => void) => {
    update();
    setPage(1);
  };

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-medium tracking-[1.5px] text-accent">MEMBER MANAGEMENT</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.5px]">회원 관리</h1>
          <p className="mt-2 text-sm text-muted">수강자와 강사의 계정 및 이용 현황을 확인합니다.</p>
        </div>
        <div className="flex items-center gap-2 rounded-[4px] border border-line bg-panel px-3.5 py-2.5 text-xs text-muted">
          전체 <strong className="ml-1 text-sm font-semibold text-text">{total}</strong>명
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[4px] border border-line bg-panel p-4 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">이름 또는 이메일 검색</span>
          <SearchIcon />
          <input
            value={query}
            onChange={(event) => updateFilter(() => setQuery(event.target.value))}
            placeholder="이름 또는 이메일 검색"
            maxLength={100}
            className="h-11 w-full rounded-[4px] border border-line-strong bg-bg pl-10 pr-3 text-sm text-text outline-none transition placeholder:text-dim focus:border-line-focus focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[10px] text-muted">
          역할
          <select
            value={role}
            onChange={(event) => updateFilter(() => setRole(event.target.value as RoleFilter))}
            className="h-11 min-w-40 cursor-pointer rounded-[4px] border border-line-strong bg-bg px-3 text-xs text-text outline-none focus:border-line-focus"
          >
            <option value="ALL">전체 역할</option>
            <option value="LEARNER">수강자</option>
            <option value="INSTRUCTOR">강사</option>
          </select>
        </label>
      </div>

      {usersQuery.isError ? (
        <p role="alert" className="rounded-[4px] border border-danger-line bg-danger-bg p-5 text-sm text-danger">회원 목록을 불러오지 못했습니다. {usersQuery.error.message}</p>
      ) : usersQuery.isPending ? (
        <div role="status" className="rounded-[4px] border border-line bg-panel p-12 text-center text-sm text-muted">회원 목록을 불러오는 중…</div>
      ) : <MemberTable users={users} />}

      <div className="flex flex-col gap-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {total === 0
            ? "검색 결과가 없습니다."
            : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, total)}명 표시 / 총 ${total}명`}
        </p>
        <div className="flex items-center gap-1" aria-label="페이지 이동">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
            className="flex size-9 cursor-pointer items-center justify-center rounded-[4px] border border-line text-text-sub hover:bg-selected disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="이전 페이지"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              aria-current={number === currentPage ? "page" : undefined}
              className={`flex size-9 cursor-pointer items-center justify-center rounded-[4px] border text-xs ${number === currentPage ? "border-accent bg-success-bg text-accent" : "border-line text-muted hover:bg-selected"}`}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={currentPage === pageCount}
            className="flex size-9 cursor-pointer items-center justify-center rounded-[4px] border border-line text-text-sub hover:bg-selected disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="다음 페이지"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

interface MemberTableProps {
  users: AdminUser[];
}

const MemberTable = ({ users }: MemberTableProps) => (
  <div className="overflow-hidden rounded-[4px] border border-line bg-panel">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-card text-[10px] font-medium tracking-[0.5px] text-muted">
            <th className="px-5 py-3.5">회원</th>
            <th className="px-4 py-3.5">역할</th>
            <th className="px-4 py-3.5">활성 모드</th>
            <th className="px-4 py-3.5">계정 상태</th>
            <th className="px-5 py-3.5 text-right">상세</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {users.map((user) => <MemberRow key={user.userId} user={user} />)}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-16 text-center text-sm text-muted">조건에 맞는 회원이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

interface MemberRowProps {
  user: AdminUser;
}

const MemberRow = ({ user }: MemberRowProps) => (
  <tr className="group transition-colors hover:bg-card/70">
    <td className="px-5 py-4">
      <Link href={`/admin/users/${user.userId}`} className="flex cursor-pointer items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-selected text-xs font-medium text-accent">
          {user.name.slice(0, 1)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[13px] font-medium text-text group-hover:text-accent">{user.name}</span>
          <span className="mt-1 truncate text-xs text-muted">{user.email}</span>
        </span>
      </Link>
    </td>
    <td className="px-4 py-4"><RoleBadge role={user.role} /></td>
    <td className="px-4 py-4 text-xs text-text-sub">{roleLabel(user.activeMode)}</td>
    <td className="px-4 py-4">
      <span className={`inline-flex items-center gap-1.5 text-xs ${user.isActive ? "text-success" : "text-muted"}`}>
        <span className={`size-1.5 rounded-full ${user.isActive ? "bg-success" : "bg-dim"}`} />
        {user.isActive ? "활성" : "비활성"}
      </span>
    </td>
    <td className="px-5 py-4 text-right">
      <Link href={`/admin/users/${user.userId}`} className="cursor-pointer text-xs text-muted transition hover:text-accent">상세 보기 →</Link>
    </td>
  </tr>
);

interface RoleBadgeProps {
  role: MemberRole;
}

const RoleBadge = ({ role }: RoleBadgeProps) => (
  <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[10px] ${role === "LEARNER" ? "bg-success-soft-bg text-success" : "bg-selected text-accent"}`}>
    {roleLabel(role)}
  </span>
);

const roleLabel = (role: MemberRole) => role === "LEARNER" ? "수강자" : "강사";

const SearchIcon = () => (
  <svg
    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dim"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="10.8" cy="10.8" r="6.8" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);
