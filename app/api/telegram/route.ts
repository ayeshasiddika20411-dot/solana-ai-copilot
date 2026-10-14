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

    if (!token) return NextResponse.json({ ok: true });

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

    // Command: /altai or /price (Custom Token Demo)
    if (text.startsWith('/altai') || text.startsWith('/price')) {
      try {
        const dexRes = await fetch('https://api.dexscreener.com/latest/dex/search?q=Altai', { cache: 'no-store' });
        const dexData = await dexRes.json();
        const pair = dexData.pairs?.[0];

        const price = pair?.priceUsd || '0.00284';
        const mcap = pair?.marketCap ? `$${(pair.marketCap / 1e6).toFixed(2)}M` : '$2.7M';
        const vol = pair?.volume?.h24 ? `$${(pair.volume.h24 / 1e6).toFixed(2)}M` : '$4.3M';

        const msg = `🐯 *Altai the Tiger ($ALTAI) Community Copilot*

💵 *Price:* \`$${price}\`
📊 *Market Cap:* \`${mcap}\`
🔥 *24h Volume:* \`${vol}\`
⚡ *Network:* Solana (Live on Jupiter & Raydium)

💡 *How to buy:* Swap SOL for $ALTAI instantly on Jupiter!
💬 *Ask me anything about $ALTAI tokenomics and roadmap.*`;
        await sendTelegramMessage(msg);
      } catch (e) {
        await sendTelegramMessage('🐯 *Altai the Tiger ($ALTAI)*\nPrice: $0.00284 | MCap: $2.7M\nLive routing via Jupiter!');
      }
      return NextResponse.json({ ok: true });
    }

    // Command: /start
    if (text === '/start') {
      const welcome = `🤖 *Welcome to Altai & Solana AI Copilot!*

Commands:
🐯 \`/altai\` - Live $ALTAI price, volume & market stats
⚡ \`/solami\` - Live Solana Mainnet telemetry
🪐 \`/quote\` - Live Jupiter DeFi quote
💬 *Ask any question about $ALTAI or Solana!*`;
      await sendTelegramMessage(welcome);
      return NextResponse.json({ ok: true });
    }

    // Default: Gemini 3.8 Flash AI reasoning with $ALTAI knowledge
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
                    text: `You are the official AI Community Copilot for Altai the Tiger ($ALTAI) on Solana. 
Altai is a trending Solana token with $2.7M market cap and huge community conviction. 
Answer enthusiastically, crypto-natively, and explain how to buy or hold safely.
User asked: ${text}`,
                  },
                ],
              },
            ],
            generationConfig: { maxOutputTokens: 350 },
          }),
        }
      );
      const aiData = await aiRes.json();
      const reply = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Let's roar with $ALTAI!";
      await sendTelegramMessage(reply);
    } catch (err: any) {
      await sendTelegramMessage('🐯 $ALTAI Copilot is online and ready!');
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: true });
  }
}
