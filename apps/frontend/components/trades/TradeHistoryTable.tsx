"use client";

import { useMemo } from "react";
import { useMyTradesStore } from "../../store/myTradesStore";

import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import Skeleton from "../common/Skeleton";
export default function TradeHistoryTable() {
  const { trades, loading, error } = useMyTradesStore();

  const rows = useMemo(() => trades, [trades]);

  if (loading) {
    return <Skeleton rows={6} />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500 bg-red-500/10 p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon="📈"
        title="No Trade History"
        description="Your completed trades will appear here."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-zinc-900">
          <tr className="border-b border-zinc-800 text-zinc-400">
            <th className="py-3 text-left">Market</th>
            <th className="py-3">Side</th>
            <th className="py-3 text-right">Price</th>
            <th className="py-3 text-right">Quantity</th>
            <th className="py-3 text-right">Total</th>
            <th className="py-3 text-right">Time</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((trade) => (
            <tr
              key={`${trade.id}-${trade.side}`}
              className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors"
            >
              <td className="py-3 font-medium">{trade.market}</td>

              <td>
                <Badge variant={trade.side === "BUY" ? "buy" : "sell"}>
                  {trade.side}
                </Badge>
              </td>

              <td className="text-right font-mono">
                {trade.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>

              <td className="text-right font-mono">
                {trade.quantity.toLocaleString(undefined, {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })}
              </td>

              <td className="text-right font-semibold">
                {trade.total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>

              <td className="text-right text-zinc-400">
                {new Date(trade.executedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
