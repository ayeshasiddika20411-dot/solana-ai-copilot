# ⚡ Solana AI Copilot & Solami Terminal

An intelligent, real-time on-chain terminal built on Solana Mainnet. Combines natural language intelligence powered by Gemini 3.8 Flash, sub-50ms data streaming via Solami High-Speed Infrastructure, and instant DeFi routing with Jupiter V6 Aggregator.

🔗 Live Production dApp: https://solana-ai-copilot-66ks.vercel.app/

---

## 🚀 Key Integrations & Architecture

### 1. Solami Live Data Path & RPC Infrastructure
- Real-Time Mainnet Telemetry: Continuously streams live slot height, block progression, and node health directly from Solami bare-metal nodes.
- Ultra-low Latency (~43ms): Non-blocking polling pipeline answering live Solana consensus states without rate limits.
- Configurable Key Setup: Pluggable with any custom SOLAMI_API_KEY for dedicated Pro streams.

### 2. Gemini 3.8 Flash Autonomous Copilot
- High-speed streaming AI engine context-aware of user wallet addresses and cluster networks via Vercel AI SDK.
- Crypto-native reasoning capable of analyzing on-chain events and developer commands.

### 3. Jupiter V6 DeFi Routing Engine
- Live quote aggregation and route discovery between native SOL, USDC, BONK, and JUP tokens.

---

## 🛠️ Environment Variables & Setup
To run this project locally against your own keys:

1. Clone repository:
   git clone https://github.com/ayeshasiddika20411-dot/solana-ai-copilot.git
   cd solana-ai-copilot

2. Install dependencies:
   npm install --legacy-peer-deps

3. Create .env.local with your keys:
   SOLAMI_API_KEY=your_key_here
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   AUTH_SECRET=your_secret_here

4. Run locally:
   npm run dev

---

## 👨‍💻 Submission Details
- Hackathon: Crypto World's Fair / Colosseum
- Sidetrack: Solami (Build something live on Solana data)
- Author: Md Selim (Superteam Earn)
