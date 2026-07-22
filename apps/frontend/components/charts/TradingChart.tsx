"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  ISeriesApi,
  CandlestickData,
} from "lightweight-charts";

import { useCandleStore } from "../../store/candleStore";
import { getCandles } from "../../services/candleApi";
import { useMarketStore } from "../../store/marketStore";

export default function TradingChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  const candles = useCandleStore((s) => s.candles);
  const setCandles = useCandleStore((s) => s.setCandles);

  const market = useMarketStore((s) => s.selectedMarket);

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: "#18181b",
        },
        textColor: "#d4d4d8",
      },

      grid: {
        vertLines: {
          color: "#27272a",
        },
        horzLines: {
          color: "#27272a",
        },
      },

      width: containerRef.current.clientWidth,
      height: 400,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",

      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",

      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = series;

    const resize = () => {
      if (!containerRef.current) return;

      chart.applyOptions({
        width: containerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, []);
  useEffect(() => {
    async function loadCandles() {
      try {
        const data = await getCandles(market);
        setCandles(data);
      } catch (err) {
        console.error("Failed to load candles", err);
      }
    }

    loadCandles();
  }, [market, setCandles]);
  // Update whenever candle data changes
  useEffect(() => {
    if (!seriesRef.current) return;

    const data: CandlestickData[] = candles
      .slice()
      .sort((a, b) => a.openTime - b.openTime)
      .map((candle) => ({
        time: Math.floor(candle.openTime / 1000) as any,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));
    console.log("Candlestick data:", data);
    seriesRef.current.setData(data);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  return (
    <div className="h-full rounded-lg bg-zinc-900 p-4">
      <h2 className="mb-4 font-semibold">Trading Chart</h2>

      <div ref={containerRef} className="h-[400px] w-full" />
    </div>
  );
}
