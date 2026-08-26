"use client";

import { useEffect, useMemo } from "react";

import StatCard from "./StatCard";

import { usePortfolioStore } from "../../store/portfolioStore";
import { useOpenOrdersStore } from "../../store/openOrdersStore";
import { useMyTradesStore } from "../../store/myTradesStore";
import { useAuthStore } from "../../store/authStore";

export default function DashboardStats() {
  const user = useAuthStore((s) => s.user);

  const { balances, loadPortfolio } = usePortfolioStore();
  const { orders, loadOrders } = useOpenOrdersStore();
  const { trades, loadTrades } = useMyTradesStore();

  useEffect(() => {
    if (!user) return;

    loadPortfolio();
    loadOrders();
    loadTrades();
  }, [user, loadPortfolio, loadOrders, loadTrades]);

  const portfolioValue = useMemo(() => {
    return balances.reduce(
      (sum, balance) => sum + balance.available + balance.locked,
      0,
    );
  }, [balances]);

  if (!user) {
    return null;
  }

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Portfolio Value"
        value={portfolioValue.toFixed(2)}
        subtitle="Demo valuation"
      />

      <StatCard title="Assets" value={balances.length} />

      <StatCard title="Open Orders" value={orders.length} />

      <StatCard title="Trades" value={trades.length} />
    </div>
  );
}
