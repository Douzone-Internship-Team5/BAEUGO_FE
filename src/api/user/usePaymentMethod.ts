"use client";
import { useQuery } from "@tanstack/react-query";
import getPaymentMethod from "./getPaymentMethod";
import { userQueryKeys } from "./queryKeys";

export default function usePaymentMethod() {
  return useQuery({ queryKey: userQueryKeys.paymentMethod(), queryFn: ({ signal }) => getPaymentMethod(signal) });
}
