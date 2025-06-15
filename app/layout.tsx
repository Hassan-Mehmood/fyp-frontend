"use client";

import Layout from "../components/Layout";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <body>
            <Layout>{children}</Layout>
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
