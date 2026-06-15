# @requiply/api-sdk

Framework-agnostic TypeScript client for Requiply's public rental API. It works in Next.js, Nuxt, Node.js, serverless functions, and modern browsers.

## Install

```bash
npm install @requiply/api-sdk
```

## Server usage

Use a secret key only in server code.

```ts
import { RequiplyClient } from '@requiply/api-sdk';

const requiply = new RequiplyClient({
  baseUrl: process.env.REQUIPLY_BASE_URL ?? 'https://app.requiply.com',
  apiKey: process.env.REQUIPLY_SECRET_KEY!,
});

const { bookings } = await requiply.bookings.list({
  dateFrom: '2026-07-01',
  dateTo: '2026-07-31',
});
```

## Storefront usage

Publishable keys can be used for public catalog, availability, quote, and booking-request flows.

```ts
const requiply = new RequiplyClient({
  baseUrl: 'https://app.requiply.com',
  apiKey: 'rq_pk_live_...',
});

const inventory = await requiply.inventory.list({
  startDate: '2026-07-01',
  endDate: '2026-07-03',
});

const quote = await requiply.pricing.quote({
  startDate: '2026-07-01',
  endDate: '2026-07-03',
  items: [{ groupId: inventory.items[0].id, quantity: 1 }],
});
```

Secret-key resources include booking administration, clients, reports, inventory status, and organization summaries. The client rejects `rq_sk_` keys in browser environments unless explicitly overridden.

## Resources

- `org.info()`, `org.summary()`
- `categories.list()`, `services.list()`
- `inventory.list()`, `inventory.getGroup()`, `inventory.status()`
- `availability.calendar()`, `availability.items()`
- `pricing.quote()`
- `bookings.create()`, `bookings.list()`, `bookings.get()`, `bookings.addNote()`
- `clients.lookup()`, `clients.create()`
- `reports.revenue()`, `reports.bookingsSummary()`, `reports.utilization()`
- `reports.topItems()`, `reports.topClients()`, `reports.outstanding()`
- `reports.overdue()`, `reports.pipeline()`

Every method accepts request options as its final argument, including `signal`, custom `headers`, and `idempotencyKey`.

## Framework adapters

Keep framework packages thin. A future `@requiply/nuxt` module should inject this client and map runtime config, while a future `@requiply/next` package should provide server-only and publishable-key factories. Endpoint behavior, errors, and contracts should remain owned by this package.
