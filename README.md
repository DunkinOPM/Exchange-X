# Exchange Sim

Exchange Sim is a TypeScript monorepo for a cryptocurrency spot-exchange simulator. It provides a browser-based trading interface, authenticated user accounts, wallet balances, limit and market orders, price-time order matching, trade settlement, order-book and ticker data, one-minute candles, and real-time market updates.

The project is intended for local development, experimentation, and demonstrating exchange-domain workflows. It does not connect to a live exchange or provide production trading infrastructure.

## Features

* User registration and login with bcrypt password hashing and seven-day JWTs.
* Demo wallet balances created when a user registers.
* Seeded BTC/USDT, ETH/USDT, SOL/USDT, BNB/USDT, ADA/USDT, and DOGE/USDT markets.
* Limit and market BUY/SELL orders with request validation and balance checks.
* In-memory order books with aggregated bid/ask levels, price-time FIFO matching, partial fills, and cancellation.
* PostgreSQL persistence for users, balances, markets, orders, trades, and transactions.
* Trade settlement that moves base and quote assets between buyer and seller balances.
* In-memory one-minute OHLCV candles updated from executed trades.
* REST endpoints for authentication, wallets, orders, trades, order books, tickers, candles, health, and the current user.
* WebSocket subscriptions for `orderbook`, `ticker`, `trades`, and `candles` market updates.
* Next.js dashboard with trading chart, order book, recent trades, order entry, open orders, portfolio, and trade history views.
* Startup recovery of persisted open orders into the in-memory matching engine.

## Tech Stack

* **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, Axios, Lightweight Charts, Sonner.
* **API:** Node.js, Fastify 5, TypeScript, `@fastify/cors`, Zod, bcrypt, and JSON Web Token.
* **WebSocket Gateway:** Node.js, `ws`, and TypeScript.
* **Matching Engine:** Custom TypeScript matching engine with in-memory order books and price-time FIFO behavior.
* **Persistence:** PostgreSQL 17 through Prisma 6 and Prisma Client.
* **Messaging:** Redis 8 Pub/Sub.
* **Monorepo:** npm workspaces and Turborepo.
* **Tooling:** ESLint, Prettier, and TypeScript.
* **Infrastructure:** Docker Compose for PostgreSQL and Redis.

## Architecture

```text
                         ┌─────────────────────┐
                         │    Next.js Client   │
                         │      :3000          │
                         └──────────┬──────────┘
                                    │
                         HTTP + JWT │ WebSocket
                                    │
                 ┌──────────────────┴──────────────────┐
                 │                                     │
                 ▼                                     ▼
        ┌─────────────────┐                   ┌─────────────────┐
        │   Fastify API   │                   │ WebSocket       │
        │      :4000      │                   │ Gateway :5000   │
        └───────┬─────────┘                   └────────┬────────┘
                │                                      │
                │                                      │ subscribe
                ▼                                      ▼
        ┌─────────────────┐                   ┌─────────────────┐
        │   PostgreSQL    │                   │      Redis      │
        │                 │◄─────────────────►│     Pub/Sub     │
        └─────────────────┘                   └─────────────────┘
                │                                      ▲
                │                                      │
                ▼                                      │
        ┌─────────────────┐                            │
        │ Matching Engine │────────────────────────────┘
        │ In-Memory Books │
        └─────────────────┘
```

## How It Works

1. The frontend communicates with the Fastify API using HTTP requests. Protected API requests include a JWT Bearer token.

2. The frontend connects to the WebSocket gateway and subscribes to market channels such as `orderbook`, `ticker`, `trades`, and `candles`.

3. The API authenticates protected routes using JWT middleware. Registration hashes the user's password with bcrypt, creates the user and initial balances in a Prisma transaction, and returns a JWT.

4. When an authenticated user submits an order, the API validates the request, identifies the market, checks the user's balance, locks the required funds, persists the order, and passes it to the matching engine.

5. The matching engine maintains a separate in-memory order book for each market. Orders are matched using price-time priority. Limit orders that remain unfilled stay on the order book, while market orders execute against available liquidity.

6. Executed trades are persisted in PostgreSQL and settled by moving the appropriate base and quote assets between the buyer and seller balances.

7. Executed trades also update the in-memory one-minute candle service.

8. The API publishes market events through Redis. The WebSocket gateway subscribes to those Redis events and broadcasts updates to clients subscribed to the relevant market and channel.

9. On API startup, persisted `PENDING` and `PARTIALLY_FILLED` orders are loaded from PostgreSQL and reconstructed into the in-memory matching engine so open orders can continue to participate in matching after a restart.

