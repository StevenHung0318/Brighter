import React, { useMemo, useRef, useState } from "react";
import {
  Zap,
  TrendingUp,
  Shield,
  Wallet,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";
import llpLogo from "./Assets/LLP_logo.jpg";
import usdcLogo from "./Assets/USDC_logo.png";
import usdlLogo from "./Assets/usdl.png";

const formatPercent = (value: number) => `${value.toFixed(1)}%`;
type Tab = "Loop" | "Earn" | "Deposit" | "Borrow";

export default function BrighterApp() {
  const [activeTab, setActiveTab] = useState<Tab>("Loop");
  const [leverage, setLeverage] = useState(4);
  const [llpDeposit, setLlpDeposit] = useState("2500");
  const [usdcSupply, setUsdcSupply] = useState("5000");
  const [borrowAmount, setBorrowAmount] = useState("5000");
  const [zapChain, setZapChain] = useState("Arbitrum");
  const [zapAmount, setZapAmount] = useState("2000");
  const [priceRange, setPriceRange] = useState<
    "1W" | "1M" | "3M" | "1Y" | "ALL"
  >("ALL");
  const [aprHover, setAprHover] = useState(false);
  const usdlPriceSeries = useMemo(
    () => [
      1.0, 1.03, 1.08, 1.12, 1.18, 1.16, 1.22, 1.3, 1.27, 1.35, 1.4, 1.48, 1.55,
      1.6, 1.68, 1.75, 1.82, 1.9, 1.95, 2.05, 2.1, 2.22, 2.3, 2.4, 2.52, 2.6,
      2.68, 2.75, 2.82, 2.95, 3.02, 3.1, 3.18, 3.26, 3.3, 3.38, 3.44, 3.52, 3.6,
      3.55, 3.62, 3.7, 3.78, 3.82, 3.88, 3.92, 3.98, 4.05, 4.1, 4.18, 4.12,
      4.22, 4.28, 4.35, 4.4, 4.48, 4.52, 4.6, 4.68,
    ],
    []
  );

  const baseApr = 15;
  const leverageBoost = useMemo(() => (leverage - 1) * 12, [leverage]);
  const borrowCost = useMemo(() => 6 + (leverage - 1) * 0.8, [leverage]);
  const netApy = useMemo(
    () => Math.max(0, baseApr + leverageBoost - borrowCost),
    [baseApr, leverageBoost, borrowCost]
  );

  const currentPrice = 1.0;
  const liquidationPrice = useMemo(
    () => currentPrice * (1 - leverage * 0.045),
    [leverage]
  );
  const safetyPct = Math.max(
    0,
    Math.min(100, ((currentPrice - liquidationPrice) / currentPrice) * 100)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10 md:px-10">
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-yellow-300 text-slate-900 font-semibold shadow-lg shadow-cyan-400/30">
              B
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">Brighter</p>
              <p className="text-xs text-slate-400">
                Leveraged Yield on Lighter
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-4 text-sm text-slate-300 md:flex">
            {(["Loop", "Earn", "Borrow", "Deposit"] as Tab[]).map((item) => {
              const isActive = activeTab === item;
              return (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`rounded-lg px-3 py-2 transition focus:outline-none ${
                    isActive
                      ? "bg-white/10 text-white shadow-md shadow-cyan-400/20"
                      : "hover:text-white"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-cyan-300/20 focus:outline-none">
              <Wallet className="h-4 w-4" />
              Connect
            </button>
          </div>
        </header>

        <main className="mt-8">
          {activeTab === "Loop" && (
            <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/10 p-6 shadow-xl shadow-cyan-500/10 backdrop-blur">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-400/20 via-transparent to-yellow-300/10 blur-3xl" />
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
                    <Sparkles className="h-3 w-3" />
                    Looping Console
                  </div>
                  <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                    Multiply your LLP yield with 1-click looping
                  </h1>
                  <p className="mt-2 text-sm text-slate-300">
                    Deposit LLP, pick leverage, and Brighter handles the
                    recursive borrows, swaps, and health checks automatically.
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-4 py-3 text-sm font-semibold text-yellow-100">
                  <TrendingUp className="h-4 w-4" />
                  TVL: $124.5M
                </div>
              </div>

              <div className="mt-6 space-y-4 rounded-2xl border border-white/5 bg-slate-900/60 p-5 shadow-inner shadow-cyan-500/10">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-white">
                    Deposit LLP
                  </label>
                  <span className="text-xs text-slate-400">
                    Balance: 12,450 LLP
                  </span>
                </div>
                <div className="relative">
                  <input
                    value={llpDeposit}
                    onChange={(e) => setLlpDeposit(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-lg font-mono text-white shadow-inner shadow-cyan-500/5 focus:border-cyan-400/60 focus:outline-none"
                    placeholder="0.0"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center gap-2 text-xs text-slate-400">
                    <img src={llpLogo} alt="LLP" className="h-5 w-5" />
                    LLP
                    <span className="h-6 w-px bg-white/10" />
                    <button className="rounded-lg bg-white/5 px-2 py-1 text-[11px] font-semibold text-cyan-100">
                      Max
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">Leverage</span>
                    <span className="font-mono text-cyan-100">
                      {leverage.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.1}
                    value={leverage}
                    onChange={(e) => setLeverage(parseFloat(e.target.value))}
                    className="mt-3 w-full accent-cyan-400"
                  />
                  <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>1x</span>
                    <span>10x</span>
                  </div>
                </div>

                <div className="grid gap-3 rounded-xl border border-white/10 bg-white/10 p-4 md:grid-cols-4">
                  <Metric label="LLP Base APR" value={formatPercent(baseApr)} />
                  <Metric
                    label="Leverage Boost"
                    value={`+${formatPercent(leverageBoost)}`}
                    accent="text-cyan-300"
                  />
                  <Metric
                    label="Borrow Interest"
                    value={`-${formatPercent(borrowCost)}`}
                    accent="text-amber-300"
                  />
                  <div className="flex flex-col justify-between rounded-lg bg-gradient-to-r from-cyan-400/15 via-yellow-300/20 to-cyan-400/15 px-4 py-3 text-center shadow-lg shadow-cyan-500/20">
                    <span className="text-xs uppercase tracking-widest text-slate-200">
                      Net APY
                    </span>
                    <span className="text-3xl font-semibold text-white drop-shadow-[0_0_18px_rgba(94,234,212,0.35)]">
                      {formatPercent(netApy)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <Shield className="h-4 w-4 text-cyan-300" />
                      Health Monitor
                    </div>
                    <div className="text-xs text-slate-400">
                      Liq. @ ${liquidationPrice.toFixed(3)}
                    </div>
                  </div>
                  <div className="relative h-4 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-red-500"
                      style={{ width: `${safetyPct}%` }}
                    />
                    <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-slate-900/90 text-[10px] font-semibold text-white shadow-lg shadow-cyan-500/20">
                      <span className="flex h-full items-center justify-center">
                        Px
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-green-200">Safe</span>
                    <span className="text-red-200">Risk</span>
                  </div>
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-yellow-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-400/30 transition hover:-translate-y-0.5 focus:outline-none">
                  <Zap className="h-4 w-4" />
                  1-Click Loop
                </button>
              </div>
            </section>
          )}

          {activeTab === "Earn" && (
            <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-xl shadow-yellow-300/10 backdrop-blur">
              <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-yellow-300/15 via-transparent to-cyan-300/10 blur-3xl" />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-yellow-100">
                    <TrendingUp className="h-3 w-3" />
                    Earn USDC
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    Lend to loopers
                  </h2>
                  <p className="text-sm text-slate-300">
                    Supply USDC, earn fees from leveraged farmers,
                    auto-compounding on-chain.
                  </p>
                </div>
                <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                  Pool Utilization: 62%
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="text-xs text-slate-400">Supply Amount</label>
                <div className="relative">
                  <input
                    value={usdcSupply}
                    onChange={(e) => setUsdcSupply(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base font-mono text-white focus:border-yellow-300/60 focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center gap-2 text-xs text-slate-400">
                    <img
                      src={usdcLogo}
                      alt="USDC"
                      className="h-4 w-4 rounded-full bg-slate-900 p-[1px]"
                    />
                    USDC
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Metric
                    label="Supply APY"
                    value="8.0%"
                    accent="text-yellow-200"
                  />
                  <Metric label="Utilization" value="62%" />
                  <Metric label="Earned (30d est.)" value="$412" />
                </div>
                <button className="mt-4 w-full rounded-xl border border-yellow-300/40 bg-yellow-300/15 px-4 py-3 text-sm font-semibold text-yellow-100 shadow-lg shadow-yellow-300/15 transition hover:-translate-y-0.5 focus:outline-none">
                  Supply
                </button>
              </div>
            </section>
          )}

          {activeTab === "Deposit" && (
            <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-xl shadow-cyan-500/15 backdrop-blur">
              <div className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-gradient-to-tr from-cyan-400/15 via-transparent to-yellow-300/20 blur-3xl" />
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    Deposit USDC to mint USDL
                  </h2>
                  <p className="text-sm text-slate-300">
                    USDL is a yield-bearing stablecoin powered by LLP
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    onMouseEnter={() => setAprHover(true)}
                    onMouseLeave={() => setAprHover(false)}
                    className="relative"
                  >
                    <div className="flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-inner shadow-cyan-500/20">
                      APR 63%
                    </div>
                    {aprHover && (
                      <div className="absolute right-0 top-11 z-20 w-64 rounded-xl border border-white/10 bg-slate-900/90 p-3 text-xs text-slate-200 shadow-lg shadow-cyan-500/20">
                        <div className="flex items-center justify-between">
                          <span>LLP yield</span>
                          <span className="text-cyan-100">35%</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span>Lither point</span>
                          <span className="text-cyan-100">0.004/USDC/day (~20%)</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span>Brighter point</span>
                          <span className="text-cyan-100">0.2/USDC/day (~8%)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_1fr]">
                <USDLPriceCard
                  data={usdlPriceSeries}
                  range={priceRange}
                  onRangeChange={setPriceRange}
                />

                <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-inner shadow-cyan-500/10 lg:row-span-1">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-slate-400">
                        Source chain
                      </label>
                      <div className="relative mt-2">
                        <select
                          value={zapChain}
                          onChange={(e) => setZapChain(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 pr-10 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
                        >
                          {["Ethereum", "Arbitrum", "Base", "Avalanche"].map(
                            (chain) => (
                              <option key={chain}>{chain}</option>
                            )
                          )}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">
                        Destination
                      </label>
                      <div className="mt-2 flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100">
                        <img
                          src={llpLogo}
                          alt="LLP"
                          className="h-6 w-6 rounded-full bg-cyan-500/10 p-1"
                        />
                        Brighter Account
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <label>You deposit</label>
                      <span>Wallet balance: 12,000 USDC</span>
                    </div>
                    <div className="relative">
                      <input
                        value={zapAmount}
                        onChange={(e) => setZapAmount(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-28 text-lg font-mono text-white focus:border-cyan-400/60 focus:outline-none"
                        placeholder="0.0"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2 text-sm font-semibold text-white">
                        <img
                          src={usdcLogo}
                          alt="USDC"
                          className="h-8 w-8 rounded-full bg-slate-900 p-[1px]"
                        />
                        USDC
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <Metric
                      label="You receive"
                      value={
                        <div className="flex items-center justify-between gap-2 text-lg">
                          <span>
                            {(Number(zapAmount || 0) / 1.01).toFixed(2)}
                          </span>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                            <img
                              src={usdlLogo}
                              alt="USDL"
                              className="h-6 w-6 rounded-full bg-slate-900 p-[1px]"
                            />
                            USDL
                          </span>
                        </div>
                      }
                      accent=""
                    />
                    <Metric
                      label="Entry fee"
                      value={
                        <div className="flex items-center justify-between gap-2 text-lg">
                          <span>5</span>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                            <img
                              src={usdcLogo}
                              alt="USDC"
                              className="h-6 w-6 rounded-full bg-slate-900 p-[1px]"
                            />
                            USDC
                          </span>
                        </div>
                      }
                      accent=""
                    />
                  </div>

                  <button
                    onClick={() => setZapOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-yellow-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-400/30 transition hover:-translate-y-0.5 focus:outline-none"
                  >
                    <Zap className="h-4 w-4" />
                    Deposit
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "Borrow" && (
            <section className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-cyan-500/10 backdrop-blur">
              <div className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-gradient-to-br from-cyan-400/15 via-transparent to-yellow-300/10 blur-3xl" />
              <div className="space-y-4">
                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-cyan-500/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">Deposit</span>
                    <span className="text-xs text-slate-400">
                      Balance 12,450 LLP
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      value={llpDeposit}
                      onChange={(e) => setLlpDeposit(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-24 text-2xl font-mono text-white focus:border-cyan-400/60 focus:outline-none"
                      placeholder="0"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-white">
                      <img
                        src={llpLogo}
                        alt="LLP"
                        className="h-8 w-8 rounded-full bg-cyan-500/10 p-1"
                      />
                      <span className="text-sm font-semibold">LLP</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      ~ ${((Number(llpDeposit) || 0) * 1.02).toFixed(0)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[0.25, 0.5, 0.75, 1].map((pct) => (
                        <button
                          key={pct}
                          onClick={() =>
                            setLlpDeposit((12450 * pct).toFixed(0))
                          }
                          className="rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                        >
                          {pct === 1 ? "Max" : `${pct * 100}%`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-cyan-500/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">Borrow</span>
                    <button className="text-xs font-semibold text-cyan-200">
                      Auto safe borrow
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      value={borrowAmount}
                      onChange={(e) => setBorrowAmount(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-24 text-2xl font-mono text-white focus:border-yellow-300/60 focus:outline-none"
                      placeholder="0"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-white">
                      <img
                        src={usdcLogo}
                        alt="USDC"
                        className="h-8 w-8 rounded-full bg-slate-900 p-1"
                      />
                      <span className="text-sm font-semibold">USDC</span>
                    </div>
                  </div>
                </div>

                <CollateralGauge
                  llpDeposit={llpDeposit}
                  borrowAmount={borrowAmount}
                />

                <button className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-cyan-400/20 transition hover:-translate-y-0.5 focus:outline-none">
                  Borrow
                </button>

                <PositionOverview
                  collateralValue={(Number(llpDeposit) || 0) * 1.02}
                  borrowAmount={Number(borrowAmount) || 0}
                  borrowCost={borrowCost}
                  currentPrice={currentPrice}
                />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-slate-950/40 px-3 py-2">
      <p className="text-[11px] uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className={`text-xl font-semibold text-white ${accent ?? ""}`}>
        {value}
      </p>
    </div>
  );
}

function CollateralGauge({
  llpDeposit,
  borrowAmount,
}: {
  llpDeposit: string;
  borrowAmount: string;
}) {
  const collateralValue = (Number(llpDeposit) || 0) * 1.02;
  const borrowed = Number(borrowAmount) || 0;
  const ltv = collateralValue > 0 ? (borrowed / collateralValue) * 100 : 0;
  const pointer = Math.max(0, Math.min(100, ltv));
  const thresholds = [
    { value: 50, label: "Conservative", color: "text-green-200" },
    { value: 70, label: "Aggressive", color: "text-amber-200" },
    { value: 80, label: "Liquidation", color: "text-red-200" },
  ];

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-cyan-500/10">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-white">LTV (Loan-to-Value)</span>
        <span className="text-xs text-slate-400">
          {ltv > 0 ? `${ltv.toFixed(0)}%` : "- %"}
        </span>
      </div>
      <div className="relative h-4 overflow-hidden rounded-full bg-white/5">
        <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-green-400 via-amber-400 to-red-500 opacity-70" />
        <div
          className="absolute -top-1 h-6 w-6 rounded-full border border-white/50 bg-slate-900/90 shadow-lg shadow-cyan-500/30"
          style={{ left: `${pointer}%`, transform: "translateX(-50%)" }}
        />
        {thresholds.map((t) => (
          <div
            key={t.value}
            className="absolute inset-y-0 w-px bg-white/60"
            style={{ left: `${t.value}%` }}
          />
        ))}
      </div>
      <div className="relative mt-1 h-5 text-[11px] text-slate-300">
        {thresholds.map((t) => (
          <div
            key={t.value}
            className="absolute -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${t.value}%` }}
          >
            <span className={t.color}>{`${t.value}% ${t.label}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PositionOverview({
  collateralValue,
  borrowAmount,
  borrowCost,
  currentPrice,
}: {
  collateralValue: number;
  borrowAmount: number;
  borrowCost: number;
  currentPrice: number;
}) {
  const liqPrice =
    borrowAmount > 0
      ? (currentPrice * 110) / ((collateralValue / borrowAmount) * 100 || 1)
      : undefined;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-200">
      <p className="text-base font-semibold text-white">Position Overview</p>
      <div className="mt-4 space-y-2 text-xs">
        <OverviewRow
          label="Liquidation price"
          value={liqPrice ? `$${liqPrice.toFixed(3)}` : "$ -"}
        />
        <OverviewRow
          label="Market price"
          value={`$${currentPrice.toFixed(2)}`}
        />
        <OverviewRow label="Borrow fee" value="Free" accent="text-green-300" />
        <OverviewRow
          label="Interest rate"
          value={`${borrowCost.toFixed(1)} %`}
        />
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-slate-400">
        <span role="img" aria-label="calculator">
          🧮
        </span>
        Position Value Calculator
      </div>
    </div>
  );
}

function OverviewRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={`font-mono text-slate-100 ${accent ?? ""}`}>
        {value}
      </span>
    </div>
  );
}

function USDLPriceCard({
  data,
  range,
  onRangeChange,
}: {
  data: number[];
  range: "1W" | "1M" | "3M" | "1Y" | "ALL";
  onRangeChange: (value: "1W" | "1M" | "3M" | "1Y" | "ALL") => void;
}) {
  const rangedData = useMemo(() => {
    const counts: Record<typeof range, number> = {
      "1W": 7,
      "1M": 20,
      "3M": 40,
      "1Y": data.length,
      ALL: data.length,
    };
    const take = counts[range] ?? data.length;
    return data.slice(-take);
  }, [data, range]);

  const svgWidth = 100;
  const svgHeight = 80;
  const points = useMemo(
    () => buildPoints(rangedData, svgWidth, svgHeight),
    [rangedData, svgWidth, svgHeight]
  );
  const linePath = useMemo(() => buildLinePath(points), [points]);
  const areaPath = useMemo(
    () => buildAreaPath(points, svgWidth, svgHeight),
    [points, svgWidth, svgHeight]
  );
  const [hoverPoint, setHoverPoint] = useState<{
    x: number;
    y: number;
    value: number;
    idx: number;
    xPx?: number;
    yPx?: number;
  } | null>(null);
  const display =
    hoverPoint ??
    (points.length
      ? {
          x: points[points.length - 1].x,
          y: points[points.length - 1].y,
          value: rangedData[rangedData.length - 1],
          idx: points.length - 1,
        }
      : { x: 0, y: 0, value: 0, idx: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleHover = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current || !points.length) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((event.clientX - rect.left) / rect.width) * svgWidth;
    const clampedX = Math.max(0, Math.min(svgWidth, relX));

    let idx = points.findIndex((p) => p.x >= clampedX);
    if (idx === -1) idx = points.length - 1;
    const prevIdx = Math.max(0, idx - 1);
    const p0 = points[prevIdx];
    const p1 = points[idx];
    const v0 = rangedData[prevIdx] ?? rangedData[rangedData.length - 1] ?? 0;
    const v1 = rangedData[idx] ?? v0;
    const span = p1.x - p0.x || 1;
    const t = Math.max(0, Math.min(1, (clampedX - p0.x) / span));
    const interpY = p0.y + (p1.y - p0.y) * t;
    const interpV = v0 + (v1 - v0) * t;

    const parentRect = svgRef.current.parentElement?.getBoundingClientRect();
    const xPx =
      parentRect && rect
        ? rect.left - parentRect.left + (clampedX / svgWidth) * rect.width
        : undefined;
    const yPx =
      parentRect && rect
        ? rect.top - parentRect.top + (interpY / svgHeight) * rect.height
        : undefined;

    setHoverPoint({
      x: clampedX,
      y: interpY,
      value: interpV,
      idx,
      xPx,
      yPx,
    });
  };

  const handleLeave = () => {
    setHoverPoint(null);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-inner shadow-cyan-500/15">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={usdlLogo}
            alt="USDL"
            className="h-5 w-5 rounded-full bg-slate-900 p-[1px]"
          />
          <p className="text-sm font-semibold text-white">USDL price</p>
          <div className="flex items-center gap-2 text-[11px]">
            {["1W", "1M", "3M", "1Y", "ALL"].map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r as typeof range)}
                className={`rounded-full px-2 py-1 ${
                  range === r
                    ? "bg-cyan-400/20 text-cyan-100"
                    : "bg-white/5 text-slate-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <span className="text-sm font-semibold text-cyan-100">
          1 USDL = {display.value.toFixed(3)} USDC
        </span>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-0">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          className="block h-80 w-full"
          onMouseMove={handleHover}
          onMouseLeave={handleLeave}
        >
          <defs>
            <linearGradient id="usdlArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#usdlArea)" />
          <path
            d={linePath}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {points.length > 0 && (
            <>
              <line
                x1={display.x}
                x2={display.x}
                y1={0}
                y2={svgHeight}
                stroke="#38bdf8"
                strokeWidth="0.4"
                strokeDasharray="2 2"
                opacity={0.7}
              />
              <circle
                cx={display.x}
                cy={display.y}
                r={1.8}
                fill="#22d3ee"
                stroke="#0ea5e9"
                strokeWidth="0.6"
              />
            </>
          )}
          <rect
            x={0}
            y={0}
            width={svgWidth}
            height={svgHeight}
            fill="transparent"
          />
        </svg>
        {points.length > 0 && (
          <>
            <div className="pointer-events-none absolute right-4 top-4 rounded-lg bg-slate-900/80 px-3 py-2 text-xs text-white shadow-lg shadow-cyan-500/20">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />1 USDL = $
                {display.value.toFixed(3)} USDC
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                Point {display.idx + 1}/{points.length}
              </div>
            </div>
            {hoverPoint && (
              <div
                className="pointer-events-none absolute rounded-md bg-slate-900/90 px-2 py-1 text-[10px] text-white shadow-md shadow-cyan-500/20"
                style={{
                  left: (hoverPoint.xPx ?? 0) + 10,
                  top: (hoverPoint.yPx ?? 0) + 10,
                }}
              >
                1 USDL = ${display.value.toFixed(3)} USDC
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Growth since inception</span>
        <span className="text-cyan-200">
          +{(((display.value - 1) / 1) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function buildPoints(data: number[], width: number, height: number) {
  if (!data.length) return [];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return data.map((v, i) => {
    const x = (i / Math.max(1, data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return { x, y };
  });
}

function buildLinePath(points: { x: number; y: number }[]) {
  if (!points.length) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
}

function buildAreaPath(
  points: { x: number; y: number }[],
  width: number,
  height: number
) {
  if (!points.length) return "";
  const line = buildLinePath(points);
  return `${line} L ${width} ${height} L 0 ${height} Z`;
}
