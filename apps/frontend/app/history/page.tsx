"use client";

import { useEffect } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TradeHistoryTable from "../../components/trades/TradeHistoryTable";

import { useMyTradesStore } from "../../store/myTradesStore";
import { useAuthStore } from "../../store/authStore";

export default function HistoryPage() {
  const user = useAuthStore((s) => s.user);

  const loadTrades = useMyTradesStore((state) => state.loadTrades);

  useEffect(() => {
    if (!user) return;
    loadTrades();
  }, [loadTrades]);
  if (!user) return null;
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Trade History</h1>

          <p className="mt-2 text-zinc-400">
            View all of your completed trades.
          </p>
        </div>

        <TradeHistoryTable />
      </div>
    </DashboardLayout>
  );
}
