"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { formatPrice, formatQuantity } from "@/lib/utils";

export function TradeList({ tokenId }: { tokenId: Id<"tokens"> }) {
  const trades = useQuery(api.trades.getRecent, { tokenId });

  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
      <h2 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">
        Recent Trades
      </h2>

      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 px-2">
        <span>Price</span>
        <span className="text-right">Quantity</span>
        <span className="text-right">Time</span>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {!trades || trades.length === 0 ? (
          <div className="px-2 py-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
            No trades yet
          </div>
        ) : (
          trades.map((trade) => (
            <div
              key={trade._id}
              className="grid grid-cols-3 gap-2 px-2 py-1 text-sm hover:bg-[hsl(var(--muted))]"
            >
              <span className="font-mono text-[hsl(var(--foreground))]">
                {formatPrice(trade.price)}
              </span>
              <span className="text-right font-mono text-[hsl(var(--foreground))]">
                {formatQuantity(trade.quantity)}
              </span>
              <span className="text-right text-xs text-[hsl(var(--muted-foreground))]">
                {new Date(trade.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
