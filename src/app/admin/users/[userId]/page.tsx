"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import useAdminUser from "@/api/admin/users/useAdminUser";
import toAdminUserDetail from "@/api/admin/users/toAdminUserDetail";
import { MemberDetailPage } from "../../components/users/MemberDetailPage";

export default function AdminUserDetailRoute() {
  const params = useParams<{ userId: string }>();
  const userId = Number(params.userId);
  const query = useAdminUser(userId);

  if (query.isPending) return <DetailMessage>회원 정보를 불러오는 중…</DetailMessage>;
  if (query.isError) return <DetailMessage isError>회원 정보를 불러오지 못했습니다. {query.error.message}</DetailMessage>;
  return <MemberDetailPage detail={toAdminUserDetail(query.data)} />;
}

interface DetailMessageProps {
  children: ReactNode;
  isError?: boolean;
}

const DetailMessage = ({ children, isError = false }: DetailMessageProps) => (
  <p role={isError ? "alert" : "status"} className={`rounded-[4px] border p-5 text-sm ${isError ? "border-danger-line bg-danger-bg text-danger" : "border-line bg-panel text-muted"}`}>
    {children}
  </p>
);
