"use client";

import { OrderBook } from "@/components/order-book";
import { OrderForm } from "@/components/order-form";
import { TradeList } from "@/components/trade-list";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
            Order Book
          </h1>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Real-time · Convex + Next.js
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Book — takes 2 columns */}
          <div className="lg:col-span-2">
            <OrderBook />
          </div>

          {/* Order Form */}
          <div>
            <OrderForm />
          </div>
        </div>

        {/* Trade History */}
        <div className="mt-6">
          <TradeList />
        </div>
      </main>
    </div>
  );
}
