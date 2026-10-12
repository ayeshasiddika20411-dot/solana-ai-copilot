'use client';

import { useState, useEffect } from 'react';

export function SolamiMetricsCard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchSolamiData() {
    try {
      const res = await fetch('/api/solami');
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSolamiData();
    const interval = setInterval(fetchSolamiData, 5000); // Live poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-neutral-800 bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 shadow-2xl flex flex-col w-full text-white">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          ⚡ Solami Live Data Stream
        </h3>
        <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-mono flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          Live Mainnet
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
          <div className="text-xs text-neutral-400">Current Slot</div>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
            {loading ? '...' : metrics?.slot?.toLocaleString?.() || 'Syncing'}
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
          <div className="text-xs text-neutral-400">Block Height</div>
          <div className="text-lg font-bold text-white font-mono mt-1">
            {loading ? '...' : metrics?.blockHeight?.toLocaleString?.() || 'Syncing'}
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 col-span-2 sm:col-span-1">
          <div className="text-xs text-neutral-400">RPC Latency</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
            {loading ? '...' : `${metrics?.latencyMs || 0} ms`}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
        <span className="truncate">Data Path: <strong className="text-neutral-200">{metrics?.provider || 'Solami Data API'}</strong></span>
        <span className="text-emerald-400 font-medium">● Healthy</span>
      </div>
    </div>
  );
}
