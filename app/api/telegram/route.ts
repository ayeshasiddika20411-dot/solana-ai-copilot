import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      console.error('TELEGRAM_BOT_TOKEN is missing');
      return NextResponse.json({ ok: true });
    }

    async function sendTelegramMessage(textToSend: string) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: textToSend,
          parse_mode: 'Markdown',
        }),
      });
    }

    // 1. Command: /start
    if (text === '/start') {
      const welcome = `🤖 *Welcome to Solana AI Copilot!*

I am your autonomous on-chain assistant powered by *Gemini 3.8 Flash*, *Solami RPC*, and *Jupiter DeFi*.

*Available Commands:*
⚡ \`/solami\` - Check live Solana Mainnet slot & latency
🪐 \`/quote\` - Get live SOL to USDC swap price
💬 *Or simply type any question!* (e.g. "What is Solana Devnet?", "Analyze SOL price trends")

🌐 *Live Web Terminal:* https://solana-ai-copilot-66ks.vercel.app/`;
      await sendTelegramMessage(welcome);
      return NextResponse.json({ ok: true });
    }

    // 2. Command: /solami
    if (text.startsWith('/solami') || text.startsWith('/slot')) {
      try {
        const solamiRes = await fetch('https://solana-ai-copilot-66ks.vercel.app/api/solami', { cache: 'no-store' });
        const data = await solamiRes.json();
        const msg = `⚡ *Solami Live Mainnet Telemetry*
• Current Slot: \`${data.slot?.toLocaleString?.() || data.slot}\`
• Block Height: \`${data.blockHeight?.toLocaleString?.() || data.blockHeight}\`
• RPC Latency: \`${data.latencyMs} ms\`
• Node Health: *${data.health || 'Healthy'}*
• Provider: *${data.provider}*`;
        await sendTelegramMessage(msg);
      } catch (e) {
        await sendTelegramMessage('⚠️ Failed to query Solami RPC telemetry.');
      }
      return NextResponse.json({ ok: true });
    }

    // 3. Command: /quote
    if (text.startsWith('/quote')) {
      try {
        const quoteRes = await fetch('https://solana-ai-copilot-66ks.vercel.app/api/jupiter/quote?amount=1000000000', { cache: 'no-store' });
        const qData = await quoteRes.json();
        const usdc = (Number(qData.outAmount) / 1e6).toFixed(2);
        await sendTelegramMessage(`🪐 *Jupiter Live Market Quote*\n• 1 SOL ≈ \`${usdc} USDC\`\n• Price Impact: \`${qData.priceImpactPct || '0.01'}%\``);
      } catch (e) {
        await sendTelegramMessage('⚠️ Failed to fetch Jupiter quote.');
      }
      return NextResponse.json({ ok: true });
    }

    // 4. Default: Gemini 3.8 Flash AI Chat
    try {
      const aiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are Solana AI Copilot Telegram assistant. Answer concisely, crypto-natively, and directly without fluff:\n\nUser: ${text}`,
                  },
                ],
              },
            ],
            generationConfig: { maxOutputTokens: 400 },
          }),
        }
      );
      const aiData = await aiRes.json();
      const reply = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that on-chain query.";
      await sendTelegramMessage(reply);
    } catch (err: any) {
      await sendTelegramMessage('⚠️ AI Copilot is temporarily busy.');
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ ok: true });
  }
}
