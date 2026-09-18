# Chainlytics

Crypto market dashboard with a portfolio tracker, a watchlist and an AI analyst.

**Live demo:** https://chainlytics82-3v7y.vercel.app/

## What it does

**Markets** — live prices and market data, with charts.

**Portfolio** — record your holdings and follow their value over time.

**Watchlist** — the coins you care about, saved to your account.

**Converter** — quick conversion between coins and fiat.

**AI analyst** — an `ai-crypto-analyst` Edge Function that reads the current market data
and writes a plain-language summary. It runs server-side, so the model key never reaches
the browser.

## Data model

`profiles` and `user_roles` in PostgreSQL, under Row Level Security. Market data is read
from a public API at request time rather than mirrored into the database.

## Stack

React · TypeScript · Vite · Tailwind CSS · shadcn/ui · React Hook Form · Zod ·
Supabase (PostgreSQL, Auth, Edge Functions)

## Run it locally

```bash
npm install
cp .env.example .env
npm run dev
```

## Note

This is an educational dashboard. It is not investment advice and it does not execute
any trade.
