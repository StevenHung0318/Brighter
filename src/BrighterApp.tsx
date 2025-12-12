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

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  const [zapAmount, setZapAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositMode, setDepositMode] = useState<"deposit" | "withdraw" | "stake">(
    "deposit"
  );
  const [stakeAmount, setStakeAmount] = useState("");
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

  // Usability Test Mode
  const [isTestMode, setIsTestMode] = useState(false);
  const [testPositions, setTestPositions] = useState<Array<{
    id: string;
    type: 'Deposit' | 'Staked';
    amount: number;
    earnedUSD: number;
    earnedLighter: number;
    earnedBrighter: number;
    unlockAt?: number;
  }>>([]);
  const [testPendingDeposits, setTestPendingDeposits] = useState<Array<{
    id: string;
    amount: number;
    claimableAt: number;
  }>>([]);
  const [testPendingWithdrawals, setTestPendingWithdrawals] = useState<Array<{
    id: string;
    amount: number;
    claimableAt: number;
  }>>([]);
  const [userBalance, setUserBalance] = useState(10000); // Starting balance for test mode
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{
    type: 'deposit' | 'stake' | 'withdraw';
    amount: number;
    claimableAt?: number;
  } | null>(null);

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

  // Test Mode Functions
  const handleTestDeposit = (amount: number, shouldStake: boolean) => {
    console.log('handleTestDeposit called:', { amount, shouldStake, userBalance });

    if (amount > userBalance) {
      alert('Insufficient balance!');
      return;
    }

    // Show loading modal first
    setShowLoadingModal(true);

    // After 0.5 seconds, show success modal
    setTimeout(() => {
      setShowLoadingModal(false);
      setUserBalance(prev => prev - amount);

      if (shouldStake) {
        console.log('Creating staked position and showing stake modal');
        // Create staked position
        const newPosition = {
          id: `test-stake-${Date.now()}`,
          type: 'Staked' as const,
          amount,
          earnedUSD: 0,
          earnedLighter: 0,
          earnedBrighter: 0,
          unlockAt: Date.now() + stakeDurationMs[stakePeriod],
        };
        setTestPositions(prev => [...prev, newPosition]);

        // Show success modal for stake
        setSuccessModalData({
          type: 'stake',
          amount,
        });
        setShowSuccessModal(true);
        console.log('Modal state set to true for stake');
      } else {
        // Create pending deposit first
        const claimableAt = Date.now() + 24 * 3600 * 1000; // 24 hours from now
        const newPendingDeposit = {
          id: `test-pending-deposit-${Date.now()}`,
          amount,
          claimableAt,
        };
        setTestPendingDeposits(prev => [...prev, newPendingDeposit]);

        // Show success modal for deposit
        setSuccessModalData({
          type: 'deposit',
          amount,
          claimableAt,
        });
        setShowSuccessModal(true);
      }

      setLlpDeposit('');
      setStakeAmount('');
      setZapAmount('');
    }, 500);
  };

  const handleTestClaim = (type: 'deposit' | 'withdrawal', id: string) => {
    if (type === 'deposit') {
      const deposit = testPendingDeposits.find(d => d.id === id);
      if (!deposit) return;

      // Move to positions
      const newPosition = {
        id: `test-pos-${Date.now()}`,
        type: 'Deposit' as const,
        amount: deposit.amount,
        earnedUSD: 0,
        earnedLighter: 0,
        earnedBrighter: 0,
      };
      setTestPositions(prev => [...prev, newPosition]);
      setTestPendingDeposits(prev => prev.filter(d => d.id !== id));
    } else {
      const withdrawal = testPendingWithdrawals.find(w => w.id === id);
      if (!withdrawal) return;

      // Return to balance
      setUserBalance(prev => prev + withdrawal.amount * 1.006);
      setTestPendingWithdrawals(prev => prev.filter(w => w.id !== id));
    }
  };

  const handleTestWithdraw = (amount: number) => {
    // Calculate total deposited amount from all Deposit positions
    const currentTotalDeposited = testPositions
      .filter(p => p.type === 'Deposit')
      .reduce((sum, p) => sum + p.amount, 0);

    if (currentTotalDeposited < amount) {
      alert('Insufficient deposited amount!');
      return;
    }

    // Show loading modal first
    setShowLoadingModal(true);

    // After 0.5 seconds, show success modal
    setTimeout(() => {
      setShowLoadingModal(false);

      // Reduce deposit positions proportionally, starting from the first one
      let remainingToWithdraw = amount;
      setTestPositions(prev => prev.map(p => {
        if (p.type === 'Deposit' && remainingToWithdraw > 0) {
          const withdrawFromThis = Math.min(p.amount, remainingToWithdraw);
          remainingToWithdraw -= withdrawFromThis;
          const newAmount = p.amount - withdrawFromThis;
          if (newAmount <= 0) {
            return null;
          }
          return { ...p, amount: newAmount };
        }
        return p;
      }).filter(Boolean) as typeof testPositions);

      // Create pending withdrawal
      const claimableAt = Date.now() + 24 * 3600 * 1000; // T+1
      const newPendingWithdrawal = {
        id: `test-wd-${Date.now()}`,
        amount,
        claimableAt,
      };
      setTestPendingWithdrawals(prev => [...prev, newPendingWithdrawal]);

      setWithdrawAmount('');

      // Show success modal for withdraw
      setSuccessModalData({
        type: 'withdraw',
        amount,
        claimableAt,
      });
      setShowSuccessModal(true);
    }, 500);
  };

  const handleTestUnstake = (positionId: string) => {
    const position = testPositions.find(p => p.id === positionId && p.type === 'Staked');
    if (!position) return;

    // Remove staked position
    setTestPositions(prev => prev.filter(p => p.id !== positionId));

    // Create pending withdrawal
    const newPendingWithdrawal = {
      id: `test-unstake-${Date.now()}`,
      amount: position.amount,
      claimableAt: Date.now() + 24 * 3600 * 1000, // T+1
    };
    setTestPendingWithdrawals(prev => [...prev, newPendingWithdrawal]);
  };

  const yourPositions = useMemo(() => {
    if (isTestMode) {
      return testPositions;
    }
    return [
      {
        id: 'pos-1',
        type: 'Deposit' as const,
        amount: 5600,
        earnedUSD: 120.5,
        earnedLighter: 0,
        earnedBrighter: 0,
      },
      {
        id: 'pos-2',
        type: 'Staked' as const,
        amount: 1200,
        earnedUSD: 45.2,
        earnedLighter: 120,
        earnedBrighter: 300,
        unlockAt: Date.now() + 10 * 24 * 3600 * 1000, // 10 days from now
      },
      {
        id: 'pos-3',
        type: 'Staked' as const,
        amount: 800,
        earnedUSD: 22.1,
        earnedLighter: 80,
        earnedBrighter: 200,
        unlockAt: Date.now() - 2 * 24 * 3600 * 1000, // 2 days ago (unlocked)
      },
    ];
  }, [isTestMode, testPositions]);

  const pendingDeposits = useMemo(() => {
    if (isTestMode) {
      return testPendingDeposits;
    }
    return [
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
    ];
  }, [isTestMode, testPendingDeposits]);

  const pendingWithdrawals = useMemo(() => {
    if (isTestMode) {
      return testPendingWithdrawals;
    }
    return [
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
    ];
  }, [isTestMode, testPendingWithdrawals]);

  const totalDepositedAmount = useMemo(() => {
    return yourPositions
      .filter(pos => pos.type === 'Deposit')
      .reduce((sum, pos) => sum + pos.amount, 0);
  }, [yourPositions]);

  const totalSUSDbAmount = useMemo(() => {
    // sUSDb is obtained from staked positions (Deposit type positions that have been claimed)
    // In test mode, it's the total amount of Deposit positions
    // In production, sUSDb balance would come from claimed deposits
    return totalDepositedAmount;
  }, [totalDepositedAmount]);

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
      receive: "1,960 USDb",
      tx: "0x91e...6cQ27",
    },
    {
      time: "2025-12-08 11:15:22",
      action: "Request Withdraw",
      amount: "850 USDb",
      tx: "0x7af...d14b1",
    },
    {
      time: "2025-12-07 09:30:10",
      action: "Withdraw",
      amount: "1,200 USDC",
      burn: "1,150 USDb",
      tx: "0x4c1...0a9cd",
    },
    {
      time: "2025-12-06 16:45:18",
      action: "Stake",
      amount: "1,500 USDb",
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
      receive: "1,764 USDb",
      tx: "0x6fa...2bd84",
    },
    {
      time: "2025-12-03 15:22:18",
      action: "Request Withdraw",
      amount: "1,100 USDb",
      tx: "0x9ed...4fb22",
    },
    {
      time: "2025-12-02 08:45:33",
      action: "Withdraw",
      amount: "880 USDC",
      burn: "850 USDb",
      tx: "0x2af...8cc03",
    },
    {
      time: "2025-12-01 12:10:05",
      action: "Stake",
      amount: "2,100 USDb",
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
                    <TypewriterText />
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <AmountCard
                      label="Total deposited"
                      amount={totalDeposited}
                    />
                    <AmountCard
                      label="Total staked"
                      amount={yourDeposited}
                    />
                    <div
                      className="relative border border-white/10 bg-slate-800 px-4 py-3"
                    >
                      <p className="text-xs uppercase tracking-[-0.06em] text-gray-500 font-mono">
                        APR
                      </p>
                      <p className="text-2xl font-semibold text-white font-mono">
                        {headlineApr}
                      </p>
                    </div>
                  </div>
                  {/* NAV Chart */}
                  <PerformanceChart
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
                    <div className="grid grid-cols-3 w-full gap-2 border border-white/10 bg-[#0a0a1f] p-1 text-sm text-white font-mono">
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
                            {mode === "deposit" ? "STAKE" : mode === "withdraw" ? "WITHDRAW" : "LOCK"}
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
                          <span className="text-gray-500 text-xs">
                            BALANCE: {isTestMode ? `${userBalance.toLocaleString()}` : '12,000'} USDC
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            value={zapAmount}
                            onChange={(e) => setZapAmount(e.target.value)}
                            className="w-full border border-white/20 bg-slate-800 px-5 py-5 pr-32 text-3xl font-mono text-white focus:border-white/40 focus:outline-none"
                            placeholder="0"
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
                            Lock to earn extra <br/><span className="text-cyan-300">Lighter</span> & <span className="text-cyan-300">Brighter</span> points
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
                            <div className="grid grid-cols-4 gap-2">
                              {(["30d", "90d", "180d", "365d"] as const).map(
                                (period) => {
                                  const boostMultiplier = { "30d": "1x", "90d": "2x", "180d": "3x", "365d": "4x" }[period];
                                  return (
                                    <button
                                      key={period}
                                      onClick={() => setStakePeriod(period)}
                                      className={`group relative rounded px-4 py-2 text-sm font-semibold transition flex items-center justify-center gap-2 ${
                                        stakePeriod === period
                                          ? "bg-cyan-400/20 text-cyan-100 border border-cyan-400/50"
                                          : "bg-white/5 text-slate-300 hover:text-white border border-transparent"
                                      }`}
                                    >
                                      <span>{period}</span>
                                      <span className="text-xs opacity-70">{boostMultiplier}</span>
                                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-black border border-white/20 px-2 py-1 text-xs text-white rounded">
                                        {boostMultiplier} Lighter pts boost
                                      </span>
                                    </button>
                                  );
                                }
                              )}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 text-sm space-y-2">
                                <div className="flex justify-between text-slate-300">
                                    <span>Points Boost</span>
                                    <span className="font-mono text-cyan-300">
                                      {({ "30d": "1x", "90d": "2x", "180d": "3x", "365d": "4x" }[stakePeriod])}
                                    </span>
                                </div>
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
                                <span className="text-gray-400 flex items-center gap-1 group relative">
                                  You can claim sUSDb after
                                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs border border-gray-400 rounded-full cursor-help">?</span>
                                  <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 bg-black border border-white/20 px-3 py-2 text-xs text-white rounded z-10">
                                    sUSDb is your receipt token representing your position.
                                  </span>
                                </span>
                                <span className="text-gray-300 font-mono">
                                  12/20/2025, 16:00 PM
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1 group relative">
                                  Performance fee
                                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs border border-gray-400 rounded-full cursor-help">?</span>
                                  <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-80 bg-black border border-white/20 px-3 py-2 text-xs text-white rounded z-10">
                                    Brighter takes 10% of profits only — never your principal. The APR shown is already net of this fee.
                                  </span>
                                </span>
                                <span className="text-gray-300 font-mono">10%</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1 group relative">
                                  Withdrawal period
                                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs border border-gray-400 rounded-full cursor-help">?</span>
                                  <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-80 bg-black border border-white/20 px-3 py-2 text-xs text-white rounded z-10">
                                    After you request a withdrawal, it takes up to 24 hours to process. You'll need to return to claim your USDC once it's ready.
                                  </span>
                                </span>
                                <span className="text-cyan-400 font-mono">Less than 24 hours</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isTestMode) {
                            const amount = Number(zapAmount);
                            if (amount > 0) {
                              handleTestDeposit(amount, stakeOnDeposit);
                            } else {
                              alert('Please enter an amount');
                            }
                          }
                        }}
                        className="flex w-full items-center justify-center gap-2 bg-indigo-500 px-6 py-4 text-base font-bold text-white uppercase tracking-tight transition hover:bg-indigo-600 focus:outline-none font-mono">
                        <Zap className="h-5 w-5" />
                        {stakeOnDeposit
                          ? `Lock USDC (Withdrawable at ${new Date(unlockAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })})`
                          : "Stake USDC"}
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
                          <span className="text-gray-500 text-xs">Deposited: {totalDepositedAmount.toLocaleString()} USDb</span>
                        </div>
                        <div className="relative">
                          <input
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="w-full border border-white/20 bg-slate-800 px-5 py-5 pr-32 text-3xl font-mono text-white focus:border-white/40 focus:outline-none"
                            placeholder="0"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-base font-semibold text-white uppercase font-mono">
                            <img
                              src={usdlLogo}
                              alt="USDb"
                              className="h-9 w-9 opacity-70 rounded-full"
                            />
                            USDb
                          </div>
                        </div>
                      </div>

                      <div className="border border-white/20 bg-black/40 p-4">
                        <h3 className="text-sm font-medium text-white uppercase tracking-wider font-mono mb-3">
                          Simulation
                        </h3>
                        <div className="space-y-2">
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

                      <button
                        onClick={() => {
                          if (isTestMode) {
                            const amount = Number(withdrawAmount);
                            if (amount > 0) {
                              handleTestWithdraw(amount);
                            }
                          }
                        }}
                        className="flex w-full items-center justify-center gap-2 border border-gray-500/50 bg-gray-500/10 px-6 py-4 text-base font-bold text-gray-300 uppercase tracking-[0.2em] transition hover:bg-gray-500/20 hover:border-gray-400 focus:outline-none font-mono">
                        <Zap className="h-5 w-5" />
                        REQUEST WITHDRAW
                      </button>
                    </>
                  ) : depositMode === "stake" ? (
                    <>
                      {/* sUSDb Amount Input */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-white font-mono">
                          <label className="font-medium uppercase tracking-wider">{'>'} LOCK_AMOUNT</label>
                          <span className="text-gray-500 text-xs">
                            Balance: {isTestMode ? `${totalSUSDbAmount.toLocaleString()}` : '5,600'} sUSDb
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className="w-full border border-white/20 bg-slate-800 px-5 py-5 pr-32 text-3xl font-mono text-white focus:border-white/40 focus:outline-none"
                            placeholder="0"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-base font-semibold text-white uppercase font-mono">
                            <img
                              src={usdlLogo}
                              alt="sUSDb"
                              className="h-9 w-9 opacity-70 rounded-full"
                            />
                            sUSDb
                          </div>
                        </div>
                      </div>

                      {/* Lock Period */}
                      <div className="space-y-3">
                        <label className="text-xs text-gray-400 font-mono uppercase">
                          Lock period (longer = higher boost)
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {(["30d", "90d", "180d", "365d"] as const).map((period) => {
                            const boostMultiplier = { "30d": "1x", "90d": "2x", "180d": "3x", "365d": "4x" }[period];
                            return (
                              <button
                                key={period}
                                onClick={() => setStakePeriod(period)}
                                className={`group relative border py-3 text-sm font-semibold font-mono transition flex flex-col items-center gap-1 ${
                                  stakePeriod === period
                                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                                    : "border-white/20 bg-black/40 text-gray-400 hover:border-white/40 hover:text-white"
                                }`}
                              >
                                <span>{period}</span>
                                <span className="text-xs opacity-70">{boostMultiplier}</span>
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-black border border-white/20 px-2 py-1 text-xs text-white rounded z-10">
                                  {boostMultiplier} Lighter pts boost
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Estimated Points */}
                      <div className="border border-white/20 bg-black/40 p-4 space-y-3">
                        <h3 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
                          Estimated Rewards
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400 font-mono">Lighter Points Boost</span>
                            <span className="text-cyan-300 font-mono font-semibold">
                              {({ "30d": "1x", "90d": "2x", "180d": "3x", "365d": "4x" }[stakePeriod])}
                            </span>
                          </div>
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

                      {/* Lock Button */}
                      <button
                        onClick={() => {
                          if (isTestMode) {
                            const amount = Number(stakeAmount);
                            if (amount > 0) {
                              handleTestDeposit(amount, true);
                            }
                          }
                        }}
                        className="flex w-full items-center justify-center gap-2 bg-indigo-500 px-6 py-4 text-base font-bold text-white uppercase tracking-tight transition hover:bg-indigo-600 focus:outline-none font-mono">
                        <Zap className="h-5 w-5" />
                        LOCK sUSDb
                      </button>
                    </>
                  ) : null}
                  </div>
                </div>
              </div>

              {/* Your Positions - outside the grid, full width */}
              <div id="your-positions" className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white uppercase tracking-wider font-mono border-l-4 border-cyan-400 pl-3">
                    {'>'} Your Positions
                  </h3>
                  {/* TX_HISTORY_LOG button hidden for now */}
                  {/* <button
                    onClick={() => setShowTxHistory(true)}
                    className="flex items-center gap-2 border border-green-500/50 bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-300 uppercase tracking-wider transition hover:bg-green-500/20 hover:border-green-400 focus:outline-none"
                  >
                    TX_HISTORY_LOG
                  </button> */}
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
                        {tab === 'Deposit' ? 'Staked' : 'Locked'}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    {/* Show total for Deposit tab - always show if there are any deposits or pending deposits */}
                    {yourPositionsTab === 'Deposit' && (totalDepositedAmount > 0 || pendingDeposits.length > 0) && (
                      <div className="border border-white/10 bg-slate-800 p-6 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm text-gray-400 mb-2">
                              You Staked
                            </div>
                            <div className="font-mono text-white text-3xl font-bold">
                              {totalDepositedAmount.toLocaleString()} USDC
                            </div>
                          </div>
                          {totalDepositedAmount > 0 && (
                            <div className="flex items-center gap-2 text-green-400 font-mono">
                              <Sparkles className="h-4 w-4" />
                              <span className="text-sm">Earning {headlineApr} APR</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Show individual Locked positions */}
                    {yourPositionsTab === 'Staked' && yourPositions
                      .filter((pos) => pos.type === 'Staked')
                      .map((pos) => {
                        // Calculate locked days from unlock time
                        const lockedDays = pos.unlockAt ? Math.round((pos.unlockAt - Date.now()) / (24 * 3600 * 1000)) : 0;

                        return (
                          <div key={pos.id} className="border border-white/10 bg-slate-800 p-6 rounded-lg">
                            {/* Header with title and APR */}
                            <div className="flex items-start justify-between mb-6">
                              <div className="text-base text-gray-400">
                                You Locked
                              </div>
                              <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                                <Sparkles className="h-4 w-4" />
                                <span>Earning {headlineApr} APR</span>
                              </div>
                            </div>

                            {/* Main amount */}
                            <div className="font-mono text-white text-5xl font-bold mb-8">
                              {pos.amount.toLocaleString()} USDC
                            </div>

                            {/* Lock details section - card style */}
                            <div className="bg-slate-900/50 p-6 rounded-lg mb-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-blue-300">
                                  Locked for {Math.abs(lockedDays)} days
                                </div>
                                {pos.unlockAt && (
                                  <div className="text-xs text-slate-400 border border-white/20 px-4 py-2 rounded">
                                    Claimable at {new Date(pos.unlockAt).toLocaleString('en-US', {
                                      month: '2-digit',
                                      day: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </div>
                                )}
                              </div>

                              <div className="font-mono text-white text-2xl font-semibold mb-6">
                                {pos.amount.toLocaleString()} sUSDb
                              </div>

                              {/* Earned Points */}
                              <div className="grid grid-cols-2 gap-8">
                                <div>
                                  <div className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                                    <span>Earned Lighter Points</span>
                                    <Zap className="h-3 w-3" />
                                  </div>
                                  <div className="font-mono text-green-400 text-3xl font-bold">
                                    {pos.earnedLighter?.toLocaleString() || '0'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                                    <span>Earned Brighter Points</span>
                                    <span className="text-orange-400">⚡</span>
                                  </div>
                                  <div className="font-mono text-green-400 text-3xl font-bold">
                                    {pos.earnedBrighter?.toLocaleString() || '0'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Claim button - only show if position has unlockAt and is claimable */}
                            {pos.unlockAt && nowTs >= pos.unlockAt && (
                              <div className="mt-6 flex justify-end">
                                <button
                                  onClick={() => {
                                    if (isTestMode) {
                                      handleTestUnstake(pos.id);
                                    }
                                  }}
                                  className="px-6 py-2 text-sm font-semibold rounded bg-blue-500/20 text-blue-300 border border-blue-500/50 hover:bg-blue-500/30 cursor-pointer transition"
                                >
                                  Claim
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {/* Pending Deposits - shown in Deposit tab */}
                    {yourPositionsTab === 'Deposit' && pendingDeposits.length > 0 && (
                      <div className="space-y-3">
                        {pendingDeposits.map((deposit) => {
                          const isClaimable = nowTs >= deposit.claimableAt;
                          const claimableDate = new Date(deposit.claimableAt);
                          const formattedDate = `${claimableDate.getMonth() + 1}/${claimableDate.getDate()}/${claimableDate.getFullYear()}, ${claimableDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                          return (
                            <div key={deposit.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded border border-white/10">
                              <div>
                                <div className="text-sm text-orange-300 mb-1">Pending Stake</div>
                                <div className="font-mono text-white text-lg font-semibold">
                                  {deposit.amount.toLocaleString()} USDC
                                </div>
                              </div>
                              <button
                                disabled={!isClaimable}
                                onClick={() => {
                                  if (isTestMode && isClaimable) {
                                    handleTestClaim('deposit', deposit.id);
                                  }
                                }}
                                className={`px-4 py-2 text-xs font-semibold transition border rounded ${
                                  isClaimable
                                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 hover:bg-indigo-500/30 cursor-pointer"
                                    : "cursor-not-allowed bg-slate-700/30 text-slate-400 border-slate-600"
                                }`}
                              >
                                {isClaimable
                                  ? `Claim ${(deposit.amount * 0.9987).toFixed(1)} sUSDb`
                                  : `sUSDb Claimable at ${formattedDate}`
                                }
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Pending Withdrawals - shown in Deposit tab */}
                    {yourPositionsTab === 'Deposit' && pendingWithdrawals.length > 0 && (
                      <div className="space-y-3">
                        {pendingWithdrawals.map((withdrawal) => {
                          const isClaimable = nowTs >= withdrawal.claimableAt;
                          const claimableDate = new Date(withdrawal.claimableAt);
                          const formattedDate = `${claimableDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}, ${claimableDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
                          return (
                            <div key={withdrawal.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded border border-white/10">
                              <div>
                                <div className="text-sm text-yellow-300 mb-1">{isClaimable ? 'Withdrawable' : 'Pending Withdrawal'}</div>
                                <div className="font-mono text-white text-lg font-semibold">
                                  {withdrawal.amount.toLocaleString()} sUSDb
                                </div>
                              </div>
                              <button
                                disabled={!isClaimable}
                                onClick={() => {
                                  if (isTestMode && isClaimable) {
                                    handleTestClaim('withdrawal', withdrawal.id);
                                  }
                                }}
                                className={`px-4 py-2 text-xs font-semibold transition border rounded ${
                                  isClaimable
                                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 hover:bg-indigo-500/30 cursor-pointer"
                                    : "cursor-not-allowed bg-slate-700/30 text-slate-400 border-slate-600"
                                }`}
                              >
                                {isClaimable
                                  ? `Claim ${(withdrawal.amount * 1.006).toFixed(1)} USDC`
                                  : `USDC Claimable at ${formattedDate}`
                                }
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
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
                                        alt="USDb"
                                        className="h-4 w-4 opacity-70 rounded-full"
                                      />
                                      <span>{'>'} RCV: {tx.receive}</span>
                                    </div>
                                  )}
                                  {tx.burn && (
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={usdlLogo}
                                        alt="USDb"
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

      {/* Floating Test Mode Button */}
      <button
        onClick={() => {
          setIsTestMode(!isTestMode);
          if (!isTestMode) {
            setTestPositions([]);
            setTestPendingDeposits([]);
            setTestPendingWithdrawals([]);
            setUserBalance(10000);
          }
        }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-4 rounded-full shadow-lg font-bold uppercase tracking-wider transition-all duration-300 ${
          isTestMode
            ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/50"
            : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/50"
        }`}
        title={isTestMode ? "Exit Test Mode" : "Enter Test Mode"}
      >
        <Sparkles className="h-5 w-5" />
        {isTestMode ? "Test Mode ON" : "Test Mode"}
      </button>

      {/* Fast Forward Button - Make pending deposits claimable */}
      {isTestMode && testPendingDeposits.length > 0 && (
        <button
          onClick={() => {
            // Set all pending deposits' claimableAt to now
            setTestPendingDeposits(prev => prev.map(deposit => ({
              ...deposit,
              claimableAt: Date.now() - 1000 // 1 second ago, so it's already claimable
            })));
          }}
          className="fixed bottom-24 right-6 z-50 flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-md text-xs font-semibold uppercase tracking-wide transition-all duration-300 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white border border-slate-600"
          title="Make pending deposits claimable now"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          Fast Forward
        </button>
      )}

      {/* Loading Modal */}
      {showLoadingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#1a1a2e] border border-white/20 rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Spinner */}
              <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>

              {/* Loading Text */}
              <div className="text-xl font-bold text-white uppercase tracking-wider">
                Loading...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && successModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowSuccessModal(false)}>
          <div className="bg-[#1a1a2e] border border-white/20 rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            {/* Check Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-2 uppercase tracking-wider">
              {successModalData.type === 'deposit' ? 'You Staked' : successModalData.type === 'stake' ? 'You Locked' : 'Withdrawal Submitted'}
            </h2>

            {/* Amount */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-4xl font-bold text-white font-mono">
                {successModalData.amount.toLocaleString()}
              </span>
              <img src={usdcLogo} alt={successModalData.type === 'withdraw' ? 'sUSDb' : 'USDC'} className="w-8 h-8 rounded-full" />
              <span className="text-4xl font-bold text-white">{successModalData.type === 'withdraw' ? 'sUSDb' : 'USDC'}</span>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              {successModalData.type === 'withdraw' && successModalData.claimableAt ? (
                <div className="text-center text-sm text-gray-400">
                  Your USDC claimable after<br/>
                  <span className="text-white font-mono">
                    {new Date(successModalData.claimableAt).toLocaleString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              ) : (
                <>
                  <div className="text-center text-green-400 font-mono">
                    Now earning 34.3% APR{successModalData.type === 'stake' ? '.' : ''}
                  </div>
                  {successModalData.type === 'stake' && (
                    <div className="text-center text-green-400 font-mono">
                      Plus Lighter & Brighter points
                    </div>
                  )}
                  {successModalData.type === 'deposit' && successModalData.claimableAt && (
                    <div className="text-center text-sm text-gray-400">
                      You can claim sUSDb as received token at<br/>
                      <span className="text-white font-mono">
                        {new Date(successModalData.claimableAt).toLocaleString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* View Position Button */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setYourPositionsTab(successModalData.type === 'stake' ? 'Staked' : 'Deposit');

                // Scroll to Your Positions section
                setTimeout(() => {
                  const element = document.getElementById('your-positions');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              className="w-full bg-indigo-500/30 hover:bg-indigo-500/40 text-indigo-200 border border-indigo-400/50 py-4 rounded font-bold uppercase tracking-wider transition"
            >
              View Position
            </button>
          </div>
        </div>
      )}
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

function AmountCard({ label, amount }: { label: string; amount: string }) {
  return (
    <div
      className="relative border border-white/10 bg-slate-900 px-4 py-3"
    >
      <p className="text-xs uppercase tracking-[-0.06em] text-gray-500 font-mono">
        {label}
      </p>
      <p className="text-2xl font-semibold text-white font-mono">{amount}</p>
    </div>
  );
}

function PerformanceChart({
  data: chartData,
  range,
  onRangeChange,
}: {
  data: number[];
  range: "1W" | "1M" | "3M" | "1Y" | "ALL";
  onRangeChange: (value: "1W" | "1M" | "3M" | "1Y" | "ALL") => void;
}) {
  const labels = Array.from(
    { length: chartData.length },
    (_, i) => `2025-12-${(i + 1).toString().padStart(2, "0")}`
  );

  const data = {
    labels,
    datasets: [
      {
        label: "LLP Historic Performance",
        data: chartData,
        borderColor: "rgba(74, 222, 128, 1)",
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(74, 222, 128, 0.4)");
          gradient.addColorStop(1, "rgba(74, 222, 128, 0)");
          return gradient;
        },
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "index" as const,
        intersect: false,
        position: "nearest" as const,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 12, weight: 'bold' as const, family: "monospace" },
        bodyFont: { size: 12, family: "monospace" },
        padding: 12,
        caretPadding: 10,
        displayColors: false,
        callbacks: {
          title: function (context: any) {
            return `Date: ${context[0].label}`;
          },
          label: function (context: any) {
            return `LLP Value: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: {
            size: 10,
            family: "monospace"
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
        title: {
          display: true,
          text: "Date",
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
            family: "monospace"
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderDash: [2, 2],
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: {
            size: 10,
            family: "monospace"
          },
        },
        title: {
          display: true,
          text: "LLP value",
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
            family: "monospace"
          },
        },
      },
    },
  };

  return (
    <div className="space-y-4 border border-white/10 bg-[#0a0a1f] p-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-bold text-white uppercase tracking-wider font-mono">
          LLP Historic Performance <br/>(Net Asset Value)
        </p>
        <div className="flex items-center gap-1 border border-white/10 p-1 text-xs">
          {(["1W", "1M", "3M", "1Y", "ALL"] as const).map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange(r)}
              className={`px-2 py-1 transition font-mono ${
                range === r
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:bg-white/5"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

function TypewriterText() {
  const messages = [
    { line2: "100%", line3: "LLP_ALLOCATION" },
    { line2: "35% APR and Lighter Pts", line3: "" }
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState({ line2: "", line3: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [currentLine, setCurrentLine] = useState<'line2' | 'line3'>('line2');

  useEffect(() => {
    const currentMessage = messages[messageIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseBeforeDelete = 2000;
    const pauseBeforeNext = 500;

    if (!isDeleting && currentLine === 'line2' && charIndex < currentMessage.line2.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => ({
          ...prev,
          line2: currentMessage.line2.substring(0, charIndex + 1)
        }));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (!isDeleting && currentLine === 'line2' && charIndex === currentMessage.line2.length) {
      if (currentMessage.line3) {
        const timer = setTimeout(() => {
          setCurrentLine('line3');
          setCharIndex(0);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsDeleting(true);
          setCharIndex(currentMessage.line2.length);
        }, pauseBeforeDelete);
        return () => clearTimeout(timer);
      }
    } else if (!isDeleting && currentLine === 'line3' && charIndex < currentMessage.line3.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => ({
          ...prev,
          line3: currentMessage.line3.substring(0, charIndex + 1)
        }));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (!isDeleting && currentLine === 'line3' && charIndex === currentMessage.line3.length) {
      const timer = setTimeout(() => {
        setIsDeleting(true);
        setCurrentLine('line3');
        setCharIndex(currentMessage.line3.length);
      }, pauseBeforeDelete);
      return () => clearTimeout(timer);
    } else if (isDeleting && currentLine === 'line3' && charIndex > 0) {
      const timer = setTimeout(() => {
        setDisplayText(prev => ({
          ...prev,
          line3: currentMessage.line3.substring(0, charIndex - 1)
        }));
        setCharIndex(charIndex - 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (isDeleting && currentLine === 'line3' && charIndex === 0) {
      setCurrentLine('line2');
      setCharIndex(displayText.line2.length);
      return undefined;
    } else if (isDeleting && currentLine === 'line2' && charIndex > 0) {
      const timer = setTimeout(() => {
        setDisplayText(prev => ({
          ...prev,
          line2: currentMessage.line2.substring(0, charIndex - 1)
        }));
        setCharIndex(charIndex - 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (isDeleting && currentLine === 'line2' && charIndex === 0) {
      const timer = setTimeout(() => {
        setIsDeleting(false);
        setMessageIndex((messageIndex + 1) % messages.length);
        setCharIndex(0);
        setCurrentLine('line2');
        setDisplayText({ line2: "", line3: "" });
      }, pauseBeforeNext);
      return () => clearTimeout(timer);
    } else {
      return undefined;
    }
  }, [charIndex, isDeleting, messageIndex, currentLine, displayText]);

  return (
    <h2 className="text-xl font-bold text-white uppercase tracking-wider md:text-3xl font-mono h-24 md:h-28">
      STAKE_USDC & GET
      <br/>
      {displayText.line2 && (
        <span className="inline-flex items-baseline gap-2">
          <span className="text-xl text-green-400 md:text-3xl">
            {displayText.line2}
          </span>
          {displayText.line3 && (
            <span className="text-xl text-green-400 md:text-3xl">
              {displayText.line3}
            </span>
          )}
        </span>
      )}
    </h2>
  );
}


