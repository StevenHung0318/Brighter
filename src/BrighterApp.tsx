import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Zap,
  TrendingUp,
  Shield,
  Wallet,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";
import brighterLogo from "./Assets/Brighter logo.png";
import llpLogo from "./Assets/LLP_logo.jpg";
import usdcLogo from "./Assets/USDC_logo.png";
import usdlLogo from "./Assets/usdl.png";

const formatPercent = (value: number) => `${value.toFixed(1)}%`;
type Tab = "Loop" | "Earn" | "Deposit" | "Borrow" | "Stake";
const chainIcons: Record<string, string> = {
  Ethereum: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  Arbitrum: "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
  Base: "https://s2.coinmarketcap.com/static/img/coins/64x64/27716.png",
  Avalanche: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
};

export default function BrighterApp() {
  const [activeTab, setActiveTab] = useState<Tab>("Deposit");
  const [leverage, setLeverage] = useState(4);
  const [llpDeposit, setLlpDeposit] = useState("2500");
  const [usdcSupply, setUsdcSupply] = useState("5000");
  const [borrowAmount, setBorrowAmount] = useState("5000");
  const [zapChain, setZapChain] = useState("Arbitrum");
  const [zapAmount, setZapAmount] = useState("2000");
  const [withdrawAmount, setWithdrawAmount] = useState("600");
  const [depositMode, setDepositMode] = useState<"deposit" | "withdraw" | "stake">(
    "deposit"
  );
  const [stakeAmount, setStakeAmount] = useState("1500");
  const [stakePeriod, setStakePeriod] = useState<
    "30d" | "90d" | "180d" | "365d"
  >("30d");
  const [stakeStart, setStakeStart] = useState(Date.now());
  const [priceRange, setPriceRange] = useState<
    "1W" | "1M" | "3M" | "1Y" | "ALL"
  >("ALL");
  const [aprHover, setAprHover] = useState(false);
  const [depositPercent, setDepositPercent] = useState(25);
  const [stakeOnDeposit, setStakeOnDeposit] = useState(false);
  const [showTxHistory, setShowTxHistory] = useState(false);
  const [yourPositionsTab, setYourPositionsTab] = useState<"Deposit" | "Staked">("Deposit");
  const totalDeposited = "$128.4M";
  const yourDeposited = "$12,400";
  const headlineApr = "34.5%";
  const stakeBoostMap: Record<"30d" | "90d" | "180d" | "365d", number> = {
    "30d": 1,
    "90d": 2,
    "180d": 5,
    "365d": 10,
  };
  const stakeDurationMs: Record<"30d" | "90d" | "180d" | "365d", number> = {
    "30d": 30 * 24 * 3600 * 1000,
    "90d": 90 * 24 * 3600 * 1000,
    "180d": 180 * 24 * 3600 * 1000,
    "365d": 365 * 24 * 3600 * 1000,
  };
  const stakePointRates: Record<
    "30d" | "90d" | "180d" | "365d",
    { lighter: number; brighter: number }
  > = {
    "30d": { lighter: 1, brighter: 2 },
    "90d": { lighter: 2, brighter: 5 },
    "180d": { lighter: 5, brighter: 12 },
    "365d": { lighter: 10, brighter: 30 },
  };
  const lighterPerDay = (Number(stakeAmount) || 0) * 0.004;
  const brighterPerDay = (Number(stakeAmount) || 0) * 0.2;
  const stakeBoost = stakeBoostMap[stakePeriod] ?? 1;
  const totalLighter =
    (Number(stakeAmount) || 0) * (stakePointRates[stakePeriod]?.lighter ?? 0);
  const totalBrighter =
    (Number(stakeAmount) || 0) * (stakePointRates[stakePeriod]?.brighter ?? 0);
  const currentRates = stakePointRates[stakePeriod];
  const stakePositions = useMemo(
    () => [
      {
        id: "pos-1",
        amount: 1200,
        unlockAt: Date.now() + 2 * 3600 * 1000,
      },
      {
        id: "pos-2",
        amount: 800,
        unlockAt: Date.now() + 20 * 3600 * 1000,
      },
      {
        id: "pos-3",
        amount: 500,
        unlockAt: Date.now() - 3600 * 1000,
      },
    ],
    []
  );
  const unlockAt = useMemo(
    () => stakeStart + (stakeDurationMs[stakePeriod] ?? 0),
    [stakePeriod, stakeStart]
  );
  const [nowTs, setNowTs] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const yourPositions = useMemo(() => [
    {
      id: 'pos-1',
      type: 'Deposit',
      amount: 5600,
      earnedUSD: 120.5,
      earnedLighter: 0,
      earnedBrighter: 0,
    },
    {
      id: 'pos-2',
      type: 'Staked',
      amount: 1200,
      earnedUSD: 45.2,
      earnedLighter: 120,
      earnedBrighter: 300,
      unlockAt: Date.now() + 10 * 24 * 3600 * 1000, // 10 days from now
    },
    {
      id: 'pos-3',
      type: 'Staked',
      amount: 800,
      earnedUSD: 22.1,
      earnedLighter: 80,
      earnedBrighter: 200,
      unlockAt: Date.now() - 2 * 24 * 3600 * 1000, // 2 days ago (unlocked)
    },
  ], []);

  const pendingDeposits = useMemo(() => [
    {
      id: 'dep-1',
      amount: 1000,
      claimableAt: Date.now() + 2 * 3600 * 1000, // 2 hours from now
    },
    {
      id: 'dep-2',
      amount: 750,
      claimableAt: Date.now() - 1 * 3600 * 1000, // 1 hour ago (claimable)
    },
  ], []);

  const pendingWithdrawals = useMemo(() => [
    {
      id: 'wd-1',
      amount: 300,
      claimableAt: Date.now() + 1 * 24 * 3600 * 1000, // T+1
    },
    {
      id: 'wd-2',
      amount: 500,
      claimableAt: Date.now() - 2 * 3600 * 1000, // 2 hours ago
    },
  ], []);

  const lifetimeEarnings = useMemo(() => {
    return yourPositions.reduce(
      (acc, pos) => {
        acc.usd += pos.earnedUSD;
        acc.lighter += pos.earnedLighter;
        acc.brighter += pos.earnedBrighter;
        return acc;
      },
      { usd: 0, lighter: 0, brighter: 0 }
    );
  }, [yourPositions]);

  // Animate deposit percentage from 25% to 100%
  useEffect(() => {
    if (activeTab !== "Deposit") return;

    const duration = 3500; // 3.5 seconds (slower)
    const startValue = 25;
    const endValue = 100;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      setDepositPercent(Math.round(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Reset and start animation
    setDepositPercent(startValue);
    requestAnimationFrame(animate);
  }, [activeTab]);
  const txHistory = [
    {
      time: "2025-12-09 14:22:33",
      action: "Deposit",
      amount: "2,000 USDC",
      receive: "1,960 USDL",
      tx: "0x91e...6cQ27",
    },
    {
      time: "2025-12-08 11:15:22",
      action: "Request Withdraw",
      amount: "850 USDL",
      tx: "0x7af...d14b1",
    },
    {
      time: "2025-12-07 09:30:10",
      action: "Withdraw",
      amount: "1,200 USDC",
      burn: "1,150 USDL",
      tx: "0x4c1...0a9cd",
    },
    {
      time: "2025-12-06 16:45:18",
      action: "Stake",
      amount: "1,500 USDL",
      tx: "0xab3...8f2c4",
    },
    {
      time: "2025-12-05 13:20:55",
      action: "Claim",
      amount: "800 USDC",
      tx: "0x9c2...1d5e7",
    },
    {
      time: "2025-12-04 10:30:42",
      action: "Deposit",
      amount: "1,800 USDC",
      receive: "1,764 USDL",
      tx: "0x6fa...2bd84",
    },
    {
      time: "2025-12-03 15:22:18",
      action: "Request Withdraw",
      amount: "1,100 USDL",
      tx: "0x9ed...4fb22",
    },
    {
      time: "2025-12-02 08:45:33",
      action: "Withdraw",
      amount: "880 USDC",
      burn: "850 USDL",
      tx: "0x2af...8cc03",
    },
    {
      time: "2025-12-01 12:10:05",
      action: "Stake",
      amount: "2,100 USDL",
      tx: "0x8de...5cf91",
    },
    {
      time: "2025-11-30 09:33:47",
      action: "Claim",
      amount: "950 USDC",
      tx: "0x3bc...7ea19",
    },
  ];
  const [txPage, setTxPage] = useState(0);
  const pageSize = 5;
  const txTotalPages = Math.ceil(txHistory.length / pageSize);
  const txPageData = txHistory.slice(
    txPage * pageSize,
    txPage * pageSize + pageSize
  );
  const remainingMs = Math.max(0, unlockAt - nowTs);
  const claimReady = remainingMs <= 0;
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

  const aprHistorySeries = useMemo(
    () => [
      45, 47, 48, 46, 49, 51, 52, 50, 53, 55, 54, 56, 58, 57, 59, 60, 58, 61,
      62, 60, 63, 64, 62, 65, 63, 64, 66, 65, 63, 64, 62, 63, 65, 64, 63, 65,
      64, 63, 62, 63, 64, 63, 62, 63, 64, 63, 62, 63, 64, 63, 62, 63, 64, 63,
      62, 63, 64, 63,
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

  const dailyLighterOnDeposit = useMemo(() => {
    if (!stakeOnDeposit) return 0;
    const durationInDays = { "30d": 30, "90d": 90, "180d": 180, "365d": 365 }[stakePeriod];
    const lighterPoints = (Number(zapAmount) || 0) * (stakePointRates[stakePeriod]?.lighter ?? 0);
    return lighterPoints / durationInDays;
  }, [zapAmount, stakePeriod, stakeOnDeposit]);

  const dailyBrighterOnDeposit = useMemo(() => {
    if (!stakeOnDeposit) return 0;
    const durationInDays = { "30d": 30, "90d": 90, "180d": 180, "365d": 365 }[stakePeriod];
    const brighterPoints = (Number(zapAmount) || 0) * (stakePointRates[stakePeriod]?.brighter ?? 0);
    return brighterPoints / durationInDays;
  }, [zapAmount, stakePeriod, stakeOnDeposit]);

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white font-mono relative">
      {/* Terminal Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{
        background: 'repeating-linear-gradient(0deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.15) 1px, transparent 1px, transparent 2px)'
      }} />

      <div className="relative mx-auto max-w-7xl px-6 py-10 pb-28 md:px-10 md:pb-10">
        <header className="flex items-center justify-between gap-4 border border-white/10 bg-[#0a0a1f] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2">
              <img
                src={brighterLogo}
                alt="Brighter"
                className="h-10 w-8 object-contain"
              />
            </div>
            <div className="border-l border-white/20 pl-3">
              <p className="text-lg font-bold tracking-[0.3em] text-white uppercase">BRIGHTER</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 text-xs text-white md:flex">
            {(["Deposit"] as Tab[]).map(
              (item) => {
                const isActive = activeTab === item;
                return (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`border border-white/10 px-3 py-1.5 transition focus:outline-none font-mono uppercase tracking-wider ${
                      isActive
                        ? "bg-white/10 text-white border-white/30"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item === "Deposit" ? "Earn" : item === "Earn" ? "Supply" : item}
                  </button>
                );
              }
            )}
          </nav>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 border border-indigo-500/50 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 uppercase tracking-wider transition hover:bg-indigo-500/20 hover:border-indigo-400 focus:outline-none">
              <Wallet className="h-4 w-4" />
              CONNECT_WALLET
            </button>
          </div>
        </header>

        <main className="mt-8">
          {activeTab === "Loop" && (
            <section className="relative overflow-hidden border border-white/10 bg-[#0a0a1f] p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 border border-white/20 bg-[#0a0a1f] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gray-400">
                    <Sparkles className="h-3 w-3" />
                    {'>'} LOOPING_CONSOLE
                  </div>
                  <h1 className="mt-3 text-xl font-bold tracking-wider text-white uppercase md:text-2xl border-l-4 border-indigo-500 pl-4">
                    MULTIPLY_LLP_YIELD // 1-CLICK_LOOPING
                  </h1>
                  <p className="mt-2 text-xs text-gray-500 font-mono tracking-wide">
                    {'>'} DEPOSIT_LLP, SET_LEVERAGE // AUTO_RECURSIVE_BORROWS
                    <br />
                    {'>'} SWAPS && HEALTH_CHECKS =={'>'} AUTOMATED
                  </p>
                </div>
                <div className="flex items-center gap-3 border border-white/20 bg-[#0a0a1f] px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <TrendingUp className="h-4 w-4" />
                  TVL: $124.5M
                </div>
              </div>

              <div className="mt-6 space-y-4 border border-white/10 bg-[#0a0a1f] p-5">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    {'>'} DEPOSIT_LLP
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">
                    BALANCE: 12,450 LLP
                  </span>
                </div>
                <div className="relative">
                  <input
                    value={llpDeposit}
                    onChange={(e) => setLlpDeposit(e.target.value)}
                    className="w-full border border-white/20 bg-[#0a0a1f] px-4 py-3 text-lg font-mono text-white focus:border-white/40 focus:outline-none"
                    placeholder="0.0"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center gap-2 text-xs text-gray-400">
                    <img src={llpLogo} alt="LLP" className="h-5 w-5 opacity-70 rounded-full" />
                    LLP
                    <span className="h-6 w-px bg-white/20" />
                    <button className="border border-white/20 bg-[#0a0a1f] px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider hover:bg-white/5">
                      MAX
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                    <span className="font-bold text-white uppercase tracking-wider">{'>'} LEVERAGE</span>
                    <span className="font-mono text-white text-base">
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
                    className="mt-3 w-full accent-indigo-400"
                    style={{
                      background: `linear-gradient(to right, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.3) ${((leverage - 1) / 9) * 100}%, rgba(255, 255, 255, 0.1) ${((leverage - 1) / 9) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                    }}
                  />
                  <div className="mt-2 flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>1x</span>
                    <span>10x</span>
                  </div>
                </div>

                <div className="grid gap-3 border border-white/10 bg-[#0a0a1f] p-4 md:grid-cols-4">
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
                  <div className="flex flex-col justify-between  bg-gradient-to-r from-cyan-400/15 via-yellow-300/20 to-cyan-400/15 px-4 py-3 text-center shadow-lg shadow-cyan-500/20">
                    <span className="text-xs uppercase tracking-widest text-slate-200">
                      Net APY
                    </span>
                    <span className="text-3xl font-semibold text-white drop-shadow-[0_0_18px_rgba(94,234,212,0.35)]">
                      {formatPercent(netApy)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3  border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <Shield className="h-4 w-4 text-cyan-300" />
                      Health Monitor
                    </div>
                    <div className="text-xs text-slate-400">
                      Liq. @ ${liquidationPrice.toFixed(3)}
                    </div>
                  </div>
                  <div className="relative h-4 overflow-hidden  bg-white/5">
                    <div
                      className="h-full  bg-gradient-to-r from-green-400 via-yellow-300 to-red-500"
                      style={{ width: `${safetyPct}%` }}
                    />
                    <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2  border border-white/30 bg-slate-900/90 text-[10px] font-semibold text-white shadow-lg shadow-cyan-500/20">
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

                <button className="flex w-full items-center justify-center gap-2 border border-indigo-500/50 bg-indigo-500/10 px-4 py-3 text-sm font-bold text-indigo-300 uppercase tracking-[0.2em] transition hover:bg-indigo-500/20 hover:border-indigo-400 focus:outline-none">
                  <Zap className="h-4 w-4" />
                  {'>'} EXECUTE_LOOP
                </button>
              </div>
            </section>
          )}

          {activeTab === "Earn" && (
            <section className="relative overflow-hidden  border border-white/5 bg-slate-900/60 p-6 shadow-xl shadow-yellow-300/10 backdrop-blur">
              <div className="absolute -left-10 -top-10 h-48 w-48  bg-gradient-to-br from-yellow-300/15 via-transparent to-cyan-300/10 blur-3xl" />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2  border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-yellow-100">
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
                <div className=" bg-white/5 px-3 py-1 text-xs text-slate-300">
                  Pool Utilization: 62%
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="text-xs text-slate-400">Supply Amount</label>
                <div className="relative">
                  <input
                    value={usdcSupply}
                    onChange={(e) => setUsdcSupply(e.target.value)}
                    className="w-full  border border-white/10 bg-slate-950/60 px-4 py-3 text-base font-mono text-white focus:border-yellow-300/60 focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center gap-2 text-xs text-slate-400">
                    <img
                      src={usdcLogo}
                      alt="USDC"
                      className="h-4 w-4  bg-slate-900 p-[1px]"
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
                <button className="mt-4 w-full  border border-yellow-300/40 bg-yellow-300/15 px-4 py-3 text-sm font-semibold text-yellow-100 shadow-lg shadow-yellow-300/15 transition hover:-translate-y-0.5 focus:outline-none">
                  Supply
                </button>
              </div>
            </section>
          )}

          {activeTab === "Deposit" && (
            <section className="relative overflow-hidden border border-white/10 bg-[#0a0a1f] p-6">
              {/* Two-column grid layout */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column: Header, Stats, Chart */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider md:text-2xl border-l-4 border-indigo-500 pl-4">
                      DEPOSIT_USDC & GET <br/>
                      <span className="inline-flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-indigo-300 md:text-5xl">
                          {depositPercent}%
                        </span>
                        <span className="text-xl text-indigo-300 md:text-2xl">LLP_ALLOCATION</span>
                      </span>
                    </h2>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <HoverAmountCard
                      label="Total deposited"
                      amount={totalDeposited}
                    />
                    <HoverAmountCard
                      label="Total staked"
                      amount={yourDeposited}
                    />
                    <div
                      className="relative border border-white/10 bg-slate-800 px-4 py-3"
                      onMouseEnter={() => setAprHover(true)}
                      onMouseLeave={() => setAprHover(false)}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-mono">
                        APR
                      </p>
                      <p className="text-2xl font-semibold text-white font-mono">
                        {headlineApr}
                      </p>
                      {aprHover && (
                        <div className="absolute right-0 top-16 z-20 w-64 border border-white/20 bg-[#0a0a1f] p-3 text-xs text-white font-mono">
                          <div className="flex items-center justify-between">
                            <span>LLP_YIELD</span>
                            <span className="text-gray-400">35%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* NAV Chart */}
                  <APRHistoryCard
                    data={usdlPriceSeries}
                    range={priceRange}
                    onRangeChange={setPriceRange}
                  />
                </div>

                {/* Right Column */}
                <div>
                  {/* Main Deposit/Withdraw Section - Enhanced */}
                  <div className="space-y-6 border border-white/10 bg-[#0a0a1f] p-6">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 border border-white/10 bg-[#0a0a1f] p-1 text-sm text-white font-mono">
                      {["deposit", "withdraw", "stake"].map((mode) => {
                        const isActive = depositMode === mode;
                        return (
                          <button
                            key={mode}
                            className={`px-6 py-2.5 font-semibold transition uppercase tracking-wider ${
                              isActive
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50"
                                : "text-gray-500 hover:text-white border border-transparent"
                            }`}
                            onClick={() =>
                              setDepositMode(mode as "deposit" | "withdraw" | "stake")
                            }
                          >
                            {mode === "deposit" ? "DEPOSIT" : mode === "withdraw" ? "WITHDRAW" : "STAKE"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {depositMode === "deposit" ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-white uppercase tracking-wider font-mono">
                            {'>'} SOURCE_CHAIN
                          </label>
                          <div className="relative mt-2">
                            <select
                              value={zapChain}
                              onChange={(e) => setZapChain(e.target.value)}
                              className="w-full appearance-none border border-white/20 bg-slate-800 px-4 py-4 pl-12 pr-10 text-base text-white font-mono focus:border-white/40 focus:outline-none uppercase"
                              style={{
                                backgroundImage: `url(${chainIcons[zapChain]})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "12px center",
                                backgroundSize: "24px 24px",
                              }}
                            >
                              {[
                                "Ethereum",
                                "Arbitrum",
                                "Base",
                                "Avalanche",
                              ].map((chain) => (
                                <option key={chain}>{chain}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white uppercase tracking-wider font-mono">
                            {'>'} DESTINATION
                          </label>
                          <div className="mt-2 flex items-center gap-3 border border-white/20 bg-slate-800 px-4 py-4 text-base font-semibold text-white font-mono uppercase">
                            <img
                              src={chainIcons.Ethereum}
                              alt="Ethereum"
                              className="h-6 w-6 opacity-70 rounded-full"
                            />
                            ETHEREUM
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-white font-mono">
                          <label className="font-medium uppercase tracking-wider">{'>'} Deposit</label>
                          <span className="text-gray-500 text-xs">BALANCE: 12,000 USDC</span>
                        </div>
                        <div className="relative">
                          <input
                            value={zapAmount}
                            onChange={(e) => setZapAmount(e.target.value)}
                            className="w-full border border-white/20 bg-slate-800 px-5 py-5 pr-32 text-3xl font-mono text-white focus:border-white/40 focus:outline-none"
                            placeholder="0.0"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-base font-semibold text-white uppercase font-mono">
                            <img
                              src={usdcLogo}
                              alt="USDC"
                              className="h-9 w-9 opacity-70 rounded-full"
                            />
                            USDC
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 rounded border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white uppercase tracking-wider font-mono">
                            Stake to earn extra <span className="text-cyan-300">Lighter</span> & <span className="text-cyan-300">Brighter</span> points
                          </span>
                          <button
                            onClick={() => setStakeOnDeposit(!stakeOnDeposit)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              stakeOnDeposit ? 'bg-green-500' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                stakeOnDeposit ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {stakeOnDeposit && (
                          <div className="space-y-3 border-t border-white/10 pt-4">
                            <label className="text-sm text-slate-400">Stake period (longer = higher boost)</label>
                            <div className="flex flex-wrap gap-2">
                              {(["30d", "90d", "180d", "365d"] as const).map(
                                (period) => (
                                  <button
                                    key={period}
                                    onClick={() => setStakePeriod(period)}
                                    className={`rounded px-4 py-2 text-sm font-semibold transition ${
                                      stakePeriod === period
                                        ? "bg-cyan-400/20 text-cyan-100 border border-cyan-400/50"
                                        : "bg-white/5 text-slate-300 hover:text-white border border-transparent"
                                    }`}
                                  >
                                    {period}
                                  </button>
                                )
                              )}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 text-sm">
                                <div className="flex justify-between text-slate-300">
                                    <span>Est. Daily Lighter Points:</span>
                                    <span className="font-mono text-cyan-300">{dailyLighterOnDeposit.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>Est. Daily Brighter Points:</span>
                                    <span className="font-mono text-cyan-300">{dailyBrighterOnDeposit.toFixed(2)}</span>
                                </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border border-white/20 bg-black/40 p-4">
                        <h3 className="text-sm font-medium text-white uppercase tracking-wider font-mono mb-3">
                          Detail
                        </h3>
                        <div className="space-y-2">
                          {stakeOnDeposit ? (
                            <>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1">
                                  Performance fee
                                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs border border-gray-400 rounded-full">?</span>
                                </span>
                                <span className="text-gray-300 font-mono">10%</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1">
                                  Withdrawable at
                                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs border border-gray-400 rounded-full">?</span>
                                </span>
                                <span className="text-yellow-400 font-mono">JUN 8, 2026</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1">
                                  You can claim sUSDL after
                                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs border border-gray-400 rounded-full">?</span>
                                </span>
                                <span className="text-gray-300 font-mono">
                                  12/20/2025, 16:00 PM
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1">
                                  Performance fee
                                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs border border-gray-400 rounded-full">?</span>
                                </span>
                                <span className="text-gray-300 font-mono">10%</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1">
                                  Withdrawal period
                                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs border border-gray-400 rounded-full">?</span>
                                </span>
                                <span className="text-cyan-400 font-mono">Less than 24 hours</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <button className="flex w-full items-center justify-center gap-2 bg-indigo-500 px-6 py-4 text-base font-bold text-white uppercase tracking-tight transition hover:bg-indigo-600 focus:outline-none font-mono">
                        <Zap className="h-5 w-5" />
                        {stakeOnDeposit
                          ? `Stake USDC (Withdrawable at ${new Date(unlockAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })})`
                          : "Deposit USDC"}
                      </button>
                    </>
                  ) : depositMode === "withdraw" ? (
                    <>
                      <div>
                        <label className="text-sm font-medium text-white uppercase tracking-wider font-mono">{'>'} CHAIN</label>
                        <div className="mt-2 flex items-center gap-3 border border-white/20 bg-slate-800 px-4 py-4 text-base font-semibold text-white font-mono uppercase">
                          <img
                            src={chainIcons.Ethereum}
                            alt="Ethereum"
                            className="h-6 w-6 opacity-70 rounded-full"
                          />
                          ETHEREUM
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-white font-mono">
                          <label className="font-medium uppercase tracking-wider">{'>'} WITHDRAW_AMOUNT</label>
                          <span className="text-gray-500 text-xs">Deposited: 5,600 USDL</span>
                        </div>
                        <div className="relative">
                          <input
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="w-full border border-white/20 bg-slate-800 px-5 py-5 pr-32 text-3xl font-mono text-white focus:border-white/40 focus:outline-none"
                            placeholder="0.0"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-base font-semibold text-white uppercase font-mono">
                            <img
                              src={usdlLogo}
                              alt="USDL"
                              className="h-9 w-9 opacity-70 rounded-full"
                            />
                            USDL
                          </div>
                        </div>
                      </div>

                      <div className="border border-white/20 bg-black/40 p-4">
                        <h3 className="text-sm font-medium text-white uppercase tracking-wider font-mono mb-3">
                          Simulation
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">You will receive</span>
                            <span className="text-cyan-400 font-mono font-semibold">
                              {Number(withdrawAmount || 0).toFixed(0)} USDC
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Withdrawal time</span>
                            <span className="text-gray-300 font-mono">T+1</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Withdrawable at</span>
                            <span className="text-gray-300 font-mono text-xs">
                              {new Date(nowTs + 24 * 3600 * 1000).toLocaleString("en-US", {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="flex w-full items-center justify-center gap-2 border border-gray-500/50 bg-gray-500/10 px-6 py-4 text-base font-bold text-gray-300 uppercase tracking-[0.2em] transition hover:bg-gray-500/20 hover:border-gray-400 focus:outline-none font-mono">
                        <Zap className="h-5 w-5" />
                        REQUEST WITHDRAW
                      </button>
                    </>
                  ) : depositMode === "stake" ? (
                    <>
                      {/* USDL Amount Input */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-white font-mono">
                          <label className="font-medium uppercase tracking-wider">{'>'} STAKE_AMOUNT</label>
                          <span className="text-gray-500 text-xs">Balance: 5,600 USDL</span>
                        </div>
                        <div className="relative">
                          <input
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className="w-full border border-white/20 bg-slate-800 px-5 py-5 pr-32 text-3xl font-mono text-white focus:border-white/40 focus:outline-none"
                            placeholder="0.0"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-base font-semibold text-white uppercase font-mono">
                            <img
                              src={usdlLogo}
                              alt="USDL"
                              className="h-9 w-9 opacity-70 rounded-full"
                            />
                            USDL
                          </div>
                        </div>
                      </div>

                      {/* Stake Period */}
                      <div className="space-y-3">
                        <label className="text-xs text-gray-400 font-mono uppercase">
                          Stake period (longer = higher boost)
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {(["30d", "90d", "180d", "365d"] as const).map((period) => (
                            <button
                              key={period}
                              onClick={() => setStakePeriod(period)}
                              className={`border py-3 text-sm font-semibold font-mono transition ${
                                stakePeriod === period
                                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                                  : "border-white/20 bg-black/40 text-gray-400 hover:border-white/40 hover:text-white"
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Estimated Points */}
                      <div className="border border-white/20 bg-black/40 p-4 space-y-3">
                        <h3 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
                          Estimated Rewards
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400 font-mono">Est. Daily Lighter Points:</span>
                            <span className="text-cyan-400 font-mono font-semibold">
                              {((Number(stakeAmount) || 0) * (stakePointRates[stakePeriod]?.lighter ?? 0) /
                                { "30d": 30, "90d": 90, "180d": 180, "365d": 365 }[stakePeriod]).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400 font-mono">Est. Daily Brighter Points:</span>
                            <span className="text-cyan-400 font-mono font-semibold">
                              {((Number(stakeAmount) || 0) * (stakePointRates[stakePeriod]?.brighter ?? 0) /
                                { "30d": 30, "90d": 90, "180d": 180, "365d": 365 }[stakePeriod]).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stake Button */}
                      <button className="flex w-full items-center justify-center gap-2 bg-indigo-500 px-6 py-4 text-base font-bold text-white uppercase tracking-tight transition hover:bg-indigo-600 focus:outline-none font-mono">
                        <Zap className="h-5 w-5" />
                        STAKE USDL
                      </button>
                    </>
                  ) : null}
                  </div>
                </div>
              </div>

              {/* Your Positions - outside the grid, full width */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white uppercase tracking-wider font-mono border-l-4 border-cyan-400 pl-3">
                    {'>'} Your Positions
                  </h3>
                  <button
                    onClick={() => setShowTxHistory(true)}
                    className="flex items-center gap-2 border border-green-500/50 bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-300 uppercase tracking-wider transition hover:bg-green-500/20 hover:border-green-400 focus:outline-none"
                  >
                    TX_HISTORY_LOG
                  </button>
                </div>

                  <div className="inline-flex items-center gap-2 border border-white/10 bg-[#0a0a1f] p-1 text-sm text-white font-mono">
                    {(["Deposit", "Staked"] as const).map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-1.5 font-semibold transition uppercase tracking-wider ${
                          yourPositionsTab === tab
                            ? "bg-white/10 text-white"
                            : "text-gray-500 hover:text-white"
                        }`}
                        onClick={() => setYourPositionsTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    {yourPositions
                      .filter((pos) => pos.type === yourPositionsTab)
                      .map((pos) => (
                      <div key={pos.id} className="border border-white/10 bg-slate-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold uppercase px-2 py-1 border ${
                              pos.type === 'Staked'
                                ? 'text-cyan-300 border-cyan-300/50 bg-cyan-500/10'
                                : 'text-indigo-300 border-indigo-300/50 bg-indigo-500/10'
                            }`}>
                              {pos.type}
                            </span>
                            <div className="font-mono text-white text-lg">
                              {pos.amount.toLocaleString()} USDL
                            </div>
                          </div>
                          {pos.type === 'Staked' && pos.unlockAt && (
                            <div className="flex items-center gap-3">
                              <div className="text-xs text-slate-400">
                                Unlock at: {new Date(pos.unlockAt).toLocaleString()}
                              </div>
                              <button
                                disabled={nowTs < pos.unlockAt}
                                className={`px-4 py-2 text-xs font-semibold transition ${
                                  nowTs >= pos.unlockAt
                                    ? "bg-green-500/20 text-green-300 border border-green-500/50 hover:bg-green-500/30 cursor-pointer"
                                    : "cursor-not-allowed bg-white/5 text-slate-500 border border-white/10"
                                }`}
                              >
                                Claim
                              </button>
                            </div>
                          )}
                          {pos.type === 'Deposit' && (
                            <div className="text-sm font-semibold text-green-400 font-mono">
                              Earning APR {headlineApr}
                            </div>
                          )}
                        </div>
                        {pos.type === 'Deposit' && (
                          <>
                            {pendingDeposits.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
                                <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                                  Pending Deposits
                                </h4>
                                {pendingDeposits.map((deposit) => {
                                  const isClaimable = nowTs >= deposit.claimableAt;
                                  return (
                                    <div key={deposit.id} className="flex items-center justify-between border border-white/10 bg-slate-900 p-3 rounded">
                                      <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold uppercase px-2 py-1 border text-cyan-300 border-cyan-300/50 bg-cyan-500/10">
                                          Pending Deposit
                                        </span>
                                        <div className="font-mono text-white text-lg">
                                          {deposit.amount.toLocaleString()} USDC
                                        </div>
                                      </div>
                                      <button
                                        disabled={!isClaimable}
                                        className={`px-4 py-2 text-xs font-semibold transition ${
                                          isClaimable
                                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 hover:bg-indigo-500/30"
                                            : "cursor-not-allowed bg-white/5 text-slate-500 border border-white/10"
                                        }`}
                                      >
                                        {isClaimable
                                          ? "Claim"
                                          : `Claim at ${new Date(deposit.claimableAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                        }
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {pendingWithdrawals.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
                                <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                                  Pending Withdrawals
                                </h4>
                                {pendingWithdrawals.map((withdrawal) => {
                                  const isClaimable = nowTs >= withdrawal.claimableAt;
                                  return (
                                    <div key={withdrawal.id} className="flex items-center justify-between border border-white/10 bg-slate-900 p-3 rounded">
                                      <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold uppercase px-2 py-1 border text-orange-300 border-orange-300/50 bg-orange-500/10">
                                          Pending Withdraw
                                        </span>
                                        <div className="font-mono text-white text-lg">
                                          {withdrawal.amount.toLocaleString()} USDL
                                        </div>
                                      </div>
                                      <button
                                        disabled={!isClaimable}
                                        className={`px-4 py-2 text-xs font-semibold transition ${
                                          isClaimable
                                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 hover:bg-indigo-500/30"
                                            : "cursor-not-allowed bg-white/5 text-slate-500 border border-white/10"
                                        }`}
                                      >
                                        {isClaimable
                                          ? "Claim"
                                          : `Claimable at ${new Date(withdrawal.claimableAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                        }
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              {/* Transaction History Modal */}
              {showTxHistory && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                  onClick={() => setShowTxHistory(false)}
                >
                  <div
                    className="relative w-full max-w-4xl border-2 border-green-500/50 bg-black p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b-2 border-green-500/30 pb-4">
                      <h3 className="text-2xl font-semibold text-green-400 uppercase tracking-wider font-mono">
                        {'>'} TX_HISTORY_LOG
                      </h3>
                      <button
                        onClick={() => setShowTxHistory(false)}
                        className="border-2 border-green-500/50 p-2 text-green-400 transition hover:bg-green-500/10 hover:text-green-300 focus:outline-none"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-green-600 font-mono">
                      {'>'} RECENT_ON-CHAIN_ACTIONS
                    </p>

                    <div className="mt-6 overflow-hidden border-2 border-green-500/30">
                      <div className="grid grid-cols-[1.2fr_1.6fr_1.2fr_1fr] bg-black border-b-2 border-green-500/30 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-green-400 font-mono">
                        <span>{'>'} TIME</span>
                        <span>{'>'} ACTION</span>
                        <span className="text-right">{'>'} AMOUNT</span>
                        <span className="text-right">{'>'} TXN</span>
                      </div>
                      <div className="max-h-96 divide-y divide-green-500/20 overflow-y-auto bg-black">
                        {txPageData.map((tx) => (
                          <div
                            key={tx.tx}
                            className="grid grid-cols-[1.2fr_1.6fr_1.2fr_1fr] items-center px-4 py-3 text-sm text-green-400 hover:bg-green-500/10 font-mono"
                          >
                            <span className="text-xs text-green-600">
                              {tx.time}
                            </span>
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center gap-2 border-2 px-2 py-1 text-xs font-semibold uppercase ${
                                  tx.action === "Deposit"
                                    ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300"
                                    : tx.action === "Withdraw"
                                    ? "border-amber-400/60 bg-amber-400/15 text-amber-300"
                                    : tx.action === "Request Withdraw"
                                    ? "border-orange-400/60 bg-orange-400/15 text-orange-300"
                                    : tx.action === "Stake"
                                    ? "border-purple-400/60 bg-purple-400/15 text-purple-300"
                                    : tx.action === "Claim"
                                    ? "border-green-400/60 bg-green-400/15 text-green-300"
                                    : "border-green-500/40 bg-green-500/10 text-green-400"
                                }`}
                              >
                                [{tx.action}]
                              </span>
                            </div>
                            <div className="group relative flex items-center justify-end gap-2 font-mono text-cyan-300">
                              <img
                                src={
                                  tx.amount.includes("USDC")
                                    ? usdcLogo
                                    : usdlLogo
                                }
                                alt="asset"
                                className="h-5 w-5 opacity-70 rounded-full"
                              />
                              <span>[{tx.amount}]</span>
                              {(tx.receive || tx.burn) && (
                                <div className="pointer-events-none absolute right-0 top-full z-20 hidden whitespace-nowrap border-2 border-green-500/50 bg-black px-3 py-2 text-[11px] text-green-400 group-hover:block">
                                  {tx.receive && (
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={usdlLogo}
                                        alt="USDL"
                                        className="h-4 w-4 opacity-70 rounded-full"
                                      />
                                      <span>{'>'} RCV: {tx.receive}</span>
                                    </div>
                                  )}
                                  {tx.burn && (
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={usdlLogo}
                                        alt="USDL"
                                        className="h-4 w-4 opacity-70 rounded-full"
                                      />
                                      <span>{'>'} BURN: {tx.burn}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <a
                              href="#"
                              className="text-right text-xs font-semibold text-cyan-400 hover:underline font-mono"
                            >
                              {tx.tx}
                            </a>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-2 border-t-2 border-green-500/30 bg-black px-4 py-3 text-sm text-green-400 font-mono">
                        <button
                          onClick={() => setTxPage((p) => Math.max(0, p - 1))}
                          disabled={txPage === 0}
                          className={`border-2 border-green-500/40 px-3 py-1.5 uppercase tracking-wider ${
                            txPage === 0 ? "opacity-40 text-green-600" : "hover:bg-green-500/10"
                          }`}
                        >
                          {'<'} PREV
                        </button>
                        <span className="uppercase">
                          [PAGE {txPage + 1}/{txTotalPages}]
                        </span>
                        <button
                          onClick={() =>
                            setTxPage((p) => Math.min(txTotalPages - 1, p + 1))
                          }
                          disabled={txPage >= txTotalPages - 1}
                          className={`border-2 border-green-500/40 px-3 py-1.5 uppercase tracking-wider ${
                            txPage >= txTotalPages - 1
                              ? "opacity-40 text-green-600"
                              : "hover:bg-green-500/10"
                          }`}
                        >
                          NEXT {'>'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === "Borrow" && (
            <section className="relative mx-auto max-w-3xl overflow-hidden  border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-cyan-500/10 backdrop-blur">
              <div className="absolute -left-16 top-8 h-48 w-48  bg-gradient-to-br from-cyan-400/15 via-transparent to-yellow-300/10 blur-3xl" />
              <div className="space-y-4">
                <div className="space-y-3  border border-white/10 bg-white/5 p-5 shadow-inner shadow-cyan-500/10">
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
                      className="w-full  border border-white/10 bg-slate-950/70 px-4 py-3 pr-24 text-2xl font-mono text-white focus:border-cyan-400/60 focus:outline-none"
                      placeholder="0"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-white">
                      <img
                        src={llpLogo}
                        alt="LLP"
                        className="h-8 w-8  bg-cyan-500/10 p-1"
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
                          className=" bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                        >
                          {pct === 1 ? "Max" : `${pct * 100}%`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3  border border-white/10 bg-white/5 p-5 shadow-inner shadow-cyan-500/10">
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
                      className="w-full  border border-white/10 bg-slate-950/70 px-4 py-3 pr-24 text-2xl font-mono text-white focus:border-yellow-300/60 focus:outline-none"
                      placeholder="0"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-white">
                      <img
                        src={usdcLogo}
                        alt="USDC"
                        className="h-8 w-8  bg-slate-900 p-1"
                      />
                      <span className="text-sm font-semibold">USDC</span>
                    </div>
                  </div>
                </div>

                <CollateralGauge
                  llpDeposit={llpDeposit}
                  borrowAmount={borrowAmount}
                />

                <button className="w-full  bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-cyan-400/20 transition hover:-translate-y-0.5 focus:outline-none">
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
      {/* Mobile bottom nav with Earn & Stake only */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/90 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-around px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          {[
            { key: "Deposit", label: "Earn", icon: Wallet },
          ].map((item) => {
            const isActive = activeTab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as Tab)}
                className={`flex flex-col items-center justify-center gap-1  px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-white/15 text-white shadow-md shadow-cyan-500/25"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
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
    <div className="border border-white/10 bg-[#0a0a1f] px-3 py-2">
      <p className="text-[11px] uppercase tracking-widest text-gray-500 font-mono">
        {'>'} {label}
      </p>
      <p className={`text-xl font-semibold text-white font-mono ${accent ?? ""}`}>
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
    <div className="space-y-3  border border-white/10 bg-white/5 p-5 shadow-inner shadow-cyan-500/10">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-white">LTV (Loan-to-Value)</span>
        <span className="text-xs text-slate-400">
          {ltv > 0 ? `${ltv.toFixed(0)}%` : "- %"}
        </span>
      </div>
      <div className="relative h-4 overflow-hidden  bg-white/5">
        <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-green-400 via-amber-400 to-red-500 opacity-70" />
        <div
          className="absolute -top-1 h-6 w-6  border border-white/50 bg-slate-900/90 shadow-lg shadow-cyan-500/30"
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
    <div className=" border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-200">
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
      <div className="mt-4 flex items-center gap-2  border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-slate-400">
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

function HoverAmountCard({ label, amount }: { label: string; amount: string }) {
  const [hover, setHover] = useState(false);
  const usdlEstimate = label.toLowerCase().includes("total")
    ? "~ 128.4M USDL"
    : "~ 12,400 USDL";
  return (
    <div
      className="relative border border-white/10 bg-slate-900 px-4 py-3"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-mono">
        {label}
      </p>
      <p className="text-2xl font-semibold text-white font-mono">{amount}</p>
      {hover && (
        <div className="absolute left-0 top-full mt-2 w-48 border border-white/20 bg-[#0a0a1f] p-3 text-xs text-white font-mono z-20">
          <div className="flex items-center gap-2">
            <img
              src={usdlLogo}
              alt="USDL"
              className="h-5 w-5 opacity-70 rounded-full"
            />
            <span className="text-gray-400">{usdlEstimate}</span>
          </div>
        </div>
      )}
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
    <div className="space-y-4 border border-white/10 bg-[#0a0a1f] p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">

            <p className="text-sm font-semibold text-white uppercase tracking-wider font-mono">{'>'} USDL_PRICE</p>
          </div>
          <span className="text-sm font-semibold text-white font-mono">
            1 USDL = {display.value.toFixed(3)} USDC
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          {["1W", "1M", "3M", "1Y", "ALL"].map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange(r as typeof range)}
              className={`border border-white/20 px-2 py-1 font-mono uppercase ${
                range === r
                  ? "bg-white/10 text-white"
                  : "bg-[#0a0a1f] text-gray-500 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden border border-white/10 bg-[#0a0a1f] p-0">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          className="block h-48 w-full"
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
            strokeWidth="0.5"
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
            <div className="pointer-events-none absolute right-4 top-4 border border-white/20 bg-[#0a0a1f] px-3 py-2 text-xs text-white font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-indigo-400 border border-indigo-300" />
                1 USDL = ${display.value.toFixed(3)} USDC
              </div>
              <div className="mt-1 text-[10px] text-gray-500 uppercase">
                {'>'} POINT {display.idx + 1}/{points.length}
              </div>
            </div>
            {hoverPoint && (
              <div
                className="pointer-events-none absolute border border-white/20 bg-[#0a0a1f] px-2 py-1 text-[10px] text-white font-mono"
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
      <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono uppercase">
        <span>{'>'} GROWTH_SINCE_INCEPTION</span>
        <span className="text-white">
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

function APRHistoryCard({
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

  const minValue = Math.min(...rangedData);
  const maxValue = Math.max(...rangedData);
  const yTicks = [
    maxValue,
    maxValue - (maxValue - minValue) * 0.25,
    maxValue - (maxValue - minValue) * 0.5,
    maxValue - (maxValue - minValue) * 0.75,
    minValue
  ];

  const [showDropdown, setShowDropdown] = useState(false);

  const rangeLabels: Record<string, string> = {
    "1W": "1W",
    "1M": "1M",
    "3M": "3M",
    "1Y": "1Y",
    "ALL": "All-time"
  };

  return (
    <div className="space-y-4 border border-white/10 bg-black p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">
            LLP Historic Performance (Net Asset Value)
          </span>
        </div>
        <div className="relative flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-3 py-1 text-gray-400 hover:text-white flex items-center gap-1"
          >
            {rangeLabels[range]} ▾
          </button>
          {showDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded shadow-lg z-10 min-w-[100px]">
              {["1W", "1M", "ALL"].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRangeChange(r as typeof range);
                    setShowDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/5 ${
                    range === r ? "text-green-400 bg-white/5" : "text-gray-400"
                  }`}
                >
                  {rangeLabels[r]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="relative bg-black pl-12 pr-4 pt-2 pb-8" style={{ height: '320px' }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-2 bottom-8 flex flex-col justify-between text-xs text-gray-500">
          {yTicks.map((tick, i) => (
            <div key={i} className="text-right pr-2" style={{ transform: 'translateY(-50%)' }}>
              {tick.toFixed(3)}
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="relative h-full">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            className="block h-full w-full"
            onMouseMove={handleHover}
            onMouseLeave={handleLeave}
          >
            <defs>
              <linearGradient id="navArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 20, 40, 60, 80].map((y) => (
              <line
                key={y}
                x1={0}
                x2={svgWidth}
                y1={y}
                y2={y}
                stroke="#1f2937"
                strokeWidth="0.2"
              />
            ))}

            <path d={areaPath} fill="url(#navArea)" />
            <path
              d={linePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2">
            {['2/1', '3/1', '4/1', '5/1', '6/1', '7/1', '8/1', '9/1', '10/1', '11/1', '12/1'].map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((totalSec % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSec % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}
