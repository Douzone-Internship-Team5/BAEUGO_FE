"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ApiError } from "@/_lib/fetcher";
import { getAuthRedirect, type AuthArea } from "@/_lib/authRedirect";
import getMe from "@/api/user/getMe";
import { useAuthStore } from "@/app/login/store/useAuthStore";
import type { MeDto } from "@/types/user";

interface Props {
  area: AuthArea;
  children: ReactNode;
}

type CheckResult = { key: string; me: MeDto | null; failed: boolean };

const subscribeNothing = () => () => {};

/**
 * 주소를 직접 입력해 들어와도 로그인 상태와 계정의 역할·온보딩 여부를 확인해 맞는 화면으로 보낸다.
 * 토큰이 브라우저 저장소에만 있어 서버(미들웨어)에서는 확인할 수 없으므로 클라이언트에서 확인한다.
 */
export const AuthGuard = ({ area, children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  // 서버 렌더에는 저장된 토큰이 없으므로, 브라우저에서 저장소를 읽은 뒤에 판단해 하이드레이션 불일치를 막는다.
  const isClient = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const storedToken = useAuthStore((state) => state.accessToken);
  const accessToken = isClient ? storedToken : "";
  const [result, setResult] = useState<CheckResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // 온보딩은 화면마다 역할 선택·저장으로 계정 상태가 바뀌므로 경로가 바뀔 때마다 다시 확인한다.
  const checkKey = `${accessToken}|${area === "onboarding" ? pathname : ""}|${retryCount}`;
  const isReady = result?.key === checkKey;
  const redirectTo = !isClient
    ? null
    : !accessToken
    ? area === "public" ? null : "/login"
    : isReady && result.me ? getAuthRedirect(area, pathname, result.me) : null;

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    getMe(controller.signal)
      .then((me) => {
        const { user, setUser } = useAuthStore.getState();
        setUser({
          id: String(me.id),
          email: me.email,
          name: me.name,
          profile_image: user?.profile_image ?? "",
          activeMode: (me.activeMode as "LEARNER" | "INSTRUCTOR" | null) ?? null,
        });
        setResult({ key: checkKey, me, failed: false });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        // 401이면 요청기가 로그인 정보를 지우고, accessToken이 비면서 로그인 화면으로 보낸다.
        if (error instanceof ApiError && error.status === 401) return;
        setResult({ key: checkKey, me: null, failed: true });
      });
    return () => controller.abort();
  }, [accessToken, checkKey]);

  useEffect(() => {
    if (redirectTo && redirectTo !== pathname) router.replace(redirectTo);
  }, [pathname, redirectTo, router]);

  if (!isClient) return <GuardFallback />;
  if (!accessToken) return area === "public" ? children : <GuardFallback />;
  if (!isReady || redirectTo) return <GuardFallback />;
  if (result.failed) {
    // 공개 화면은 계정 확인에 실패해도 그대로 쓸 수 있게 둔다.
    if (area === "public") return children;
    return <GuardFallback message="로그인 상태를 확인하지 못했어요." onRetry={() => setRetryCount((count) => count + 1)} />;
  }
  return children;
};

interface GuardFallbackProps {
  message?: string;
  onRetry?: () => void;
}

const GuardFallback = ({ message, onRetry }: GuardFallbackProps) => (
  <div role={message ? "alert" : "status"} className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg text-sm text-muted">
    <p>{message ?? "로그인 상태를 확인하는 중…"}</p>
    {onRetry && (
      <button type="button" onClick={onRetry} className="cursor-pointer rounded-[4px] border border-line-strong px-3 py-2 text-xs text-text-sub transition hover:bg-selected">
        다시 시도
      </button>
    )}
  </div>
);
