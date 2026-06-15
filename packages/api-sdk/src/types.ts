export type QueryValue = string | number | boolean | null | undefined;

export interface RequiplyRequestOptions {
  signal?: AbortSignal;
  headers?: HeadersInit;
  idempotencyKey?: string;
}

export interface RequiplyClientOptions {
  apiKey: string;
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
  headers?: HeadersInit;
  dangerouslyAllowSecretKeyInBrowser?: boolean;
}

export interface PaymentRedirect {
  kind: 'url' | 'post_form';
  url: string;
  fields?: Record<string, string>;
}

export interface PublicV1PricingTier {
  fromUnit: number;
  toUnit: number | null;
  amount: number;
}

export interface PublicV1InventoryItem {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  itemType: 'property' | 'equipment';
  priceType: 'day' | 'hour' | 'month' | 'quote';
  basePrice: number;
  currency: string;
  imageUrl: string | null;
  categoryId: string | null;
  totalQuantity: number;
  availableQuantity: number;
  pricingTiers: PublicV1PricingTier[];
}

export interface InventoryListParams {
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  cursor?: string;
}

export interface InventoryListResponse {
  items: PublicV1InventoryItem[];
  nextCursor: string | null;
}

export interface PublicV1ItemImage {
  url: string;
  isDefault: boolean;
}

export interface PublicV1ItemGroupDetail {
  id: string;
  name: string;
  sku: string;
  itemType: 'property' | 'equipment';
  priceType: 'day' | 'hour' | 'month' | 'quote';
  basePrice: number;
  currency: string;
  categoryId: string | null;
  categoryName: string | null;
  images: PublicV1ItemImage[];
  totalQuantity: number;
  pricingTiers: PublicV1PricingTier[];
}

export interface ItemGroupResponse {
  itemGroup: PublicV1ItemGroupDetail;
}

export interface AvailabilityCalendarInput {
  startDate: string;
  endDate: string;
  groupIds?: string[];
}

export interface PublicV1CalendarDay {
  date: string;
  groupId: string;
  groupName: string;
  totalQuantity: number;
  reservedQuantity: number;
  availabilityStatus: string | null;
}

export interface AvailabilityCalendarResponse {
  days: PublicV1CalendarDay[];
}

export interface AvailabilityItemsInput {
  startDate: string;
  endDate: string;
  search?: string;
  limit?: number;
  cursor?: string;
}

export interface AvailabilityItemsResponse {
  items: PublicV1InventoryItem[];
  nextCursor: string | null;
}

export interface QuoteItem {
  groupId: string;
  quantity: number;
}

export interface QuoteService {
  serviceId: string;
}

export interface PricingQuoteInput {
  startDate: string;
  endDate: string;
  items: QuoteItem[];
  services?: QuoteService[];
  clientId?: number;
}

export interface PublicV1QuoteLineItem {
  groupId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitCount: number;
  subtotal: number;
}

export interface PublicV1QuoteLineService {
  serviceId: string;
  name: string;
  subtotal: number;
}

export interface PricingQuoteResponse {
  currency: string;
  itemsSubtotal: number;
  servicesSubtotal: number;
  discountPercentage: number;
  total: number;
  lineItems: PublicV1QuoteLineItem[];
  lineServices: PublicV1QuoteLineService[];
}

export interface BookingCreateInput extends PricingQuoteInput {
  client?: {
    name?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  deliveryType: 'pickup' | 'delivery';
  paymentType?: 'payOnPickup' | 'monobank' | 'liqpay' | 'wayforpay' | 'stripe';
  asRequest?: boolean;
}

export interface BookingCreateResponse {
  success: boolean;
  message?: string;
  reservationId?: number;
  reservationOrgId?: number;
  totalCost: number;
  currency: string;
  paymentUrl?: string;
  paymentRedirect?: PaymentRedirect;
  isRequest?: boolean;
}

export interface BookingListParams {
  dateFrom?: string;
  dateTo?: string;
  createdFrom?: string;
  createdTo?: string;
  status?: string;
  clientId?: number;
  limit?: number;
  cursor?: string;
}

export interface PublicV1BookingListItem {
  id: number;
  reservationOrgId: number | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  statusId: string | null;
  statusName: string | null;
  statusColor: string | null;
  clientId: number | null;
  clientName: string | null;
  clientLastName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  totalCost: number | null;
}

export interface BookingListResponse {
  bookings: PublicV1BookingListItem[];
  nextCursor: string | null;
  currency: string;
}

export interface PublicV1BookingDetail {
  id: number;
  reservationOrgId: number | null;
  startDate: string;
  endDate: string;
  totalCost: number | null;
  currency: string;
  statusId: string | null;
  clientId: number | null;
  createdAt: string;
  items: Array<{ groupId: string; groupName: string; quantity: number }>;
  services: Array<{ serviceId: string; serviceName: string; price: number | null }>;
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    method: string;
    provider: string | null;
    status: string;
    paymentUrl: string | null;
  }>;
}

