"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import DevRouteWarmer from "@/components/DevRouteWarmer";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 45_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: { retry: 0 },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <DevRouteWarmer />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
