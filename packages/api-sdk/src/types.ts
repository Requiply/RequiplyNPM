export type QueryValue = string | number | boolean | null | undefined;

export interface RequiplyRequestOptions {
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export interface RequiplyClientOptions {
  apiKey: string;
  /** API origin. Defaults to https://api.requiply.com. */
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
  headers?: HeadersInit;
  dangerouslyAllowSecretKeyInBrowser?: boolean;
}

/**
 * Machine-readable reasons the API puts on refused requests. Branch on
 * `RequiplyError.reason`; new reasons may be added, so keep a fallback.
 */
export type RequiplyErrorReason =
  | 'request_only'
  | 'out_of_stock'
  | 'selling_disabled'
  | 'feature_disabled'
  | 'invalid_lines'
  | 'invalid_payment'
  | 'payment_method_unavailable'
  | 'client_email_required'
  | 'duplicate_line'
  | 'sale_item_not_found'
  | 'sale_item_archived'
  | 'sale_not_found'
  | 'sale_cancelled'
  | 'sale_on_booking'
  | 'not_found'
  | 'stale'
  | (string & {});

export type PaymentMethod = 'payOnPickup' | 'monobank' | 'liqpay' | 'wayforpay' | 'stripe';

export interface PaymentRedirect {
  kind: 'url' | 'post_form';
  url: string;
  fields?: Record<string, string>;
}

export type BookingAdjustmentType = 'units' | 'percent' | 'amount';

/**
 * Manual booking adjustment: a period delta (`units`), a percentage of the
 * total (`percent`, -100 to 100) or a flat amount in the org currency
 * (`amount`). Signed. Secret keys only, and only when the organization has
 * adjustments on and allows the type.
 */
export interface BookingAdjustment {
  type: BookingAdjustmentType;
  value: number;
  reason?: string | null;
}

export type WorkingDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface WorkingHours {
  day: WorkingDay;
  /** `HH:mm`, in the organization's timezone. */
  startTime: string;
  /** `HH:mm`, in the organization's timezone. */
  endTime: string;
  isWorkingDay: boolean;
}

/** A named date or period the organization is closed. */
export interface OrgHoliday {
  name: string;
  /** First day, `YYYY-MM-DD` in the organization's timezone. */
  startDate: string;
  /** Last day, inclusive, `YYYY-MM-DD` in the organization's timezone. */
  endDate: string;
  /** Repeats on the same month and day every year from `startDate` on. */
  repeatsYearly: boolean;
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
  /** False when the product is hidden from clients. Publishable keys only ever get `true`. */
  visibleToClients: boolean;
}

export interface InventoryListParams {
  category?: string;
  search?: string;
  /** Pass with `endDate` to get availability for the period. */
  startDate?: string;
  endDate?: string;
  /** 1-100. Defaults to 25. */
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
  /** False when the product is hidden from clients. A publishable key gets a 404 for such a group instead. */
  visibleToClients: boolean;
  /** Bookable bundles containing this group; empty when the organization offers none to this key. */
  bundles: Array<{ id: string; name: string; discountPercent: number }>;
}

export interface ItemGroupResponse {
  itemGroup: PublicV1ItemGroupDetail;
}

export interface ItemGroupUpdateInput {
  /**
   * False hides the product from the client portal, website, booking widget, customer
   * assistant and publishable keys. Staff, secret keys and bundles can still book it.
   */
  visibleToClients: boolean;
}

export interface ItemGroupUpdateResponse {
  itemGroup: { id: string; name: string; visibleToClients: boolean };
}

export interface AvailabilityCalendarInput {
  startDate: string;
  endDate: string;
  /** Up to 200 item group ids. Omit for every group. */
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
  /** 1-100. Defaults to 25. */
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

export interface SaleLineInput {
  saleItemId: string;
  /** Whole units, above zero. */
  quantity: number;
}

export interface BundleLineInput {
  bundleId: string;
  /** Whole sets, above zero. */
  quantity: number;
}

export interface PublicV1BundleComponent {
  groupId: string;
  name: string;
  sku: string;
  /** Units of the group one bundle contains. */
  quantity: number;
  basePrice: number;
  priceType: 'day' | 'hour' | 'month' | 'quote';
  imageUrl: string | null;
}

/** A fixed set of products booked together with one discount on every component. */
export interface PublicV1Bundle {
  id: string;
  name: string;
  description: string | null;
  /** Percent taken off every component line, 0 to 100. */
  discountPercent: number;
  currency: string;
  imageUrl: string | null;
  images: PublicV1ItemImage[];
  components: PublicV1BundleComponent[];
  /** Whole sets free for the requested dates; null without dates. */
  availableQuantity: number | null;
}

export interface BundlesListParams {
  /** Pass with `endDate` to get availability for the period. */
  startDate?: string;
  endDate?: string;
}

export interface BundlesListResponse {
  bundles: PublicV1Bundle[];
}

export interface BundleResponse {
  bundle: PublicV1Bundle;
}

/** A bundle of a quote, priced for the period. */
export interface PublicV1QuoteLineBundle {
  id: string;
  bundleId: string | null;
  name: string;
  quantity: number;
  discountPercent: number;
  /** The bundled share of the component lines at full rate. */
  grossTotal: number;
  /** `grossTotal * discountPercent / 100`; already inside `total`. */
  discountAmount: number;
  /** Quantities are per bundle set. */
  components: Array<{ groupId: string; name: string; quantity: number }>;
}

export interface PricingQuoteInput {
  startDate: string;
  endDate: string;
  /** Lines outside any bundle; may be empty when `bundles` is set. */
  items: QuoteItem[];
  /** Bundles to book; their components are added to `items`. Needs the Bundles feature. */
  bundles?: BundleLineInput[];
  services?: QuoteService[];
  /** Applies the client's percentage discount. */
  clientId?: number;
  /** Secret keys only. `null` prices without one. */
  adjustment?: BookingAdjustment | null;
  /**
   * Equipment for sale sold with the booking, at the catalog price. Needs the
   * Sales feature; a publishable key also needs the organization to sell to
   * customers and cannot buy beyond the stock on hand.
   */
  saleLines?: SaleLineInput[];
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
  /** True when the service is billed in full regardless of the client discount. */
  excludedFromDiscount: boolean;
}

export interface PublicV1QuoteLineSaleItem {
  saleItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  stockOnHand: number;
  /** Stock after this sale; negative means the shelf count is behind. */
  stockAfter: number;
}

export interface PricingQuoteResponse {
  currency: string;
  itemsSubtotal: number;
  servicesSubtotal: number;
  /** Part of the items and services subtotal the client discount applies to. */
  discountableSubtotal: number;
  discountPercentage: number;
  discountAmount: number;
  /** The adjustment the quote was priced with; null when none. */
  adjustment: BookingAdjustment | null;
  /** Signed money effect of a `percent` or `amount` adjustment; 0 for `units`. */
  adjustmentAmount: number;
  /** Includes `saleSubtotal`. */
  total: number;
  lineItems: PublicV1QuoteLineItem[];
  lineServices: PublicV1QuoteLineService[];
  /** Net total of the sold items; already inside `total`, never discounted. */
  saleSubtotal: number;
  lineSaleItems: PublicV1QuoteLineSaleItem[];
  /** What the bundles save on their component lines; already inside `total`. 0 when none. */
  bundleDiscountAmount: number;
  /** Each bundle priced for the period. `lineItems` hold the merged quantities. */
  lineBundles: PublicV1QuoteLineBundle[];
}

interface BookingCreateFields extends PricingQuoteInput {
  /** Matched by email, then phone, or created. Ignored when `clientId` is set. */
  client?: {
    name?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  deliveryType: 'pickup' | 'delivery';
  /**
   * Allows a pickup or return outside the organization's working schedule.
   * Accepted with a secret key; publishable keys receive a 403.
   */
  allowOutsideWorkingHours?: boolean;
}

/**
 * A regular booking needs a `paymentType`. A booking request (`asRequest`)
 * waits for staff approval: it holds no inventory and sets up no payment.
 */
export type BookingCreateInput = BookingCreateFields & (
  | { asRequest?: false; paymentType: PaymentMethod }
  | { asRequest: true; paymentType?: PaymentMethod }
);

export interface BookingCreated {
  success: true;
  message?: string;
  reservationId: number;
  /** Booking number shown in the app. */
  reservationOrgId: number;
  totalCost: number;
  currency: string;
  /** Link to an online payment, for online payment methods. */
  paymentUrl?: string;
  paymentRedirect?: PaymentRedirect;
  isRequest: boolean;
}

export interface BookingRefused {
  success: false;
  /** Why the booking was refused, e.g. items unavailable for the dates. */
  message?: string;
  totalCost: number;
  currency: string;
  /** Booking rule the request broke; absent for other refusals such as availability. */
  reason?: 'working_hours' | 'minimum_duration';
  minimumDuration?: {
    minimumDurationMinutes: number;
    requestedDurationMinutes: number;
    /** Earliest return for the requested pickup, local `YYYY-MM-DDTHH:mm` in `timeZone`. */
    earliestReturn: string;
    timeZone: string;
  };
}

/** A refused booking resolves (HTTP 200) with `success: false`; check it before using the ids. */
export type BookingCreateResponse = BookingCreated | BookingRefused;

export interface BookingListParams {
  /** Reservation start date on or after (YYYY-MM-DD). */
  dateFrom?: string;
  /** Reservation start date on or before (YYYY-MM-DD). */
  dateTo?: string;
  /** Created at or after (ISO 8601). */
  createdFrom?: string;
  /** Created at or before (ISO 8601). */
  createdTo?: string;
  /** Comma-separated status names, case-insensitive, e.g. "Confirmed,Completed". */
  status?: string;
  clientId?: number;
  /** 1-200. Defaults to 50. */
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

export interface PublicV1Payment {
  id: string;
  amount: number;
  currency: string;
  method: string;
  provider: string | null;
  status: string;
  paymentUrl: string | null;
}

export interface PublicV1BookingDetail {
  id: number;
  reservationOrgId: number | null;
  startDate: string;
  endDate: string;
  /** Includes the net total of `saleItems`. */
  totalCost: number | null;
  currency: string;
  statusId: string | null;
  clientId: number | null;
  createdAt: string;
  items: Array<{ groupId: string; groupName: string; quantity: number }>;
  services: Array<{ serviceId: string; serviceName: string; price: number | null }>;
  payments: PublicV1Payment[];
  /** Equipment for sale sold with the booking; empty when nothing was sold or Sales is off. */
  saleItems: PublicV1SaleLine[];
  saleId: string | null;
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
  /** Fuzzy search across name, last name, email and phone. Results come back in `matches`. */
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
  /** Present only when `search` was provided. */
  matches?: PublicV1ClientSummary[];
}

export interface ClientCreateInput {
  name?: string;
  lastName?: string;
  email?: string;
  /** International E.164 format, e.g. +380951234567. */
  phone?: string;
}

export interface ClientCreateResponse {
  client: PublicV1ClientSummary;
  /** False when an existing client matched by email or phone was returned. */
  created: boolean;
}

export interface PublicV1Service {
  id: string;
  name: string;
  price: number | null;
  priceType: string;
  /** When true the client's percentage discount is not applied to this service. */
  excludeFromDiscounts: boolean;
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
  /**
   * Weekly working days and hours in `timezone`. Pickups and returns must fall
   * inside them. An organization without saved settings is always open.
   */
  workingHours: WorkingHours[];
  /**
   * Dates the organization is closed. Pickups and returns cannot fall on them,
   * though a rental may span them. Past one-off holidays are left out.
   */
  holidays: OrgHoliday[];
  supportedDeliveryTypes: Array<'pickup' | 'delivery'>;
  supportedPaymentMethods: PaymentMethod[];
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
  supportedPaymentMethods: PaymentMethod[];
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
  /** 1-500. Defaults to 100. */
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

export interface PublicV1SaleItem {
  id: string;
  name: string;
  sku: string | null;
  /** Null for publishable keys. */
  barcode: string | null;
  categoryId: string | null;
  categoryName: string | null;
  imageUrl: string | null;
  /** Flat price per unit in the org currency. */
  salePrice: number;
  currency: string;
  /** Units on the shelf; can be negative when sales outran the recorded stock. */
  stockOnHand: number;
  /** Net cost per unit; null unless the caller may manage stock. */
  purchaseCost: number | null;
  isArchived: boolean;
}

export interface SaleItemsListParams {
  search?: string;
  /** Category id. */
  category?: string;
  /** Defaults to "active". Publishable keys always get active products. */
  filter?: 'active' | 'archived' | 'all';
  /** 1-100. Defaults to 25. */
  limit?: number;
  cursor?: string;
}

export interface SaleItemsListResponse {
  items: PublicV1SaleItem[];
  nextCursor: string | null;
}

export interface PublicV1SaleItemDetail extends PublicV1SaleItem {
  /** Sales figures are 0 for publishable keys. */
  soldUnits30d: number;
  revenue30d: number;
  soldUnitsTotal: number;
}

export interface SaleItemResponse {
  saleItem: PublicV1SaleItemDetail;
}

export interface PublicV1SaleLine {
  id: string;
  saleItemId: string;
  name: string;
  sku: string | null;
  quantity: number;
  returnedQuantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PublicV1SaleReturn {
  id: string;
  returnedAt: string;
  amount: number;
  note: string | null;
  lines: Array<{ saleLineId: string; quantity: number; restock: boolean; amount: number }>;
}

export interface PublicV1Sale {
  id: string;
  /** Sale number shown in the app. */
  saleOrgId: number | null;
  status: 'completed' | 'cancelled';
  soldAt: string;
  total: number;
  returnedTotal: number;
  /** `total` minus returns. */
  net: number;
  paidAmount: number;
  /** What a standalone sale still owes; 0 for booking sales, which are paid through the booking. */
  balance: number;
  paymentMethod: string | null;
  paidAt: string | null;
  note: string | null;
  currency: string;
  clientId: number | null;
  clientName: string | null;
  /** Set when the goods were sold with a booking. */
  reservationId: number | null;
  reservationOrgId: number | null;
  itemCount: number;
  itemsLabel: string;
}

export interface PublicV1SaleDetail extends PublicV1Sale {
  lines: PublicV1SaleLine[];
  returns: PublicV1SaleReturn[];
  /** The sale's own payments, or the booking's for a booking sale. */
  payments: PublicV1Payment[];
}

export interface SalesListParams {
  kind?: 'standalone' | 'booking';
  status?: 'completed' | 'cancelled';
  /** Only standalone sales that still owe money. */
  unpaid?: boolean;
  clientId?: number;
  /** Sold at or after (ISO 8601). */
  soldFrom?: string;
  /** Sold at or before (ISO 8601). */
  soldTo?: string;
  /** Sale number, client name, email or phone, item name or SKU. */
  search?: string;
  /** 1-100. Defaults to 25. */
  limit?: number;
  cursor?: string;
}

export interface SalesListResponse {
  sales: PublicV1Sale[];
  nextCursor: string | null;
  currency: string;
}

export interface SaleResponse {
  sale: PublicV1SaleDetail;
}

export interface SaleCreateInput {
  lines: SaleLineInput[];
  clientId?: number;
  /** Matched by email, then phone, or created. Ignored when `clientId` is set. */
  client?: {
    name?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  /** Defaults to "payOnPickup". LiqPay needs a client with an email. */
  paymentMethod?: PaymentMethod;
  /** ISO 8601. Defaults to now. */
  soldAt?: string;
  /** Up to 2000 characters. */
  note?: string;
}

export interface PublicV1StockWarning {
  saleItemId: string;
  name: string;
  stockOnHand: number;
  /** Stock after the sale; negative means the shelf count is behind. */
  after: number;
}

export interface SaleCreateResponse {
  sale: PublicV1SaleDetail;
  /** Products the sale took below zero stock. */
  stockWarnings: PublicV1StockWarning[];
  /** The pending charge the sale starts with; `paymentUrl` is set for online methods. */
  payment: PublicV1Payment | null;
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
    /** Units a confirmed return checklist left with the client; empty until a return is confirmed. */
    stillOutUnits: Array<{ itemId: string; sku: string | null }>;
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