## Project Structure

```text
exchange-sim/
│
├── apps/
│   ├── api/                    Fastify REST API and exchange orchestration
│   ├── frontend/               Next.js trading dashboard
│   ├── websocket/              WebSocket subscriptions and Redis event forwarding
│   └── analytics/              Workspace directory
│
├── packages/
│   ├── database/               Prisma schema, migrations, and seed script
│   ├── matching-engine/        In-memory order books and matching logic
│   ├── redis/                  Redis client, publisher, and subscriber
│   ├── shared-events/          Event names, envelopes, buses, and event types
│   ├── eslint-config/          Shared ESLint configuration
│   ├── typescript-config/      Shared TypeScript configuration
│   └── ui/                     Shared UI package
│
├── docs/                       Exchange domain notes
├── infrastructure/             Monitoring and service configuration
├── docker-compose.yml           PostgreSQL and Redis services
├── turbo.json                  Turborepo configuration
├── tsconfig.json               Root TypeScript configuration
└── package.json                npm workspace configuration
```

## Installation

### Prerequisites

* Node.js 18 or newer
* npm 10+
* Docker Desktop

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd exchange-sim
npm install
```

## Environment Variables

The repository does not include a committed `.env` or `.env.example` file.

Create a root `.env` file:

```dotenv
POSTGRES_USER=exchange
POSTGRES_PASSWORD=change-me
POSTGRES_DB=exchange
POSTGRES_PORT=5432

REDIS_PORT=6379

DATABASE_URL=postgresql://exchange:change-me@localhost:5432/exchange

JWT_SECRET=replace-with-a-long-random-secret

NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

The API and Prisma configuration load the root `.env`.

The frontend uses:

* `NEXT_PUBLIC_API_URL`
* `NEXT_PUBLIC_WS_URL`

Redis currently connects to `localhost:6379`.

The local development services use:

```text
Frontend:   http://localhost:3000
API:        http://localhost:4000
WebSocket:  ws://localhost:5000
PostgreSQL: localhost:5432
Redis:      localhost:6379
```

## Infrastructure

PostgreSQL and Redis run through Docker Compose.

Start the infrastructure services:

```bash
docker compose up -d
```

Check the running containers:

```bash
docker compose ps
```

Stop the infrastructure:

```bash
docker compose down
```

Docker Compose provisions PostgreSQL and Redis only. The API, WebSocket gateway, and frontend run locally during development.

## Database Setup

After PostgreSQL is running, apply the Prisma migrations:

```bash
npx prisma migrate deploy --schema packages/database/prisma/schema.prisma
```

Generate the Prisma client:

```bash
npx prisma generate --schema packages/database/prisma/schema.prisma
```

Seed the demo data:

```bash
npm run seed --workspace database
```

The seed script creates:

* `buyer@exchange.com`
* `seller@exchange.com`
* Demo wallet balances
* BTC/USDT
* ETH/USDT
* SOL/USDT
* BNB/USDT
* ADA/USDT
* DOGE/USDT

For normal password-authenticated accounts, use the registration flow.

## Running the Application

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Then start the application:

```bash
npm run dev
```

This starts the development applications through Turborepo.

The main services are:

```text
Frontend:  http://localhost:3000
API:       http://localhost:4000
WebSocket: ws://localhost:5000
```

Individual applications can also be started separately:

```bash
npm run dev --workspace web
npm run dev --workspace api
npm run dev --workspace websocket
```

## REST API

The API base URL is:

```text
http://localhost:4000
```

Protected endpoints require:

```text
Authorization: Bearer <jwt>
```

### Authentication

| Method | Path             | Auth | Purpose                          |
| ------ | ---------------- | ---- | --------------------------------- |
| POST   | `/auth/register` | No   | Create a user and return a token |
| POST   | `/auth/login`    | No   | Authenticate by email/password   |
| GET    | `/me`            | Yes  | Return the authenticated user    |

### Wallets

| Method | Path      | Auth | Purpose                                  |
| ------ | --------- | ---- | ----------------------------------------- |
| GET    | `/wallet` | Yes  | Return the authenticated user's balances |

### Orders

| Method | Path                          | Auth | Purpose                       |
| ------ | ------------------------------ | ---- | ------------------------------ |
| POST   | `/orders`                     | Yes  | Place a LIMIT or MARKET order |
| GET    | `/orders`                     | No   | Return persisted orders       |
| GET    | `/orders/open?market=BTCUSDT` | Yes  | Return the user's open orders |
| POST   | `/orders/:id/cancel`          | Yes  | Cancel an owned order         |

