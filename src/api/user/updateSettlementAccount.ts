import api from "@/_lib/fetcher";
import type { DemoLabelDto, DemoLabelRequest } from "@/types/user";

export default async function updateSettlementAccount(body: DemoLabelRequest) {
  const response = await api.put<DemoLabelDto>({ endpoint: "/users/me/settlement-account", body: { ...body } });
  if (!response) throw new Error("정산 계좌 변경 응답이 비어 있습니다.");
  return response.data;
}
