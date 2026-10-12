import { ActionsPanel } from '@/app/components/actions/actions-panel';
import { AICopilot } from '@/app/components/ai-copilot';
import { JupiterSwapCard } from '@/app/components/jupiter-swap-card';
import { SolamiMetricsCard } from '@/app/components/solami-metrics-card';
import { PantaMarketsCard } from '@/app/components/panta-markets-card';

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col items-center">
        {/* Title & Subtitle */}
        <div className="text-center mb-8 max-w-3xl px-2">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent">
            Solana AI Copilot & Unified Terminal
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-3 text-xs sm:text-sm md:text-base leading-relaxed">
            Real-time on-chain terminal combining Gemini 3.8 Flash intelligence, Solami RPC telemetry, Jupiter DeFi swaps, and Panta Prediction Markets.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          <div className="w-full space-y-6">
            <SolamiMetricsCard />
            <AICopilot />
          </div>
          <div className="w-full space-y-6">
            <PantaMarketsCard />
            <JupiterSwapCard />
            <ActionsPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