### Market Data

| Method | Path                         | Auth | Purpose                       |
| ------ | ----------------------------- | ---- | ------------------------------ |
| GET    | `/markets/:symbol/orderbook` | No   | Return an order-book snapshot |
| GET    | `/markets/:symbol/ticker`    | No   | Return ticker information     |
| GET    | `/orderbook/:market`         | No   | Alternate order-book route    |
| GET    | `/ticker/:market`            | No   | Alternate ticker route        |
| GET    | `/candles/:market`           | No   | Return in-memory candles      |

### Trades

| Method | Path         | Auth | Purpose                                       |
| ------ | ------------ | ---- | ----------------------------------------------- |
| GET    | `/trades`    | No   | Return persisted trades                       |
| GET    | `/trades/me` | Yes  | Return the authenticated user's trade history |

### Health

| Method | Path      | Auth | Purpose                  |
| ------ | --------- | ---- | ------------------------- |
| GET    | `/health` | No   | Return API health status |

## Example Order

```json
{
  "market": "BTCUSDT",
  "side": "BUY",
  "type": "LIMIT",
  "price": 100000,
  "quantity": 0.1
}
```

For market orders, `price` is omitted.

The order schema supports:

```text
Side:
- BUY
- SELL

Type:
- LIMIT
- MARKET

Status:
- PENDING
- PARTIALLY_FILLED
- FILLED
- CANCELLED
```

## WebSocket API

Connect to:

```text
ws://localhost:5000
```

Subscribe to a market channel:

```json
{
  "type": "SUBSCRIBE",
  "channel": "orderbook",
  "market": "BTCUSDT"
}
```

Supported channels:

```text
orderbook
ticker
trades
candles
```

To unsubscribe:

```json
{
  "type": "UNSUBSCRIBE",
  "channel": "orderbook",
  "market": "BTCUSDT"
}
```

The WebSocket gateway handles connection, subscription, error, snapshot, and update messages.

Redis-backed event types include:

```text
order.matched
orderbook.updated
ticker.updated
candle.updated
```

## Matching Engine

The matching engine is implemented as a custom TypeScript package.

Each market maintains its own in-memory order book.

The engine supports:

* Price-time priority
* FIFO order matching
* Limit orders
* Market orders
* Partial fills
* Full fills
* Order cancellation
* Multiple markets
* Aggregated bid/ask snapshots

The matching engine can be demonstrated independently:

```bash
npx tsx packages/matching-engine/src/tests/matching-demo.ts
```

The demo covers:

* Full matches
* Partial fills
* FIFO behavior
* Non-matching orders
* Filled order status

## Order Recovery

Open orders are persisted in PostgreSQL.

When the API starts, orders with the following statuses are loaded:

```text
PENDING
PARTIALLY_FILLED
```

These orders are reconstructed into the matching engine's in-memory order books.

This allows open orders to continue participating in matching after an API restart.

The order book itself remains an in-memory runtime structure, while PostgreSQL acts as the durable source for persisted orders.

## Data Model

The Prisma database contains:

```text
User
Asset
Wallet
Market
Order
Trade
Transaction
Balance
```

Orders support:

```text
BUY / SELL
LIMIT / MARKET
PENDING / PARTIALLY_FILLED / FILLED / CANCELLED
```

The authoritative database schema is located at:

```text
packages/database/prisma/schema.prisma
```

Domain notes are available under:

```text
docs/domain-model.md
```

## Development Validation

Run linting:

```bash
npm run lint
```

Run TypeScript validation:

```bash
npm run check-types
```

Format the project:

```bash
npm run format
```

Build the frontend:

```bash
npm run build --workspace web
```

Start the production frontend:

```bash
npm run start --workspace web
```

## Current Runtime Boundaries

* The matching engine maintains order books in process memory.
* Candle history is maintained in process memory.
* Current ticker and order-book state are runtime state.
* Restart recovery reloads persisted open orders into the matching engine.
* Historical candles are not persisted to PostgreSQL.
* Redis currently connects to `localhost:6379`.
* API CORS currently allows `http://localhost:3000`.
* PostgreSQL and Redis are provisioned through Docker Compose.
* The API, WebSocket gateway, and frontend run locally during development.
* The repository does not define production deployment manifests or Kubernetes configuration.
* The matching demo is a runnable TypeScript scenario rather than a test-runner suite.

## Disclaimer

Exchange Sim is an educational and demonstration project.

It is not connected to a real cryptocurrency exchange, does not execute real trades, and should not be used as production trading infrastructure.