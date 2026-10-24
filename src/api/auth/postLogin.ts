import api from "@/_lib/fetcher";
import type { LoginResponseData } from "@/types/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export default async function postLogin(credentials: LoginCredentials) {
  const response = await api.post<LoginResponseData>({
    endpoint: "/auth/login",
    authorization: null,
    body: { email: credentials.email, password: credentials.password },
  });

  if (!response) throw new Error("로그인 응답이 비어 있습니다.");
  return response.data;
}
