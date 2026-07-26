"use client";

import { useEffect } from "react";

import { usePortfolioStore } from "../../store/portfolioStore";
import { useUserStore } from "../../store/userStore";

export default function Portfolio() {
  const { currentUser } = useUserStore();

  const {
    balances,
    loading,
    error,
    loadPortfolio,
  } = usePortfolioStore();

  useEffect(() => {
    loadPortfolio(currentUser.id);
  }, [currentUser.id, loadPortfolio]);

  if (loading) {
    return (
      <div className="h-full rounded-lg bg-zinc-900 p-4 flex items-center justify-center">
        Loading Portfolio...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full rounded-lg bg-zinc-900 p-4 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto rounded-lg bg-zinc-900 p-4">
      <h2 className="mb-4 font-semibold">
        Portfolio
      </h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-400">
            <th className="text-left">Asset</th>
            <th>Available</th>
            <th>Locked</th>
          </tr>
        </thead>

        <tbody>
          {balances.map((balance) => (
            <tr key={balance.asset}>
              <td>{balance.asset}</td>

              <td className="text-center">
                {balance.available}
              </td>

              <td className="text-center">
                {balance.locked}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}