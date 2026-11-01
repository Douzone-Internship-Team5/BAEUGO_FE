import api from "@/_lib/fetcher";
import type { DemoLabelDto } from "@/types/user";

export default async function getSettlementAccount(signal?: AbortSignal) {
  const response = await api.get<DemoLabelDto>({ endpoint: "/users/me/settlement-account", signal });
  if (!response) throw new Error("정산 계좌 응답이 비어 있습니다.");
  return response.data;
}
