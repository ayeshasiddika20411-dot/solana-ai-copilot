'use client';

import { useState, useEffect } from 'react';

export function PantaMarketsCard() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/panta')
      .then((res) => res.json())
      .then((data) => {
        if (data.markets) setMarkets(data.markets);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="border border-neutral-800 bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 shadow-2xl flex flex-col w-full text-white my-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          🎯 Panta Prediction Markets
        </h3>
        <span className="text-xs bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-mono">
          Panta API Integration
        </span>
      </div>

      <p className="text-xs text-neutral-400 mt-2 mb-4">
        Live on-chain prediction markets for Solana intelligence. Ask AI Copilot to analyze market odds.
      </p>

      {loading ? (
        <div className="text-center py-6 text-xs text-neutral-500 animate-pulse">Loading live Panta markets...</div>
      ) : (
        <div className="space-y-3">
          {markets.map((m) => (
            <div key={m.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 hover:border-neutral-700 transition">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className="text-sm font-medium text-neutral-200 leading-snug">{m.question}</h4>
                <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono">{m.category}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-neutral-900">
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    YES: {m.yesProbability}%
                  </span>
                  <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    NO: {m.noProbability}%
                  </span>
                </div>
                <span className="text-neutral-500 text-[11px] font-mono">Vol: {m.volume24h}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
