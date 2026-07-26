"use client";

import { useMemo } from "react";
import { useMyTradesStore } from "../../store/myTradesStore";
export default function TradeHistoryTable() {
  const { trades, loading, error } = useMyTradesStore();

  const rows = useMemo(() => trades, [trades]);

  if (loading) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-center text-neutral-400">
        Loading trade history...
      </div>
    );
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
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-center text-neutral-400">
        No trades found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
      <table className="w-full text-sm">
        <thead className="border-b border-neutral-800 bg-neutral-950">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-neutral-400">
              Time
            </th>

            <th className="px-4 py-3 text-left font-medium text-neutral-400">
              Market
            </th>

            <th className="px-4 py-3 text-left font-medium text-neutral-400">
              Side
            </th>

            <th className="px-4 py-3 text-right font-medium text-neutral-400">
              Price
            </th>

            <th className="px-4 py-3 text-right font-medium text-neutral-400">
              Quantity
            </th>

            <th className="px-4 py-3 text-right font-medium text-neutral-400">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((trade) => (
            <tr
              key={trade.id}
              className="border-b border-neutral-800 hover:bg-neutral-800/40"
            >
              <td className="px-4 py-3 text-neutral-300">
                {new Date(trade.executedAt).toLocaleString()}
              </td>

              <td className="px-4 py-3 font-medium text-white">
                {trade.market}
              </td>

              <td
                className={`px-4 py-3 font-semibold ${
                  trade.side === "BUY"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {trade.side}
              </td>

              <td className="px-4 py-3 text-right text-neutral-300">
                {trade.price.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-right text-neutral-300">
                {trade.quantity.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-right font-medium text-white">
                {trade.total.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}