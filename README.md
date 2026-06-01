# QDC Mini Assignment

This repository contains a very small slice of **QDC (Quick Dry Cleaning Software)**, a B2B POS and business management app for retail laundry and dry-cleaning businesses. The goal is to simulate how you would work with an existing TypeScript/NestJS/React codebase, extend features, and reason about tradeoffs.

## Business Context

Dry-cleaning stores use QDC to manage orders, garments, and delivery. Each order contains multiple garments with statuses such as `received`, `in_cleaning`, `ready`, and `delivered`. Staff need quick visibility into what is in progress, what is ready for pickup, and what has already been delivered.

This mini app exposes a simple API to list orders and a React UI to display them.

## What Is Already Implemented

### Backend (NestJS)
- A NestJS application under `server/`.
- `OrdersService` with in-memory mock data representing a couple of orders and garments.
- `GET /api/orders` to list all orders.
- `GET /api/orders/:id` to fetch a single order by ID (returns a simple `{ error: string }` object if not found).

### Frontend (React + TypeScript)
- A minimal React app under `client/`.
- `App.tsx` fetches orders from `http://localhost:3001/api/orders` and displays loading/error states.
- `OrdersList.tsx` renders a basic card for each order and lists garments with a human-friendly status label.


## Running the Project

### Prerequisites
- Node.js 18+ (Node 20 recommended)

### Install dependencies

From the repository root:

```bash
npm run install-all
``

This uses npm workspaces to install dependencies for both `server` and `client`.

### Start the backend and frontend together

From the repository root:

```bash
npm run dev
```

This will:
- Start the NestJS server on **http://localhost:3001** (API under `/api`).
- Start the React app on **http://localhost:3000**.

### Useful URLs

- `GET http://localhost:3001/api/orders` — list all orders.
- `GET http://localhost:3001/api/orders/ORD-1001` — fetch a specific order.
- `http://localhost:3000` — React UI showing the orders.

## Notes

- The data is in-memory only; restarting the server resets it.
- Error handling and validation are intentionally minimal to keep the code small.
- You are free to refactor small pieces if it helps you implement the tasks cleanly, but keep the overall structure recognizable.

When you work on the implementation tasks, please follow TypeScript types carefully and think about how this would scale to more complex workflows (e.g., billing, delivery, prepaid packages) in a real QDC environment.
