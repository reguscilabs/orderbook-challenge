import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Order Book",
  description: "Real-time order book built with Convex + Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[hsl(var(--background))] antialiased">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
