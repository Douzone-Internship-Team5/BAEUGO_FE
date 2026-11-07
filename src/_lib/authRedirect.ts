/** 화면 묶음. public은 시작·로그인·회원가입처럼 로그인 전에 쓰는 화면이다. */
export type AuthArea = "public" | "onboarding" | "learner" | "instructor" | "admin";

/** GET /users/me와 로그인·회원가입 응답의 user가 공통으로 가진 값 */
type AuthUser = { accountType: string; activeMode?: string | null; onboarded?: boolean };

/** 로그인한 계정이 처음 가야 할 화면. 로그인·회원가입 직후 이동과 같은 기준이다. */
export const getHomePath = (user: AuthUser) => {
  if (user.accountType === "OPERATOR") return "/admin/courses";
  if (user.activeMode === "INSTRUCTOR") return user.onboarded ? "/instructor" : "/onboarding/instructor";
  if (user.activeMode === "LEARNER") return user.onboarded ? "/learner" : "/onboarding/learner";
  return "/onboarding";
};

/** 이 계정이 pathname에 들어갈 수 없으면 보낼 주소를, 들어갈 수 있으면 null을 돌려준다. */
export const getAuthRedirect = (area: AuthArea, pathname: string, user: AuthUser) => {
  const home = getHomePath(user);
  const isMember = user.accountType !== "OPERATOR";

  switch (area) {
    case "public":
      return home;
    case "admin":
      return isMember ? home : null;
    case "instructor":
      return isMember && user.activeMode === "INSTRUCTOR" && user.onboarded ? null : home;
    case "learner":
      return isMember && user.activeMode === "LEARNER" && user.onboarded ? null : home;
    case "onboarding": {
      if (!isMember || user.onboarded) return home;
      // 역할별 온보딩은 백엔드의 현재 모드에 저장되므로, 선택한 역할의 화면에만 들어갈 수 있다.
      if (pathname.startsWith("/onboarding/learner")) return user.activeMode === "LEARNER" ? null : "/onboarding";
      if (pathname.startsWith("/onboarding/instructor")) return user.activeMode === "INSTRUCTOR" ? null : "/onboarding";
      return null;
    }
  }
};
