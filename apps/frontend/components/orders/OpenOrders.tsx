"use client";

import { useEffect } from "react";

import { useOpenOrdersStore } from "../../store/openOrdersStore";
import { useUserStore } from "../../store/userStore";

import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import Skeleton from "../common/Skeleton";

export default function OpenOrders() {
  const { currentUser } = useUserStore();

  const { orders, loading, error, loadOrders } = useOpenOrdersStore();

  useEffect(() => {
    loadOrders(currentUser.id);
  }, [currentUser.id, loadOrders]);

  if (loading) {
    return (
      <div className="rounded-xl bg-zinc-900 p-4">
        <Skeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-zinc-900 p-4 text-red-500">{error}</div>
    );
  }

  return (
    <div className="rounded-lg bg-zinc-900 p-4">
      <h2 className="mb-4 text-xl font-bold tracking-wide">Open Orders</h2>

      {orders.length === 0 ? (
        <EmptyState
          icon="📂"
          title="No Open Orders"
          description="Your active orders will appear here."
        />
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-zinc-900">
            <tr className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40">
              <th className="py-2 text-left">Market</th>
              <th className="py-2">Side</th>
              <th className="py-2">Price</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40"
              >
                <td>{order.market.symbol}</td>

                <td>
                  <Badge variant={order.side === "BUY" ? "buy" : "sell"}>
                    {order.side}
                  </Badge>
                </td>

                <td className="text-right font-mono">{order.price.toLocaleString()}</td>

                <td className="text-center font-mono">{order.quantity.toFixed(4)}</td>

                <td>
                  <Badge
                    variant={
                      order.status === "PENDING"
                        ? "warning"
                        : order.status === "FILLED"
                          ? "success"
                          : order.status === "CANCELLED"
                            ? "danger"
                            : "neutral"
                    }
                  >
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
