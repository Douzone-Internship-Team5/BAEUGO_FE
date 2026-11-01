"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updatePaymentMethod from "./updatePaymentMethod";
import { userQueryKeys } from "./queryKeys";
import type { DemoLabelRequest } from "@/types/user";

export default function useUpdatePaymentMethod() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (body: DemoLabelRequest) => updatePaymentMethod(body), onSuccess: async () => Promise.all([client.invalidateQueries({ queryKey: userQueryKeys.paymentMethod() }), client.invalidateQueries({ queryKey: userQueryKeys.me() })]) });
}
