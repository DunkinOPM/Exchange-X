"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { cancelOrder, getOpenOrders } from "../../services/orders";
import { useMarketStore } from "../../store/marketStore";
import { useOpenOrdersStore } from "../../store/openOrdersStore";
import { useTradesStore } from "../../store/tradesStore";
import { useUserStore } from "../../store/userStore";

export default function OpenOrders() {
  const orders = useOpenOrdersStore((s) => s.orders);
  const setOrders = useOpenOrdersStore((s) => s.setOrders);

  const trades = useTradesStore((s) => s.trades);
  const user = useUserStore((s) => s.currentUser);
  const market = useMarketStore((s) => s.selectedMarket);

  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getOpenOrders(user.id, market);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.id, market, setOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Refresh whenever a trade executes
  useEffect(() => {
    loadOrders();
  }, [trades, loadOrders]);

  if (loading) {
    return (
      <div className="rounded-lg bg-zinc-900 p-4 h-full">
        <h2 className="mb-4 font-semibold">Open Orders</h2>

        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-zinc-900 p-4 h-full overflow-auto">
      <h2 className="mb-4 font-semibold">Open Orders</h2>

      {orders.length === 0 ? (
        <div className="text-zinc-500 text-sm">
          No open orders for {market}.
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-5 items-center gap-2 border-b border-zinc-800 py-2 text-sm"
          >
            <span>{order.market.symbol}</span>

            <span
              className={
                order.side === "BUY" ? "text-green-400" : "text-red-400"
              }
            >
              {order.side}
            </span>

            <span>{Number(order.price).toLocaleString()}</span>

            <span>{Number(order.quantity).toLocaleString()}</span>

            <button
              className="rounded bg-red-600 px-2 py-1 hover:bg-red-500 transition-colors"
              onClick={async () => {
                try {
                  await cancelOrder(order.id);

                  toast.success("Order cancelled successfully.");

                  loadOrders();
                } catch (error: any) {
                  toast.error(
                    error?.response?.data?.error ?? "Failed to cancel order.",
                  );
                }
              }}
            >
              Cancel
            </button>
          </div>
        ))
      )}
    </div>
  );
}
