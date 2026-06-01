# QDC Mini Assignment

## 1. Production Scaling & Data Access Layer Evolution

The current in-memory array loses data on restart, blocks horizontal scaling, and lacks concurrency locks.

### Recommended Evolution:

* **Database Layer:** Migrating to a relational database (**PostgreSQL**) using an ORM (**Prisma** or **TypeORM**) to safely manage relational dependencies (Orders, Garments, Customers).
* **Concurrency:** Implementing **Optimistic Concurrency Control (OCC)** or database transactions to prevent race conditions when multiple workers update garment statuses simultaneously.
* **Performance:** Extracting data access into a **Repository Pattern** and adding a **Redis** caching layer for active, high-traffic store dashboards.



## 2. Error Handling & API Contract Design Tradeoffs

### Current Tradeoffs

* Returning an `{ error: string }` object in a successful HTTP 200 payload breaks REST standards.
* Forces frontend code to run continuous runtime checks (`'error' in response`), bypassing strict TypeScript compile-time safety.

### Real-World Improvement

1. **HTTP Status Codes:** Throw native NestJS exceptions (e.g., `NotFoundException`) to automatically map failures to standard codes (`404`, `400`).
2. **Standard Schema:** Adopt an RFC 7807 style payload structure:
```json
{ "statusCode": 404, "message": "Order not found", "timestamp": "2026-06-01..." }

```




## 3. Frontend Architecture Scalability

Using `fetch` inside an unparameterized `useEffect` lacks built-in caching, pagination controls, deduplication, and request lifecycle management.

### Recommended Evolution:

* **Data-Fetching Engine:** Replace native fetch with **TanStack Query (React Query)** to handle state caching, background sync, and loading states out of the box.
* **Architecture:** Isolate endpoints into a dedicated API client module (`src/api/orders.ts`) and wrap them in parameter-driven custom hooks (e.g., `useOrders({ page, status })`).
* **Routing:** Synchronize filter and pagination states directly with the **URL parameters** for shared/bookmarked dashboard views.


## 4. Domain Model Evolution for Laundry/Dry-Cleaning Operations

The current minimalistic domain model omits essential operational real-world rules:

* **Garment Tracking & Risk Protection:** Missing physical tag tracking data (`barcodeId`) and critical liability guardrails like a `defects` array (e.g., pre-existing stains/tears noted at intake).
* **Non-Linear Workflows:** Missing fallback handling states like `failed_cleaning` (requiring a re-wash), `partial_ready` (split order fulfillment), or `unclaimed`.
* **Billing & Logistics:** Missing payment tracking state (`unpaid`, `prepaid`, `partially_paid`) and fulfillment models (In-Store Pickup vs. Home Delivery routing details).


## 5. Risks and Mitigation of AI-Generated Code

### Specific Risks

* **Silent Edge Bugs:** Code that looks syntactically clean but fails complex business requirements (e.g., rounding errors using raw JS floats for financial calculations instead of integer cents).
* **Security & Alignment:** Risk of insecure database queries, missing authorization checks, or violating idiomatic NestJS dependency injection architecture.

### Mitigation Practices

1. **Mandatory Code Reviews:** Enforce explicit peer verification focusing on data validation, edge flows, and security.
2. **Automated Testing:** Require unit/integration test suites (Jest/React Testing Library) explicitly targeting negative and empty boundary conditions.


## 6. Real-Time Architecture for Status Dashboards

* **HTTP Polling (Simple but Heavy):** Client checks `GET /api/orders` periodically. Easy to build, but causes extreme database strain and excessive network overhead.
* **Server-Sent Events (SSE) (Optimal):** Unidirectional real-time stream via HTTP. Extremely lightweight and perfectly matches read-only status board updates.
* **WebSockets (Bi-directional):** Sub-second latency via persistent TCP channels. Excellent for heavy user interaction, but adds complexity and requires a Redis Pub/Sub backplane to scale across servers horizontally.