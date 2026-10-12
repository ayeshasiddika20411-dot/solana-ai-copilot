import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const inputMint = searchParams.get('inputMint') || 'So11111111111111111111111111111111111111112'; // SOL
    const outputMint = searchParams.get('outputMint') || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC
    const amount = searchParams.get('amount') || '100000000'; // 0.1 SOL in lamports

    const jupUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`;
    
    const res = await fetch(jupUrl);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch quote from Jupiter' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
