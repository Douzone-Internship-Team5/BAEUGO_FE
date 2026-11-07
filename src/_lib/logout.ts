import api from "@/_lib/fetcher";
import { useAuthStore } from "@/app/login/store/useAuthStore";

/** 서버에 로그아웃을 알리고(JWT라 확인만 함) 저장된 로그인 정보를 지운다. API 실패와 상관없이 로컬 세션은 비운다. */
export const logout = async () => {
  try {
    if (useAuthStore.getState().accessToken) await api.post({ endpoint: "/auth/logout" });
  } catch {
    // Clear the local session even if the API is unavailable.
  } finally {
    useAuthStore.getState().setLoginState(false, "", "");
    useAuthStore.getState().setUser(null);
    window.localStorage.removeItem("accessToken");
  }
};
