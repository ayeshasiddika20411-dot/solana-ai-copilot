'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter';
import { useCluster } from '@/app/components/cluster-context';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AICopilot() {
  const { publicKey } = useWallet();
  const { cluster } = useCluster();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Directly read public key from wallet adapter
  const walletAddress = publicKey ? publicKey.toBase58() : 'Not Connected';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          walletAddress,
          cluster: cluster.name,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      if (!res.body) throw new Error('No response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantMsg += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantMsg };
          return updated;
        });
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ Error: ${err.message || 'Something went wrong.'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border border-neutral-800 bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 shadow-2xl flex flex-col h-[520px] w-full max-w-xl mx-auto my-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <h3 className="font-semibold text-lg text-white flex items-center gap-2">
          🤖 Solana AI Copilot
        </h3>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
          Gemini 3.8 Flash
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 text-sm">
        {messages.length === 0 && (
          <div className="text-neutral-500 text-center mt-20 text-xs">
            {publicKey ? `Connected: ${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : 'Connect wallet to start'}
            <br />
            Ask me anything: &quot;Analyze my wallet&quot;, &quot;Devnet status&quot;, or &quot;How to swap?&quot;
          </div>
        )}
        {messages.map((m, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
              m.role === 'user'
                ? 'ml-auto bg-purple-600 text-white shadow-md'
                : 'mr-auto bg-neutral-800 text-neutral-200 border border-neutral-700/50'
            }`}
          >
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="mr-auto bg-neutral-800 text-neutral-400 p-3 rounded-xl text-xs border border-neutral-700/50 animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-neutral-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI agent..."
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
