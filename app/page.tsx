import { ActionsPanel } from '@/app/components/actions/actions-panel';
import { AICopilot } from '@/app/components/ai-copilot';
import { JupiterSwapCard } from '@/app/components/jupiter-swap-card';

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col items-center">
        {/* Title & Subtitle */}
        <div className="text-center mb-8 max-w-2xl px-2">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Solana AI Copilot & DeFi Terminal
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-3 text-xs sm:text-sm md:text-base leading-relaxed">
            Autonomous on-chain Web3 assistant powered by Gemini 3.8 Flash & Jupiter Liquidity Aggregator.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          <div className="w-full">
            <AICopilot />
          </div>
          <div className="w-full space-y-6">
            <JupiterSwapCard />
            <ActionsPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
