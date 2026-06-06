# Exchange Domain Model (V1)

## Overview

This project is a distributed cryptocurrency exchange simulator supporting:

* User accounts
* Wallet balances
* Spot trading
* Limit orders
* Market orders
* Real-time order books
* Trade execution
* Portfolio tracking

---

## Core Entities

### User

Represents a registered trader.

Attributes:

* id
* email
* username
* passwordHash
* createdAt
* updatedAt

---

### Asset

Represents a cryptocurrency.

Examples:

* BTC
* ETH
* SOL
* USDT

Attributes:

* id
* symbol
* name
* isActive

---

### Market

Represents a trading pair.

Examples:

* BTC/USDT
* ETH/USDT
* SOL/USDT

Attributes:

* id
* baseAssetId
* quoteAssetId
* isActive

---

### Wallet

Stores user balances.

Attributes:

* id
* userId
* assetId
* availableBalance
* lockedBalance

Locked balances are funds reserved for active orders.

---

### Order

Represents a user's trading intent.

Order Sides:

* BUY
* SELL

Order Types:

* MARKET
* LIMIT

Order Status:

* PENDING
* PARTIALLY_FILLED
* FILLED
* CANCELLED

Attributes:

* id
* userId
* marketId
* side
* type
* price
* quantity
* filledQuantity
* status
* createdAt
* updatedAt

---

### Trade

Created when matching orders execute.

Attributes:

* id
* buyOrderId
* sellOrderId
* price
* quantity
* executedAt

---

### Transaction

Represents a balance change.

Examples:

* Deposit
* Withdrawal
* Trade Settlement

Attributes:

* id
* userId
* assetId
* amount
* type
* createdAt

---

## Order Execution Lifecycle

1. User places order.
2. Funds are locked in wallet.
3. Order enters order book.
4. Matching engine searches for matches.
5. Trade is executed.
6. Wallet balances are updated.
7. Trade record is created.
8. Order status is updated.

---

## Future Enhancements

* Margin Trading
* Futures Trading
* Stop Orders
* OCO Orders
* AI Trade Insights
* Multi-Asset Markets
