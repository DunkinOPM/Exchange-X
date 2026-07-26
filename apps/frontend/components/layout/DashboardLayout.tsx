"use client";

import { ReactNode } from "react";
import Header from "./Header";
import { useMarketSocket } from "../../hooks/useMarketSocket";
import Sidebar from "./Sidebar";
interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  useMarketSocket();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
    <div className="flex h-screen">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Header />

        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>

      </div>

    </div>
  </main>
  );
}