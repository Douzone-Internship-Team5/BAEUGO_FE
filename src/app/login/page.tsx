import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoginPage } from "./components/LoginPage";

export const metadata: Metadata = {
  title: "로그인",
  description: "배우고 계정에 로그인합니다.",
};

export default function Page() {
  return (
    <AuthGuard area="public">
      <LoginPage />
    </AuthGuard>
  );
}
