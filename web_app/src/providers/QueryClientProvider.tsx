"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NNaF5cWWNCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXpec3RcQmhZUkR1XUZWYUA=",
);

function QueryClientProviderWrapper({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryClientProviderWrapper;