export interface BookingDetailResponse {
  booking: PublicV1BookingDetail;
}

export interface BookingNoteResponse {
  noteId: string;
  reservationId: number;
  createdAt: string | null;
}

export interface ClientLookupInput {
  email?: string;
  phone?: string;
  search?: string;
}

export interface PublicV1ClientSummary {
  id: number;
  name: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  discountPercentage: number;
}

export interface ClientLookupResponse {
  client: PublicV1ClientSummary | null;
  matches?: PublicV1ClientSummary[];
}

export interface ClientCreateInput {
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface ClientCreateResponse {
  client: PublicV1ClientSummary;
  created: boolean;
}

export interface PublicV1Service {
  id: string;
  name: string;
  price: number | null;
  priceType: string;
}

export interface ServicesListResponse {
  services: PublicV1Service[];
  currency: string;
}

export interface PublicV1Location {
  id: string;
  name: string;
  city: string;
  country: string;
  street: string | null;
  addressLine: string | null;
  isDefault: boolean;
}

export interface OrgInfoResponse {
  id: string;
  name: string;
  description: string | null;
  email: string | null;
  currency: string;
  language: string;
  webUrlCode: string | null;
  logoUrlLight: string | null;
  logoUrlDark: string | null;
  timezone: string;
  supportedDeliveryTypes: Array<'pickup' | 'delivery'>;
  supportedPaymentMethods: Array<'payOnPickup' | 'monobank' | 'liqpay' | 'wayforpay'>;
  locations: PublicV1Location[];
}

export interface OrgSummaryResponse {
  organization: {
    id: string;
    name: string;
    description: string | null;
    email: string | null;
    tier: string | null;
    currency: string;
    language: string;
    timezone: string;
    webUrlCode: string | null;
    logoUrlLight: string | null;
    logoUrlDark: string | null;
    websiteBuilderEnabled: boolean;
    createdAt: string | null;
    trialEndsAt: string | null;
  };
  locations: PublicV1Location[];
  supportedDeliveryTypes: Array<'pickup' | 'delivery'>;
  supportedPaymentMethods: Array<'payOnPickup' | 'monobank' | 'liqpay' | 'wayforpay'>;
  stats: {
    totalClients: number;
    totalItemGroups: number;
    totalItems: number;
    totalCategories: number;
    totalLocations: number;
    totalLifetimeBookings: number;
    bookingsActiveNow: number;
    bookingsUpcoming: number;
  };
}

export interface CategoriesListResponse {
  categories: Array<{
    id: string;
    name: string;
    itemType: 'property' | 'equipment';
  }>;
}

export interface InventoryStatusParams {
  limit?: number;
}

export interface InventoryStatusResponse {
  asOf: string;
  totals: {
    totalUnits: number;
    unitsOnRent: number;
    unitsAvailable: number;
    activeBookingCount: number;
  };
  currentlyOut: Array<{
    reservationId: number;
    reservationOrgId: number | null;
    itemGroupId: string;
    itemGroupName: string;
    quantity: number;
    startDate: string;
    endDate: string;
    statusName: string | null;
    clientId: number | null;
    clientName: string | null;
    clientLastName: string | null;
  }>;
}

export type RevenueDateField = 'startDate' | 'createdAt' | 'endDate';
export type RevenueGroupBy = 'day' | 'week' | 'month' | 'category' | 'status';

export interface RevenueReportParams {
  dateFrom?: string;
  dateTo?: string;
  dateField?: RevenueDateField;
  groupBy?: RevenueGroupBy;
  excludeCancelled?: boolean;
}

export interface RevenueReportResponse {
  currency: string;
  dateFrom: string;
  dateTo: string;
  dateField: RevenueDateField;
  groupBy: RevenueGroupBy;
  excludeCancelled: boolean;
  totals: { totalRevenue: number; bookingCount: number; avgOrderValue: number };
  breakdown: Array<{ key: string; label: string; revenue: number; bookingCount: number }>;
  notes?: string[];
}

export interface BookingsSummaryParams {
  dateFrom?: string;
  dateTo?: string;
  dateField?: RevenueDateField;
}

export interface BookingsSummaryResponse {
  currency: string;
  dateFrom: string;
  dateTo: string;
  dateField: RevenueDateField;
  totals: {
    totalBookings: number;
    totalRevenue: number;
    avgOrderValue: number;
    medianOrderValue: number;
  };
  rates: { cancellationRate: number; completionRate: number };
  timing: { avgLeadTimeDays: number | null; avgDurationDays: number | null };
  byStatus: Array<{
    statusId: string | null;
    statusName: string;
    count: number;
    percentage: number;
  }>;
}

export interface UtilizationReportParams {
  dateFrom?: string;
  dateTo?: string;
  groupBy?: 'overall' | 'itemGroup' | 'category';
  sort?: 'highest' | 'lowest';
  limit?: number;
}

export interface UtilizationReportResponse {
  dateFrom: string;
  dateTo: string;
  groupBy: 'overall' | 'itemGroup' | 'category';
  sort: 'highest' | 'lowest';
  overall: {
    activeItemCount: number;
    totalAvailableDays: number;
    totalRentedDays: number;
    utilizationRate: number;
  };
  breakdown?: Array<{
    key: string;
    label: string;
    availableDays: number;
    rentedDays: number;
    utilizationRate: number;
    itemCount: number;
  }>;
}

export interface TopItemsReportParams {
  dateFrom?: string;
  dateTo?: string;
  rankBy?: 'revenue' | 'bookings' | 'rentedDays' | 'unitsRented';
  limit?: number;
}

export interface TopItemsReportResponse {
  currency: string;
  dateFrom: string;
  dateTo: string;
  rankBy: NonNullable<TopItemsReportParams['rankBy']>;
  entries: Array<{
    itemGroupId: string;
    name: string;
    categoryId: string | null;
    categoryName: string | null;
    revenue: number;
    bookingCount: number;
    rentedDays: number;
    unitsRented: number;
  }>;
}

export interface TopClientsReportParams {
  dateFrom?: string;
  dateTo?: string;
  rankBy?: 'spend' | 'bookings';
  excludeCancelled?: boolean;
  limit?: number;
}

export interface TopClientsReportResponse {
  currency: string;
  dateFrom: string;
  dateTo: string;
  rankBy: NonNullable<TopClientsReportParams['rankBy']>;
  excludeCancelled: boolean;
  entries: Array<{
    clientId: number;
    name: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    spend: number;
    bookingCount: number;
    avgOrderValue: number;
  }>;
}

export interface OutstandingReportParams {
  dateFrom?: string;
  dateTo?: string;
  minBalance?: number;
  limit?: number;
}

export interface OutstandingReportResponse {
  currency: string;
  dateFrom: string;
  dateTo: string;
  totals: {
    totalReservations: number;
    reservationsWithBalance: number;
    totalBilled: number;
    totalPaid: number;
    totalOwed: number;
  };
  topByBalance: Array<{
    reservationId: number;
    reservationOrgId: number | null;
    startDate: string;
    endDate: string;
    statusId: string | null;
    statusName: string | null;
    clientId: number | null;
    clientName: string | null;
    clientLastName: string | null;
    clientEmail: string | null;
    clientPhone: string | null;
    totalCost: number;
    paidAmount: number;
    balanceDue: number;
  }>;
}

export interface OverdueReportParams {
  limit?: number;
  minDaysOverdue?: number;
}

export interface OverdueReportResponse {
  currency: string;
  asOf: string;
  totals: {
    overdueCount: number;
    overdueValue: number;
    bySeverity: { critical: number; warning: number; info: number };
  };
  entries: Array<{
    reservationId: number;
    reservationOrgId: number | null;
    startDate: string;
    endDate: string;
    statusId: string | null;
    statusName: string | null;
    clientId: number | null;
    clientName: string | null;
    clientLastName: string | null;
    clientEmail: string | null;
    clientPhone: string | null;
    totalCost: number | null;
    daysOverdue: number;
    severity: 'info' | 'warning' | 'critical';
  }>;
}

export interface PipelineReportParams {
  horizonDays?: number;
  groupBy?: 'day' | 'week' | 'month';
}

export interface PipelineReportResponse {
  currency: string;
  asOf: string;
  horizonDays: number;
  dateFrom: string;
  dateTo: string;
  groupBy: NonNullable<PipelineReportParams['groupBy']>;
  totals: { upcomingBookings: number; pipelineRevenue: number };
  byBucket: Array<{ key: string; label: string; bookingCount: number; revenue: number }>;
}
