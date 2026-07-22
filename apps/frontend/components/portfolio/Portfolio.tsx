"use client";

import { useEffect } from "react";
import { fetchPortfolio } from "../../services/portfolio";
import { usePortfolioStore } from "../../store/portfolioStore";
import { useUserStore } from "../../store/userStore";


export default function Portfolio() {
  const balances = usePortfolioStore((s) => s.balances);
  const setBalances = usePortfolioStore((s) => s.setBalances);
  const user = useUserStore((s) => s.currentUser);

  useEffect(() => {
    fetchPortfolio(user.id).then(setBalances);
  }, [setBalances]);

  return (
    <div className="h-full rounded-lg bg-zinc-900 p-4 overflow-auto">
      <h2 className="font-semibold mb-4">
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