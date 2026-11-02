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
  it('uses the hosted Requiply API by default', async () => {
    const fetcher = vi.fn<typeof fetch>(async () => jsonResponse({ items: [], nextCursor: null }));
    const client = new RequiplyClient({ apiKey: 'rq_pk_live_test', fetch: fetcher });

    await client.inventory.list();

    expect(String(fetcher.mock.calls[0]![0])).toBe('https://api.requiply.com/api/public/v1/inventory/list');
  });

  it('sends auth and serializes query parameters', async () => {
    const fetcher = vi.fn<typeof fetch>(async () => jsonResponse({ items: [], nextCursor: null }));
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

  it('serializes POST bodies', async () => {
    const fetcher = vi.fn<typeof fetch>(async () => jsonResponse({ currency: 'USD', total: 100 }));
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
        saleLines: [{ saleItemId: 'gloves', quantity: 1 }],
      },
    );

    const [, init] = fetcher.mock.calls[0]!;
    expect(init?.method).toBe('POST');
    expect(new Headers(init?.headers).get('content-type')).toBe('application/json');
    expect(JSON.parse(String(init?.body))).toMatchObject({
      startDate: '2026-07-01',
      items: [{ groupId: 'camera', quantity: 2 }],
      saleLines: [{ saleItemId: 'gloves', quantity: 1 }],
    });
  });

  it('rejects a missing api key with a clear message', () => {
    expect(() => new RequiplyClient({ apiKey: undefined as unknown as string })).toThrow('Requiply apiKey is required');
    expect(() => new RequiplyClient({ apiKey: '  ' })).toThrow('Requiply apiKey is required');
  });

  it('calls the sales endpoints', async () => {
    const fetcher = vi.fn<typeof fetch>(async () => jsonResponse({}));
    const client = new RequiplyClient({
      apiKey: 'rq_sk_live_test',
      baseUrl: 'https://example.com',
      fetch: fetcher,
    });

    await client.saleItems.list({ search: 'gloves', filter: 'all' });
    await client.saleItems.get('item 1');
    await client.sales.list({ kind: 'standalone', unpaid: true });
    await client.sales.get(12, { idKind: 'org' });
    await client.sales.create({ lines: [{ saleItemId: 'gloves', quantity: 2 }], paymentMethod: 'monobank' });

    const calls = fetcher.mock.calls.map(([url, init]) => `${init?.method} ${String(url)}`);
    expect(calls).toEqual([
      'GET https://example.com/api/public/v1/sale-items/list?search=gloves&filter=all',
      'GET https://example.com/api/public/v1/sale-items/item%201',
      'GET https://example.com/api/public/v1/sales/list?kind=standalone&unpaid=true',
      'GET https://example.com/api/public/v1/sales/12?idKind=org',
      'POST https://example.com/api/public/v1/sales/create',
    ]);
  });

  it('changes whether a rental product is visible to clients', async () => {
    const fetcher = vi.fn<typeof fetch>(async () => jsonResponse({
      itemGroup: { id: 'tent 1', name: 'Tent', visibleToClients: false },
    }));
    const client = new RequiplyClient({
      apiKey: 'rq_sk_live_test',
      baseUrl: 'https://example.com',
      fetch: fetcher,
    });

    const { itemGroup } = await client.inventory.updateGroup('tent 1', { visibleToClients: false });

    const [url, init] = fetcher.mock.calls[0]!;
    expect(`${init?.method} ${String(url)}`).toBe('PATCH https://example.com/api/public/v1/inventory/groups/tent%201');
    expect(new Headers(init?.headers).get('content-type')).toBe('application/json');
    expect(JSON.parse(String(init?.body))).toEqual({ visibleToClients: false });
    expect(itemGroup.visibleToClients).toBe(false);
  });

  it('resolves a refused booking without throwing', async () => {
    const fetcher = vi.fn<typeof fetch>(async () => jsonResponse({
      success: false,
      message: 'Outside working hours',
      totalCost: 0,
      currency: 'UAH',
      reason: 'working_hours',
    }));
    const client = new RequiplyClient({ apiKey: 'rq_pk_live_test', fetch: fetcher });

    const result = await client.bookings.create({
      startDate: '2026-07-01T07:00',
      endDate: '2026-07-02T07:00',
      items: [{ groupId: 'camera', quantity: 1 }],
      deliveryType: 'pickup',
      asRequest: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.reason).toBe('working_hours');
  });

  it('exposes the refusal reason and data of an API error', async () => {
    const fetcher = vi.fn<typeof fetch>(async () => jsonResponse(
      {
        error: true,
        statusCode: 409,
        statusMessage: 'Server Error',
        message: 'Only 2 × Gloves left',
        data: { reason: 'out_of_stock', saleItemId: 'gloves', availableQuantity: 2 },
      },
      { status: 409 },
    ));
    const client = new RequiplyClient({ apiKey: 'rq_pk_live_test', fetch: fetcher });

    const request = client.pricing.quote({
      startDate: '2026-07-01',
      endDate: '2026-07-02',
      items: [],
      saleLines: [{ saleItemId: 'gloves', quantity: 3 }],
    });
    await expect(request).rejects.toMatchObject({
      status: 409,
      message: 'Only 2 × Gloves left',
      reason: 'out_of_stock',
      data: { availableQuantity: 2 },
    });
  });

  it('throws a typed error with retry information', async () => {
    const fetcher = vi.fn<typeof fetch>(async () => jsonResponse(
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
