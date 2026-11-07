import { getHomePath } from "@/_lib/authRedirect";
import { useAuthStore } from "@/app/login/store/useAuthStore";
import type { LoginResponseData } from "@/types/api";

/** 로그인·회원가입 응답의 토큰과 사용자 정보를 저장하고, 이 계정이 처음 갈 화면 주소를 돌려준다. */
export const saveLoginSession = ({ accessToken, user }: LoginResponseData) => {
  const activeMode = user.activeMode ?? user.role ?? null;
  useAuthStore.getState().setLoginState(true, accessToken, "");
  useAuthStore.getState().setUser({
    id: String(user.id),
    email: user.email,
    name: user.name,
    profile_image: "",
    activeMode,
  });
  return getHomePath({ accountType: user.accountType, activeMode, onboarded: user.onboarded ?? false });
};
