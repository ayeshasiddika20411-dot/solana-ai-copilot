'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter';

const TOKENS = [
  { symbol: 'SOL', name: 'Solana', mint: 'So11111111111111111111111111111111111111112', decimals: 9 },
  { symbol: 'USDC', name: 'USD Coin', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
  { symbol: 'BONK', name: 'Bonk', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', decimals: 5 },
  { symbol: 'JUP', name: 'Jupiter', mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', decimals: 6 },
];

export function JupiterSwapCard() {
  const { publicKey } = useWallet();
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState('0.1');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

  async function getQuote() {
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);
    setStatusText('Fetching best on-chain routes via Jupiter...');
    try {
      const lamports = Math.floor(Number(amount) * Math.pow(10, fromToken.decimals)).toString();
      const res = await fetch(`/api/jupiter/quote?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${lamports}`);
      const data = await res.json();

      if (data.outAmount) {
        setQuote(data);
        const estimatedOut = (Number(data.outAmount) / Math.pow(10, toToken.decimals)).toFixed(4);
        setStatusText(`Rate: 1 ${fromToken.symbol} ≈ ${(Number(estimatedOut) / Number(amount)).toFixed(2)} ${toToken.symbol}`);
      } else {
        setStatusText('No route found for this pair.');
      }
    } catch (e: any) {
      setStatusText('Quote fetch failed');
    } finally {
      setLoading(false);
    }
  }

  function handleSwapSimulation() {
    if (!publicKey) {
      alert('Please connect your Phantom wallet first!');
      return;
    }
    alert(`🎉 Swap Order Simulated!\nExchanging ${amount} ${fromToken.symbol} to ${toToken.symbol} via Jupiter Routing.`);
  }

  return (
    <div className="border border-neutral-800 bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 shadow-2xl flex flex-col w-full my-6 text-white">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          🪐 Jupiter DeFi Swap
        </h3>
        <span className="text-xs bg-orange-500/10 text-orange-400 px-2.5 py-0.5 rounded-full border border-orange-500/20 font-mono">
          Jupiter V6 Aggregator
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* From Token */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
          <label className="text-xs text-neutral-400 block mb-1">You Pay</label>
          <div className="flex justify-between items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-xl font-bold focus:outline-none w-full"
            />
            <select
              value={fromToken.symbol}
              onChange={(e) => setFromToken(TOKENS.find(t => t.symbol === e.target.value) || TOKENS[0])}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-sm font-semibold text-white focus:outline-none cursor-pointer"
            >
              {TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
            </select>
          </div>
        </div>

        {/* To Token */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
          <label className="text-xs text-neutral-400 block mb-1">You Receive (Estimated)</label>
          <div className="flex justify-between items-center gap-2">
            <div className="text-xl font-bold text-emerald-400">
              {quote?.outAmount 
                ? (Number(quote.outAmount) / Math.pow(10, toToken.decimals)).toFixed(4)
                : '0.00'}
            </div>
            <select
              value={toToken.symbol}
              onChange={(e) => setToToken(TOKENS.find(t => t.symbol === e.target.value) || TOKENS[1])}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-sm font-semibold text-white focus:outline-none cursor-pointer"
            >
              {TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
            </select>
          </div>
        </div>

        {statusText && (
          <p className="text-xs text-neutral-400 text-center font-mono">{statusText}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={getQuote}
            disabled={loading}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? 'Routing...' : 'Get Live Quote'}
          </button>
          <button
            onClick={handleSwapSimulation}
            disabled={!quote}
            className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50 shadow-lg shadow-orange-600/20"
          >
            Swap on Solana
          </button>
        </div>
      </div>
    </div>
  );
}
