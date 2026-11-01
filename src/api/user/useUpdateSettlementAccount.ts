"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateSettlementAccount from "./updateSettlementAccount";
import { userQueryKeys } from "./queryKeys";
import type { DemoLabelRequest } from "@/types/user";

export default function useUpdateSettlementAccount() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (body: DemoLabelRequest) => updateSettlementAccount(body), onSuccess: async () => Promise.all([client.invalidateQueries({ queryKey: userQueryKeys.settlementAccount() }), client.invalidateQueries({ queryKey: userQueryKeys.me() })]) });
}
