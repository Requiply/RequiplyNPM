import { describe, expect, it, vi } from 'vitest';
import { RequiplyClient, RequiplyError } from '../src/index';

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

describe('RequiplyClient', () => {
  it('sends auth and serializes query parameters', async () => {
    const fetcher = vi.fn(async () => jsonResponse({ items: [], nextCursor: null }));
    const client = new RequiplyClient({
      apiKey: 'rq_pk_live_test',
      baseUrl: 'https://example.com/',
      fetch: fetcher,
    });

    await client.inventory.list({ search: 'camera', limit: 25, cursor: undefined });

    const [url, init] = fetcher.mock.calls[0]!;
    expect(String(url)).toBe('https://example.com/api/public/v1/inventory/list?search=camera&limit=25');
    expect(new Headers(init?.headers).get('authorization')).toBe('Bearer rq_pk_live_test');
  });

  it('serializes POST bodies and idempotency keys', async () => {
    const fetcher = vi.fn(async () => jsonResponse({ currency: 'USD', total: 100 }));
    const client = new RequiplyClient({
      apiKey: 'rq_pk_live_test',
      baseUrl: 'https://example.com',
      fetch: fetcher,
    });

    await client.pricing.quote(
      {
        startDate: '2026-07-01',
        endDate: '2026-07-02',
        items: [{ groupId: 'camera', quantity: 2 }],
      },
      { idempotencyKey: 'quote-123' },
    );

    const [, init] = fetcher.mock.calls[0]!;
    expect(init?.method).toBe('POST');
    expect(new Headers(init?.headers).get('idempotency-key')).toBe('quote-123');
    expect(JSON.parse(String(init?.body))).toMatchObject({
      startDate: '2026-07-01',
      items: [{ groupId: 'camera', quantity: 2 }],
    });
  });

  it('throws a typed error with retry information', async () => {
    const fetcher = vi.fn(async () => jsonResponse(
      { message: 'Rate limit exceeded' },
      { status: 429, headers: { 'retry-after': '15' } },
    ));
    const client = new RequiplyClient({
      apiKey: 'rq_sk_live_test',
      baseUrl: 'https://example.com',
      fetch: fetcher,
    });

    const request = client.reports.pipeline();
    await expect(request).rejects.toBeInstanceOf(RequiplyError);
    await expect(request).rejects.toMatchObject({
      status: 429,
      message: 'Rate limit exceeded',
      retryAfter: 15,
    });
  });
});
