"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { OrderBook } from "@/components/order-book";
import { OrderForm } from "@/components/order-form";
import { TradeList } from "@/components/trade-list";
import { cn } from "@/lib/utils";

export default function Home() {
  const tokens = useQuery(api.tokens.list);
  const [selectedTokenId, setSelectedTokenId] = useState<Id<"tokens"> | null>(
    null
  );

  const activeTokenId = selectedTokenId ?? tokens?.[0]?._id ?? null;
  const activeToken = tokens?.find((t) => t._id === activeTokenId);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
            Order Book
          </h1>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            PumpFun Tokens · Convex + Next.js
          </span>
        </div>
      </header>

      {/* Token selector */}
      <div className="border-b border-[hsl(var(--border))] px-6 py-3">
        <div className="mx-auto max-w-6xl flex gap-2 overflow-x-auto">
          {!tokens ? (
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              Loading tokens...
            </span>
          ) : tokens.length === 0 ? (
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              No tokens — run{" "}
              <code className="bg-[hsl(var(--muted))] px-1 rounded">
                npx convex run seed:seedAll
              </code>
            </span>
          ) : (
            tokens.map((token) => (
              <button
                key={token._id}
                onClick={() => setSelectedTokenId(token._id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  activeTokenId === token._id
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                <span>{token.symbol}</span>
                <span className="font-mono text-xs opacity-70">
                  ${token.currentPrice}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-6xl p-6">
        {activeTokenId && activeToken ? (
          <>
            {/* Token info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                {activeToken.name}{" "}
                <span className="text-[hsl(var(--primary))]">
                  {activeToken.symbol}
                </span>
              </h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                {activeToken.description}
              </p>
              <div className="flex gap-6 mt-2 text-sm">
                <span className="text-[hsl(var(--muted-foreground))]">
                  MCap:{" "}
                  <span className="text-[hsl(var(--foreground))] font-mono">
                    ${activeToken.marketCap.toLocaleString()}
                  </span>
                </span>
                <span className="text-[hsl(var(--muted-foreground))]">
                  24h Vol:{" "}
                  <span className="text-[hsl(var(--foreground))] font-mono">
                    ${activeToken.volume24h.toLocaleString()}
                  </span>
                </span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <OrderBook tokenId={activeTokenId} />
              </div>
              <div>
                <OrderForm tokenId={activeTokenId} />
              </div>
            </div>

            <div className="mt-6">
              <TradeList tokenId={activeTokenId} />
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-[hsl(var(--muted-foreground))]">
            {tokens === undefined
              ? "Connecting to Convex..."
              : "No tokens available. Seed the database to get started."}
          </div>
        )}
      </main>
    </div>
  );
}
