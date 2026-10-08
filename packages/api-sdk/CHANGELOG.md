# Changelog

## 0.2.1

### Added

- `bundles.list()` and `bundles.get()`: fixed sets of products booked together with one discount.
- `bundles` on `pricing.quote()` and `bookings.create()`; `items` may be empty when bundles are sent.
- `bundleDiscountAmount` and `lineBundles` in quotes, and `bundles` on item group details.

## 0.2.0

Brings the SDK in line with the Requiply public API v1.

### Breaking changes

- `RequiplyError.code` is removed; it was never set. Use `reason`, the machine-readable reason the API sends (for example `out_of_stock`), and `data` for the extra fields that come with it.
- The `idempotencyKey` request option is removed. The API does not deduplicate requests, so retrying `bookings.create()` or `sales.create()` can create a second record.
- `BookingCreateResponse` is now a union of `BookingCreated` and `BookingRefused`. Check `success` before reading `reservationId`.
- `BookingCreateInput` requires `paymentType` unless `asRequest` is `true`, matching the API's validation.
- With a publishable key, `bookings.create()` must send `asRequest: true`; otherwise the API answers `403` with reason `request_only`.

### Added

- `saleItems.list()`, `saleItems.get()`, `sales.list()`, `sales.get()` and `sales.create()`.
- `saleLines` on `pricing.quote()` and `bookings.create()`, and the matching `saleSubtotal` and `lineSaleItems` in quotes.
- Booking adjustments: `adjustment` on quotes and bookings, with `discountableSubtotal`, `discountAmount`, `adjustment` and `adjustmentAmount` in quotes.
- `allowOutsideWorkingHours` on `bookings.create()` (secret keys).
- `reason` and `minimumDuration` on refused bookings.
- `workingHours` in `org.info()`.
- `saleItems` and `saleId` on booking details.
- `excludeFromDiscounts` on services and `excludedFromDiscount` on quoted services.
- `stillOutUnits` on overdue report entries.
- `stripe` as a payment method.

### Fixed

- Constructing a client without an `apiKey` now throws `Requiply apiKey is required` instead of a `TypeError` about `trim`.

## 0.1.2

- Default API origin is `https://api.requiply.com`.
