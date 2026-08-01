"use client";

import { useEffect, useMemo } from "react";

import StatCard from "./StatCard";

import { usePortfolioStore } from "../../store/portfolioStore";
import { useOpenOrdersStore } from "../../store/openOrdersStore";
import { useMyTradesStore } from "../../store/myTradesStore";
import { useUserStore } from "../../store/userStore";

export default function DashboardStats() {
  const { currentUser } = useUserStore();

  const {
    balances,
    loadPortfolio,
  } = usePortfolioStore();

  const {
    orders,
    loadOrders,
  } = useOpenOrdersStore();

  const {
    trades,
    loadTrades,
  } = useMyTradesStore();

  useEffect(() => {
    loadPortfolio(currentUser.id);
    loadOrders(currentUser.id);
    loadTrades(currentUser.id);
  }, [
    currentUser.id,
    loadPortfolio,
    loadOrders,
    loadTrades,
  ]);

  const portfolioValue = useMemo(() => {
    return balances.reduce(
      (sum, balance) =>
        sum + balance.available + balance.locked,
      0
    );
  }, [balances]);

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Portfolio Value"
        value={portfolioValue.toFixed(2)}
        subtitle="Demo valuation"
      />

      <StatCard
        title="Assets"
        value={balances.length}
      />

      <StatCard
        title="Open Orders"
        value={orders.length}
      />

      <StatCard
        title="Trades"
        value={trades.length}
      />

    </div>
  );
}