import type {
  AvailabilityCalendarInput,
  AvailabilityCalendarResponse,
  AvailabilityItemsInput,
  AvailabilityItemsResponse,
  BookingCreateInput,
  BookingCreateResponse,
  BookingDetailResponse,
  BookingListParams,
  BookingListResponse,
  BookingNoteResponse,
  BookingsSummaryParams,
  BookingsSummaryResponse,
  CategoriesListResponse,
  ClientCreateInput,
  ClientCreateResponse,
  ClientLookupInput,
  ClientLookupResponse,
  InventoryListParams,
  InventoryListResponse,
  InventoryStatusParams,
  InventoryStatusResponse,
  ItemGroupResponse,
  OrgInfoResponse,
  OrgSummaryResponse,
  OutstandingReportParams,
  OutstandingReportResponse,
  OverdueReportParams,
  OverdueReportResponse,
  PipelineReportParams,
  PipelineReportResponse,
  PricingQuoteInput,
  PricingQuoteResponse,
  QueryValue,
  RequiplyClientOptions,
  RequiplyRequestOptions,
  RevenueReportParams,
  RevenueReportResponse,
  ServicesListResponse,
  TopClientsReportParams,
  TopClientsReportResponse,
  TopItemsReportParams,
  TopItemsReportResponse,
  UtilizationReportParams,
  UtilizationReportResponse,
} from './types.js';

interface RequestConfig {
  method?: 'GET' | 'POST';
  query?: object;
  body?: unknown;
  options?: RequiplyRequestOptions;
}

interface ApiErrorBody {
  code?: string;
  message?: string;
  statusMessage?: string;
  [key: string]: unknown;
}

export class RequiplyError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly retryAfter?: number;

  constructor(message: string, options: {
    status: number;
    code?: string;
    details?: unknown;
    retryAfter?: number;
  }) {
    super(message);
    this.name = 'RequiplyError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.retryAfter = options.retryAfter;
  }
}

export class RequiplyClient {
  readonly org = {
    info: (options?: RequiplyRequestOptions) =>
      this.request<OrgInfoResponse>('/org/info', { options }),
    summary: (options?: RequiplyRequestOptions) =>
      this.request<OrgSummaryResponse>('/org/summary', { options }),
  };

  readonly categories = {
    list: (options?: RequiplyRequestOptions) =>
      this.request<CategoriesListResponse>('/categories/list', { options }),
  };

  readonly services = {
    list: (options?: RequiplyRequestOptions) =>
      this.request<ServicesListResponse>('/services/list', { options }),
  };

  readonly inventory = {
    list: (params: InventoryListParams = {}, options?: RequiplyRequestOptions) =>
      this.request<InventoryListResponse>('/inventory/list', { query: params, options }),
    getGroup: (groupId: string, options?: RequiplyRequestOptions) =>
      this.request<ItemGroupResponse>(`/inventory/groups/${encodeURIComponent(groupId)}`, { options }),
    status: (params: InventoryStatusParams = {}, options?: RequiplyRequestOptions) =>
      this.request<InventoryStatusResponse>('/inventory/status', { query: params, options }),
  };

  readonly availability = {
    calendar: (input: AvailabilityCalendarInput, options?: RequiplyRequestOptions) =>
      this.request<AvailabilityCalendarResponse>('/availability/calendar', {
        method: 'POST',
        body: input,
        options,
      }),
    items: (input: AvailabilityItemsInput, options?: RequiplyRequestOptions) =>
      this.request<AvailabilityItemsResponse>('/availability/items', {
        method: 'POST',
        body: input,
        options,
      }),
  };

  readonly pricing = {
    quote: (input: PricingQuoteInput, options?: RequiplyRequestOptions) =>
      this.request<PricingQuoteResponse>('/pricing/quote', {
        method: 'POST',
        body: input,
        options,
      }),
  };

  readonly bookings = {
    create: (input: BookingCreateInput, options?: RequiplyRequestOptions) =>
      this.request<BookingCreateResponse>('/bookings/create', {
        method: 'POST',
        body: input,
        options,
      }),
    list: (params: BookingListParams = {}, options?: RequiplyRequestOptions) =>
      this.request<BookingListResponse>('/bookings/list', { query: params, options }),
    get: (
      id: number,
      params: { idKind?: 'internal' | 'org' } = {},
      options?: RequiplyRequestOptions,
    ) => this.request<BookingDetailResponse>(`/bookings/${id}`, { query: params, options }),
    addNote: (id: number, content: string, options?: RequiplyRequestOptions) =>
      this.request<BookingNoteResponse>(`/bookings/${id}/notes`, {
        method: 'POST',
        body: { content },
        options,
      }),
  };

