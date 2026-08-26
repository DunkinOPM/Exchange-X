"use client";

import { useState } from "react";
import { toast } from "sonner";

import { placeOrder } from "../../services/orders";
import { useMarketStore } from "../../store/marketStore";
import { useTradingStore } from "../../store/tradingStore";
import { useAuthStore } from "../../store/authStore";

export default function BuySellPanel() {
  const market = useMarketStore((s) => s.selectedMarket);

  const side = useTradingStore((s) => s.side);
  const setSide = useTradingStore((s) => s.setSide);

  const type = useTradingStore((s) => s.type);
  const setType = useTradingStore((s) => s.setType);

  const user = useAuthStore((s) => s.user);

  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  async function submit() {
    if (!quantity || Number(quantity) <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    if (type === "LIMIT" && (!price || Number(price) <= 0)) {
      toast.error("Please enter a valid price.");
      return;
    }

    try {
      setLoading(true);

      await placeOrder({
        market,
        side,
        type,
        price: type === "LIMIT" ? Number(price) : undefined,
        quantity: Number(quantity),
      });

      toast.success(`${side} ${type} order placed successfully`);

      setPrice("");
      setQuantity("");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Failed to place order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg bg-zinc-900 p-4 space-y-3">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setSide("BUY")}
          className={`flex-1 rounded p-2 transition-colors ${
            side === "BUY" ? "bg-green-600" : "bg-zinc-700 hover:bg-zinc-600"
          }`}
        >
          BUY
        </button>

        <button
          onClick={() => setSide("SELL")}
          className={`flex-1 rounded p-2 transition-colors ${
            side === "SELL" ? "bg-red-600" : "bg-zinc-700 hover:bg-zinc-600"
          }`}
        >
          SELL
        </button>
      </div>

      <select
        value={type}
        onChange={(e) => setType(e.target.value as "LIMIT" | "MARKET")}
        className="mb-3 w-full rounded bg-zinc-800 p-2"
      >
        <option>LIMIT</option>
        <option>MARKET</option>
      </select>

      {type === "LIMIT" && (
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mb-3 w-full rounded bg-zinc-800 p-2"
        />
      )}

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="mb-3 w-full rounded bg-zinc-800 p-2"
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full rounded bg-blue-600 p-2 transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting..." : "SUBMIT ORDER TEST"}
      </button>
    </div>
  );
}
