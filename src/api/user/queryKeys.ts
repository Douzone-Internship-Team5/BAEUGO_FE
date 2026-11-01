export const userQueryKeys = {
  all: ["user"] as const,
  me: () => [...userQueryKeys.all, "me"] as const,
  paymentMethod: () => [...userQueryKeys.all, "payment-method"] as const,
  settlementAccount: () => [...userQueryKeys.all, "settlement-account"] as const,
};
