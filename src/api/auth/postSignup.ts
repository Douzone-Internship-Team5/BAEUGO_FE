import api from "@/_lib/fetcher";
import type { LoginResponseData } from "@/types/api";

export type SignupRole = "LEARNER" | "INSTRUCTOR";

export interface SignupRequest {
  email: string;
  password: string;
  role?: SignupRole;
}

export default async function postSignup(request: SignupRequest) {
  const response = await api.post<LoginResponseData>({
    endpoint: "/auth/signup",
    authorization: null,
    body: {
      email: request.email,
      password: request.password,
      ...(request.role ? { role: request.role } : {}),
    },
  });

  if (!response) throw new Error("회원가입 응답이 비어 있습니다.");
  return response.data;
}
