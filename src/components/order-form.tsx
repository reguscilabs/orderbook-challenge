"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export function OrderForm({ tokenId }: { tokenId: Id<"tokens"> }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  const placeOrder = useMutation(api.orders.placeOrder);
  const ensureDemoUser = useMutation(api.users.ensureDemoUser);

  useEffect(() => {
    ensureDemoUser().then(setUserId);
  }, [ensureDemoUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !price || !quantity) return;

    await placeOrder({
      tokenId,
      side,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      userId,
    });

    setPrice("");
    setQuantity("");
  };

  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
      <h2 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">
        Place Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Side toggle */}
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-[hsl(var(--muted))] p-1">
          <button
            type="button"
            onClick={() => setSide("buy")}
            className={cn(
              "rounded-md py-2 text-sm font-medium transition-colors",
              side === "buy"
                ? "bg-buy text-white"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            )}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide("sell")}
            className={cn(
              "rounded-md py-2 text-sm font-medium transition-colors",
              side === "sell"
                ? "bg-sell text-white"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            )}
          >
            Sell
          </button>
        </div>

        {/* Price input */}
        <div>
          <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1">
            Price
          </label>
          <input
            type="number"
            step="any"
            min="0.000001"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm font-mono text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
            required
          />
        </div>

        {/* Quantity input */}
        <div>
          <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1">
            Quantity
          </label>
          <input
            type="number"
            step="1"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm font-mono text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
            required
          />
        </div>

        {/* Total preview */}
        {price && quantity && (
          <div className="rounded-md bg-[hsl(var(--muted))] px-3 py-2">
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              Total:{" "}
            </span>
            <span className="font-mono text-sm text-[hsl(var(--foreground))]">
              $
              {(parseFloat(price) * parseFloat(quantity)).toLocaleString(
                "en-US",
                { minimumFractionDigits: 2, maximumFractionDigits: 6 }
              )}
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!userId}
          className={cn(
            "w-full rounded-md py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50",
            side === "buy"
              ? "bg-buy hover:opacity-90"
              : "bg-sell hover:opacity-90"
          )}
        >
          {side === "buy" ? "Place Buy Order" : "Place Sell Order"}
        </button>
      </form>
    </div>
  );
}
