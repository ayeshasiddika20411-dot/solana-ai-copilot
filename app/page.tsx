import { AppHeader } from '@/app/components/app-header';
import { ActionsPanel } from '@/app/components/actions/actions-panel';
import { AICopilot } from '@/app/components/ai-copilot';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-6 max-w-xl">
          <h1 className="text-3xl font-extrabold sm:text-4xl bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
            Solana AI Copilot
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">
            AI-driven Web3 assistant running on Solana. Chat with the agent or execute on-chain actions.
          </p>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <AICopilot />
          <div className="w-full">
            <ActionsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
