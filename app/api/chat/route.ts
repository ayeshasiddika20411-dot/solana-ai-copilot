import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { message, walletAddress, cluster } = await req.json();

    const systemPrompt = `You are a high-speed, expert Solana On-Chain AI Agent.
Current Connected User Wallet: ${walletAddress || 'Not Connected'}
Current Network Cluster: ${cluster || 'devnet'}

Capabilities:
1. Help users analyze their Solana wallet, devnet status, SPL tokens, and transactions.
2. Be concise, crypto-native, friendly, and accurate.`;

    const result = streamText({
      model: google('gemini-3.8-flash'),
      system: systemPrompt,
      prompt: message,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('AI API Route Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to process AI request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
