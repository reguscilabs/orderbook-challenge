"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatPrice, formatQuantity } from "@/lib/utils";

export function OrderBook() {
  const orderBook = useQuery(api.orders.getOrderBook);

  if (!orderBook) {
    return (
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
        <h2 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">
          Order Book
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
      <h2 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">
        Order Book
      </h2>

      {/* Asks (sells) — reversed so lowest price is at bottom */}
      <div className="mb-1">
        <div className="grid grid-cols-3 gap-2 text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 px-2">
          <span>Price</span>
          <span className="text-right">Quantity</span>
          <span className="text-right">Total</span>
        </div>
        <div className="flex flex-col-reverse max-h-48 overflow-y-auto">
          {orderBook.sells.length === 0 ? (
            <div className="px-2 py-3 text-center text-xs text-[hsl(var(--muted-foreground))]">
              No sell orders
            </div>
          ) : (
            orderBook.sells.map((order) => {
              const remaining = order.quantity - order.filledQuantity;
              return (
                <div
                  key={order._id}
                  className="grid grid-cols-3 gap-2 px-2 py-1 text-sm hover:bg-[hsl(var(--muted))]"
                >
                  <span className="text-sell font-mono">
                    {formatPrice(order.price)}
                  </span>
                  <span className="text-right font-mono text-[hsl(var(--foreground))]">
                    {formatQuantity(remaining)}
                  </span>
                  <span className="text-right font-mono text-[hsl(var(--muted-foreground))]">
                    {formatPrice(order.price * remaining)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Spread indicator */}
      <div className="border-y border-[hsl(var(--border))] py-2 px-2 my-1">
        {orderBook.sells.length > 0 && orderBook.buys.length > 0 ? (
          <div className="text-center text-sm">
            <span className="text-[hsl(var(--muted-foreground))]">Spread: </span>
            <span className="font-mono text-[hsl(var(--foreground))]">
              {formatPrice(orderBook.sells[0].price - orderBook.buys[0].price)}
            </span>
          </div>
        ) : (
          <div className="text-center text-xs text-[hsl(var(--muted-foreground))]">
            —
          </div>
        )}
      </div>

      {/* Bids (buys) */}
      <div className="mt-1">
        <div className="max-h-48 overflow-y-auto">
          {orderBook.buys.length === 0 ? (
            <div className="px-2 py-3 text-center text-xs text-[hsl(var(--muted-foreground))]">
              No buy orders
            </div>
          ) : (
            orderBook.buys.map((order) => {
              const remaining = order.quantity - order.filledQuantity;
              return (
                <div
                  key={order._id}
                  className="grid grid-cols-3 gap-2 px-2 py-1 text-sm hover:bg-[hsl(var(--muted))]"
                >
                  <span className="text-buy font-mono">
                    {formatPrice(order.price)}
                  </span>
                  <span className="text-right font-mono text-[hsl(var(--foreground))]">
                    {formatQuantity(remaining)}
                  </span>
                  <span className="text-right font-mono text-[hsl(var(--muted-foreground))]">
                    {formatPrice(order.price * remaining)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
