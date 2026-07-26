"use client";

import { useEffect } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AssetCard from "../../components/portfolio/AssetCard";
import PortfolioSummary from "../../components/portfolio/PortfolioSummary";

import { usePortfolioStore } from "../../store/portfolioStore";
import { useUserStore } from "../../store/userStore";

export default function PortfolioPage() {
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

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Portfolio
          </h1>

          <p className="mt-2 text-zinc-400">
            View your current wallet balances.
          </p>
        </div>

        {loading ? (
          <div className="flex h-96 items-center justify-center text-white">
            Loading Portfolio...
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          <>
            <PortfolioSummary />

            {balances.length === 0 ? (
              <div className="mt-20 text-center text-zinc-500">
                <div className="text-6xl">💰</div>

                <p className="mt-4 text-xl">
                  No assets found.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {balances.map((balance) => (
                  <AssetCard
                    key={balance.asset}
                    balance={balance}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}