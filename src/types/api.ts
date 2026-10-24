/** Standard API success envelope defined by the backend contract. */
export interface ApiResponse<TData> {
  data: TData;
}

/** 백엔드는 필드별 오류를 문자열 하나로 내려준다. 예: { "bio": "강사 약력은 5자 이상 입력해야 합니다." } */
export type ApiErrorFields = Record<string, string>;

export interface ApiErrorDetail<TFields = ApiErrorFields> {
  code: string;
  message: string;
  fields?: TFields;
  /** 강좌 공개 조건 미충족(PUBLISH_NOT_READY) 시 빠진 조건 코드 목록 */
  missing?: string[];
}

export interface ApiErrorResponse<TFields = ApiErrorFields> {
  error: ApiErrorDetail<TFields>;
}

/** The shape returned by POST /api/v1/auth/login. */
export interface LoginResponseData {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    accountType: "MEMBER" | "OPERATOR";
    role?: "LEARNER" | "INSTRUCTOR" | null;
    activeMode?: "LEARNER" | "INSTRUCTOR" | null;
    roles?: Array<"LEARNER" | "INSTRUCTOR">;
    onboarded?: boolean;
  };
}
