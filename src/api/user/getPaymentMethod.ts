import api from "@/_lib/fetcher";
import type { DemoLabelDto } from "@/types/user";

export default async function getPaymentMethod(signal?: AbortSignal) {
  const response = await api.get<DemoLabelDto>({ endpoint: "/users/me/payment-method", signal });
  if (!response) throw new Error("결제수단 응답이 비어 있습니다.");
  return response.data;
}
