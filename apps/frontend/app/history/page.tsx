"use client";

import { useEffect } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TradeHistoryTable from "../../components/trades/TradeHistoryTable";

import { useMyTradesStore } from "../../store/myTradesStore";
import { useUserStore } from "../../store/userStore";

export default function HistoryPage() {
  const { currentUser } = useUserStore();

  const loadTrades = useMyTradesStore(
    (state) => state.loadTrades
  );

  useEffect(() => {
    loadTrades(currentUser.id);
  }, [currentUser.id, loadTrades]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Trade History
          </h1>

          <p className="mt-2 text-zinc-400">
            View all of your completed trades.
          </p>
        </div>

        <TradeHistoryTable />
      </div>
    </DashboardLayout>
  );
}