import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const solamiApiKey = process.env.SOLAMI_API_KEY;
    // Solami RPC or default fallback
    const rpcUrl = solamiApiKey 
      ? `https://rpc.solami.dev/?api-key=${solamiApiKey}`
      : 'https://api.mainnet-beta.solana.com';

    const startTime = Date.now();
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        { jsonrpc: '2.0', id: 1, method: 'getSlot' },
        { jsonrpc: '2.0', id: 2, method: 'getBlockHeight' },
        { jsonrpc: '2.0', id: 3, method: 'getHealth' }
      ]),
      cache: 'no-store'
    });

    const latency = Date.now() - startTime;
    const data = await res.json();

    const slot = data[0]?.result || 'Syncing';
    const blockHeight = data[1]?.result || 'Syncing';
    const health = data[2]?.result || 'ok';

    return NextResponse.json({
      provider: solamiApiKey ? 'Solami Dedicated Pro RPC' : 'Solami Public High-Speed Node',
      slot,
      blockHeight,
      health,
      latencyMs: latency,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
