/** Standard API success envelope defined by the backend contract. */
export interface ApiResponse<TData> {
  data: TData;
}

export interface ApiErrorDetail<TFields = Record<string, string[]>> {
  code: string;
  message: string;
  fields?: TFields;
}

export interface ApiErrorResponse<TFields = Record<string, string[]>> {
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
