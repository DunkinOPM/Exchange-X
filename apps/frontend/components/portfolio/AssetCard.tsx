"use client";

import { Balance } from "../../services/portfolio";

interface Props {
  balance: Balance;
}

export default function AssetCard({
  balance,
}: Props) {
  const total =
    balance.available + balance.locked;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-white">
        {balance.asset}
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-neutral-400">
            Available
          </span>

          <span className="font-semibold text-green-400">
            {balance.available.toFixed(8)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-400">
            Locked
          </span>

          <span className="font-semibold text-yellow-400">
            {balance.locked.toFixed(8)}
          </span>
        </div>

        <div className="border-t border-neutral-800 pt-4">
          <div className="flex justify-between">
            <span className="font-semibold text-white">
              Total
            </span>

            <span className="text-lg font-bold text-blue-400">
              {total.toFixed(8)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}