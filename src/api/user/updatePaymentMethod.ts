import api from "@/_lib/fetcher";
import type { DemoLabelDto, DemoLabelRequest } from "@/types/user";

export default async function updatePaymentMethod(body: DemoLabelRequest) {
  const response = await api.put<DemoLabelDto>({ endpoint: "/users/me/payment-method", body: { ...body } });
  if (!response) throw new Error("결제수단 변경 응답이 비어 있습니다.");
  return response.data;
}
