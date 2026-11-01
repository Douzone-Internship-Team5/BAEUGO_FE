"use client";
import { useQuery } from "@tanstack/react-query";
import getSettlementAccount from "./getSettlementAccount";
import { userQueryKeys } from "./queryKeys";

export default function useSettlementAccount() {
  return useQuery({ queryKey: userQueryKeys.settlementAccount(), queryFn: ({ signal }) => getSettlementAccount(signal) });
}
