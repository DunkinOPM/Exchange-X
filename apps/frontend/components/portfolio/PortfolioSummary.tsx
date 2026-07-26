"use client";

import { usePortfolioStore } from "../../store/portfolioStore";

export default function PortfolioSummary() {
  const balances = usePortfolioStore(
    (state) => state.balances,
  );

  const totalAssets = balances.length;

  const totalLocked = balances.reduce(
    (sum, asset) => sum + asset.locked,
    0,
  );

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-xl bg-neutral-900 p-6">
        <p className="text-sm text-neutral-400">
          Assets
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          {totalAssets}
        </h2>
      </div>

      <div className="rounded-xl bg-neutral-900 p-6">
        <p className="text-sm text-neutral-400">
          Locked Funds
        </p>

        <h2 className="mt-2 text-3xl font-bold text-yellow-400">
          {totalLocked.toFixed(4)}
        </h2>
      </div>

      <div className="rounded-xl bg-neutral-900 p-6">
        <p className="text-sm text-neutral-400">
          Available Assets
        </p>

        <h2 className="mt-2 text-3xl font-bold text-green-400">
          {balances
            .reduce(
              (sum, asset) => sum + asset.available,
              0,
            )
            .toFixed(4)}
        </h2>
      </div>
    </div>
  );
}