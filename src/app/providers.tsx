// app/providers.tsx
"use client";

import { UserProvider } from "@/contexts/useUser";
import api from "@/services/api";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookie from "js-cookie";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const authToken = Cookie.get("auth_token");
  api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </UserProvider>
  );
}
