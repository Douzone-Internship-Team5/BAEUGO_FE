"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function OnboardingQueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { mutations: { retry: 0 } } }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
