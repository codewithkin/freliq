"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCe0x3WmFZfVtgd19HaVZSQmYuP1ZhSXxWdkFhXX9dcX1WQGhUVEB9XUs=",
);

function QueryClientProviderWrapper({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryClientProviderWrapper;