  readonly clients = {
    lookup: (input: ClientLookupInput, options?: RequiplyRequestOptions) =>
      this.request<ClientLookupResponse>('/clients/lookup', {
        method: 'POST',
        body: input,
        options,
      }),
    create: (input: ClientCreateInput, options?: RequiplyRequestOptions) =>
      this.request<ClientCreateResponse>('/clients/create', {
        method: 'POST',
        body: input,
        options,
      }),
  };

  readonly reports = {
    revenue: (params: RevenueReportParams = {}, options?: RequiplyRequestOptions) =>
      this.request<RevenueReportResponse>('/reports/revenue', { query: params, options }),
    bookingsSummary: (params: BookingsSummaryParams = {}, options?: RequiplyRequestOptions) =>
      this.request<BookingsSummaryResponse>('/reports/bookings-summary', { query: params, options }),
    utilization: (params: UtilizationReportParams = {}, options?: RequiplyRequestOptions) =>
      this.request<UtilizationReportResponse>('/reports/utilization', { query: params, options }),
    topItems: (params: TopItemsReportParams = {}, options?: RequiplyRequestOptions) =>
      this.request<TopItemsReportResponse>('/reports/top-items', { query: params, options }),
    topClients: (params: TopClientsReportParams = {}, options?: RequiplyRequestOptions) =>
      this.request<TopClientsReportResponse>('/reports/top-clients', { query: params, options }),
    outstanding: (params: OutstandingReportParams = {}, options?: RequiplyRequestOptions) =>
      this.request<OutstandingReportResponse>('/reports/outstanding', { query: params, options }),
    overdue: (params: OverdueReportParams = {}, options?: RequiplyRequestOptions) =>
      this.request<OverdueReportResponse>('/reports/overdue', { query: params, options }),
    pipeline: (params: PipelineReportParams = {}, options?: RequiplyRequestOptions) =>
      this.request<PipelineReportResponse>('/reports/pipeline', { query: params, options }),
  };

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetcher: typeof globalThis.fetch;
  private readonly defaultHeaders: HeadersInit;

  constructor(options: RequiplyClientOptions) {
    if (!options.apiKey.trim()) {
      throw new TypeError('Requiply apiKey is required');
    }
    if (!options.baseUrl.trim()) {
      throw new TypeError('Requiply baseUrl is required');
    }
    if (
      typeof window !== 'undefined'
      && options.apiKey.startsWith('rq_sk_')
      && !options.dangerouslyAllowSecretKeyInBrowser
    ) {
      throw new TypeError(
        'Secret Requiply API keys must only be used on the server. Use a publishable key in browser code.',
      );
    }

    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.fetcher = options.fetch ?? globalThis.fetch;
    this.defaultHeaders = options.headers ?? {};

    if (!this.fetcher) {
      throw new TypeError('No fetch implementation is available');
    }
  }

  private async request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}/api/public/v1${path}`);
    for (const [key, value] of Object.entries(config.query ?? {}) as Array<[string, QueryValue]>) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }

    const headers = new Headers(this.defaultHeaders);
    for (const [key, value] of new Headers(config.options?.headers)) {
      headers.set(key, value);
    }
    headers.set('Accept', 'application/json');
    headers.set('Authorization', `Bearer ${this.apiKey}`);
    if (config.body !== undefined) {
      headers.set('Content-Type', 'application/json');
    }
    if (config.options?.idempotencyKey) {
      headers.set('Idempotency-Key', config.options.idempotencyKey);
    }

    const response = await this.fetcher(url, {
      method: config.method ?? 'GET',
      headers,
      body: config.body === undefined ? undefined : JSON.stringify(config.body),
      signal: config.options?.signal,
    });

    const raw = await response.text();
    const data = raw ? parseJson(raw) : undefined;

    if (!response.ok) {
      const error = isObject(data) ? data as ApiErrorBody : undefined;
      const retryAfterHeader = response.headers.get('retry-after');
      const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;
      throw new RequiplyError(
        error?.message ?? error?.statusMessage ?? `Requiply API request failed with status ${response.status}`,
        {
          status: response.status,
          code: typeof error?.code === 'string' ? error.code : undefined,
          details: data,
          retryAfter: retryAfter !== undefined && Number.isFinite(retryAfter) ? retryAfter : undefined,
        },
      );
    }

    return data as T;
  }
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
