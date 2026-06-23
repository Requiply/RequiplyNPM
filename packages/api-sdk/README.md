# @requiply/api-sdk

Build custom equipment rental websites, booking flows, and rental business apps with Requiply's public API.

`@requiply/api-sdk` is the official framework-agnostic TypeScript SDK for Requiply, a rental management platform for equipment rental companies, construction rental businesses, event and party rental companies, sports and outdoor rental shops, and other businesses that rent inventory online.

Use this package to create a rental storefront or custom app with ease: show inventory, check availability, generate rental quotes, accept booking requests, manage customers, and connect your website to Requiply. It works in Next.js, Nuxt, Node.js, serverless functions, and modern browsers.

- Website: [requiply.com](https://requiply.com)
- Documentation: [Requiply Developer Docs](https://requiply.gitbook.io/requiply-docs/knowledge/developer-documentation/developer-docs)
- Register: [app.requiply.com/register](https://app.requiply.com/register)

## Who this is for

This SDK is built for developers, freelancers, and agencies creating rental websites or rental apps for:

- Construction equipment rental businesses
- Tool and machinery rental companies
- Event and party rental companies
- Sports, outdoor, and recreation rental shops
- Local rental businesses that need online booking, availability, quotes, and inventory search

You need a Requiply account to use this package with real rental inventory and API keys. After you create an account, you can connect your Requiply rental catalog to a custom website, marketplace-style rental experience, booking form, customer portal, or internal operations app.

## Install

```bash
npm install @requiply/api-sdk
```

## Quick start

1. Create a Requiply account at [app.requiply.com/register](https://app.requiply.com/register).
2. Add your rental inventory, categories, pricing, and availability in Requiply.
3. Create an API key from your Requiply account.
4. Install `@requiply/api-sdk` in your website or app.
5. Use the SDK to build catalog pages, availability search, rental quotes, booking requests, and admin workflows.

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

## What you can build

- A custom equipment rental website with searchable inventory and online booking requests
- A construction rental catalog with date-based availability and rental quote generation
- An event and party rental storefront for tents, tables, chairs, staging, decor, and services
- A sports and outdoor rental booking app for bikes, kayaks, skis, camping gear, and recreation equipment
- A customer portal, internal dashboard, or agency-built integration for a rental business

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

## Common use cases

### Show available rental inventory

Use `inventory.list()` with rental dates to display equipment, party rentals, tools, vehicles, or outdoor gear that customers can request online.

### Generate rental quotes

Use `pricing.quote()` to calculate rental pricing for selected inventory, quantities, dates, and services before creating a booking request.

### Create booking requests

Use `bookings.create()` to send customer rental requests from your website into Requiply, where the rental business can manage follow-up, confirmation, fulfillment, and reporting.

### Build private rental business tools

Use secret-key methods on the server to manage bookings, clients, reports, inventory status, and organization data for dashboards, portals, and back-office tools.

## Framework adapters

Keep framework packages thin. A future `@requiply/nuxt` module should inject this client and map runtime config, while a future `@requiply/next` package should provide server-only and publishable-key factories. Endpoint behavior, errors, and contracts should remain owned by this package.

## FAQ

### Do I need a Requiply account?

Yes. You need a Requiply account to create API keys and manage the rental inventory, pricing, availability, customers, and bookings that your website or app connects to.

### Can I use this for a custom rental website?

Yes. The SDK is designed for custom rental websites, storefronts, booking forms, customer portals, and internal rental business apps.

### Can agencies and freelancers use this for client projects?

Yes. Agencies and freelancers can use Requiply and this SDK to build websites and applications for equipment rental, construction rental, party rental, event rental, sports rental, outdoor rental, and other rental businesses.
