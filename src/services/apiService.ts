import { User } from '../types'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'https://rewear-final-p.onrender.com')

const ACCESS_TOKEN_KEY = 'rewear.accessToken'
const REFRESH_TOKEN_KEY = 'rewear.refreshToken'

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface ApiUser {
  id: string
  email: string
  username: string
  role: string
  is_active: boolean
  created_at: string
  profile?: {
    display_name?: string | null
    city?: string | null
    avatar_url?: string | null
  } | null
}

export interface CatalogItem {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface CatalogItemCreate {
  name: string
  slug: string
}

export interface ApiWallet {
  wallet_id: string
  available_balance: number
  locked_balance: number
  total_balance: number
}

export interface ApiPointTransaction {
  id: string
  points: number
  transaction_type: 'credit' | 'debit' | 'refund' | 'adjustment'
  reference: string
  reason: string
  created_at: string
}

export interface ApiTransactionList {
  items: ApiPointTransaction[]
  total: number
}

export interface ApiHoldResponse {
  id: string
  listing_id: string | null
  points: number
  status: string
  expires_at: string
  idempotency_key: string
}

export interface ApiHoldActionResponse {
  hold: ApiHoldResponse
  available_balance: number
  locked_balance: number
  total_balance: number
}

export interface ApiDiscoveryListing {
  id: string
  title: string
  description: string | null
  category_id: string
  brand_id: string | null
  size: string
  condition: 'like_new' | 'good' | 'fair'
  points_required: number
  location: string | null
  status: string
  seller: { id: string; username: string }
  distance_km: number | null
  created_at: string
  updated_at: string
}

export interface ApiDiscoveryResponse {
  items: ApiDiscoveryListing[]
  total: number
  limit: number
  offset: number
}

export interface ListingCreateRequest {
  title: string
  description?: string | null
  category_id: string
  brand_id?: string | null
  size: string
  condition: 'like_new' | 'good' | 'fair'
  age?: number | null
  defects?: string | null
  location: string
  latitude?: number | null
  longitude?: number | null
  expires_at?: string | null
}

export interface ListingUpdateRequest extends Partial<ListingCreateRequest> {}

export interface ApiListing {
  id: string
  title: string
  description: string | null
  category_id: string
  brand_id: string | null
  size: string
  condition: 'like_new' | 'good' | 'fair'
  age: number | null
  defects: string | null
  location: string | null
  status: string
  created_at: string
  updated_at: string
  expires_at: string | null
}

export interface ApiPhoto {
  id: string
  photo_url: string
  content_type: string
  file_size: number
  sort_order: number
}

export interface ApiValuationResponse {
  points: number
  breakdown: Record<string, number>
}

export interface OrderCreateRequest {
  listing_id: string
  idempotency_key: string
}

export interface ApiOrder {
  id: string
  buyer_id: string
  seller_id: string
  listing_id: string
  points_total: number
  status: string
  idempotency_key: string
  created_at: string
  updated_at: string
}

export interface ApiOrderList {
  items: ApiOrder[]
  total: number
}

export interface MeetupCreateRequest {
  location: string
  scheduled_at: string
  idempotency_key: string
}

export interface ApiMeetup {
  id: string
  order_id: string
  location: string
  scheduled_at: string | null
  status: string
  idempotency_key: string
}

export interface DeliveryCreateRequest {
  address: string
  idempotency_key: string
}

export interface ApiDelivery {
  id: string
  order_id: string
  address: string
  fee: number
  buyer_fee: number
  seller_fee: number
  tracking_number: string | null
  status: string
  idempotency_key: string
}

export interface DeliveryWebhookRequest {
  event_id: string
  status: string
  occurred_at: string
  tracking_number?: string | null
}

export interface DonationCreateRequest {
  title: string
  description: string
  category_id: string
  brand_id?: string | null
  age: number
  condition: 'like_new' | 'good' | 'fair'
  questionnaire: {
    brand?: 'none' | 'standard' | 'premium' | 'luxury'
    stains?: boolean
    tears?: boolean
    fading?: boolean
    zip_condition?: boolean
    buttons?: boolean
    stitching?: boolean
    other_defects?: boolean
  }
  idempotency_key: string
}

export interface ApiDonation {
  id: string
  donor_id: string
  category_id: string
  brand_id: string | null
  title: string
  description: string
  age: number
  condition: string
  reward_points: number | null
  status: string
  idempotency_key: string
  created_at: string
  updated_at: string
}

export interface ReviewCreateRequest {
  rating: number
  comment?: string | null
}

export interface ApiRatingSummary {
  user_id: string
  average_rating: number | null
  review_count: number
}

export interface DisputeCreateRequest {
  reason: string
  evidence_metadata?: Record<string, unknown> | null
}

export interface DisputeResolutionRequest {
  status: string
  resolution: string
  release_points?: boolean
}

export interface ReportCreateRequest {
  listing_id?: string | null
  order_id?: string | null
  reason: string
}

export interface ApiNotification {
  id: string
  notification_type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export function toAppUser(apiUser: ApiUser): User {
  const createdAt = new Date(apiUser.created_at)
  const memberSince = Number.isNaN(createdAt.getTime())
    ? 'Recently'
    : createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return {
    id: apiUser.id,
    email: apiUser.email,
    role: apiUser.role,
    name: apiUser.profile?.display_name || apiUser.username,
    avatar: apiUser.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    location: apiUser.profile?.city || 'Pune, India',
    memberSince,
    rating: 0,
    ratingCount: 0,
    successfulExchanges: 0,
    donationsCompleted: 0,
    itemsListed: 0,
    pointsBalance: 0,
    lockedPoints: 0,
    badges: apiUser.is_active ? ['Verified Member'] : [],
  }
}

function getStoredValue(key: string): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(key)
}

export function saveAuthTokens(tokens: TokenResponse) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
}

export function clearAuthTokens() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

function getAccessToken() {
  return getStoredValue(ACCESS_TOKEN_KEY)
}

function refreshAccessToken(refreshToken: string) {
  return request<TokenResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const accessToken = getAccessToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  }

  try {
    const res = await fetch(url, { ...options, headers })
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.detail || errData.message || `Request failed with status ${res.status}`)
    }
    return await res.json()
  } catch (error) {
    console.warn(`[apiService] ${options.method || 'GET'} ${url} failed:`, error)
    throw error
  }
}

export const apiService = {
  // 🏥 Health Checks
  getHealth: () => request('/health'),
  getReady: () => request('/ready'),
  getRedisHealth: () => request('/health/redis'),
  getHome: () => request('/'),

  // 🔐 Authentication & Users
  startGoogleLogin: () => `${API_BASE_URL}/auth/login`,
  authCallback: (params?: Record<string, string>) => request(`/auth/callback${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  register: (data: { email: string; username: string; password: string }) => request<ApiUser>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) => request<TokenResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (data: { email: string }) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data: { token: string; password: string }) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  refreshToken: refreshAccessToken,
  logout: () => request('/auth/logout'),
  getProfile: () => request<ApiUser>('/users/me'),
  restoreSession: async (): Promise<ApiUser | null> => {
    const accessToken = getAccessToken()
    const refreshToken = getStoredValue(REFRESH_TOKEN_KEY)

    if (!accessToken && !refreshToken) return null

    try {
      if (accessToken) return await request<ApiUser>('/users/me')

      const tokens = await refreshAccessToken(refreshToken!)
      saveAuthTokens(tokens)
      return await request<ApiUser>('/users/me')
    } catch {
      if (!refreshToken) {
        clearAuthTokens()
        return null
      }

      try {
        const tokens = await refreshAccessToken(refreshToken!)
        saveAuthTokens(tokens)
        return await request<ApiUser>('/users/me')
      } catch {
        clearAuthTokens()
        return null
      }
    }
  },
  updateProfile: (data: { display_name?: string; bio?: string; city?: string; avatar_url?: string | null }) => request<ApiUser>('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
  updateAccountStatus: (userId: string, isActive: boolean) => request<ApiUser>(`/users/${userId}/status`, { method: 'PATCH', body: JSON.stringify({ is_active: isActive }) }),

  // 📚 Catalog
  getCategories: (params?: { limit?: number; offset?: number }) => request<CatalogItem[]>(`/catalog/categories${params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''}`),
  createCategory: (data: CatalogItemCreate) => request<CatalogItem>('/catalog/categories', { method: 'POST', body: JSON.stringify(data) }),
  getBrands: (params?: { limit?: number; offset?: number }) => request<CatalogItem[]>(`/catalog/brands${params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''}`),
  createBrand: (data: CatalogItemCreate) => request<CatalogItem>('/catalog/brands', { method: 'POST', body: JSON.stringify(data) }),

  // 💰 Wallet & Point Holds
  getWallet: () => request<ApiWallet>('/wallet'),
  getWalletTransactions: (params?: { limit?: number; offset?: number }) => request<ApiTransactionList>(`/wallet/transactions${params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''}`),
  reservePoints: (data: { listing_id: string; idempotency_key: string; expires_in_seconds?: number }) => request<ApiHoldActionResponse>('/wallet/holds', { method: 'POST', body: JSON.stringify(data) }),
  releasePoints: (holdId: string) => request<ApiHoldActionResponse>(`/wallet/holds/${holdId}/release`, { method: 'POST' }),
  capturePoints: (holdId: string) => request<ApiHoldActionResponse>(`/wallet/holds/${holdId}/capture`, { method: 'POST' }),

  // 🔎 Marketplace Discovery & 📦 Listings
  searchListings: (params?: Record<string, string | number>) => request<ApiDiscoveryResponse>(`/listings/search${params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''}`),
  createListing: (data: ListingCreateRequest) => request<ApiListing>('/listings', { method: 'POST', body: JSON.stringify(data) }),
  getListings: (params?: { status?: string; limit?: number; offset?: number }) => request<ApiListing[]>(`/listings${params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''}`),
  getMyListings: (params?: { limit?: number; offset?: number }) => request<ApiListing[]>(`/listings/mine${params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''}`),
  getListing: (id: string) => request<ApiListing>(`/listings/${id}`),
  updateListing: (id: string, data: ListingUpdateRequest) => request<ApiListing>(`/listings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteListing: (id: string) => request<void>(`/listings/${id}`, { method: 'DELETE' }),
  publishListing: (id: string) => request<{ status: string }>(`/listings/${id}/publish`, { method: 'POST' }),
  cancelListing: (id: string) => request<{ status: string }>(`/listings/${id}/cancel`, { method: 'POST' }),
  uploadPhoto: (id: string, formData: FormData) => {
    const accessToken = getAccessToken()
    return fetch(`${API_BASE_URL}/listings/${id}/photos`, {
      method: 'POST',
      body: formData,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    }).then((r) => r.json())
  },
  getPhotos: (id: string) => request<ApiPhoto[]>(`/listings/${id}/photos`),
  deletePhoto: (id: string, photoId: string) => request<void>(`/listings/${id}/photos/${photoId}`, { method: 'DELETE' }),
  valueListing: (id: string, questionnaire: Record<string, unknown>) => request<ApiValuationResponse>(`/listings/${id}/valuation`, { method: 'POST', body: JSON.stringify(questionnaire) }),

  // 🛒 Orders & 🚚 Fulfillment
  createOrder: (data: OrderCreateRequest) => request<ApiOrder>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: (params?: { limit?: number; offset?: number }) => request<ApiOrderList>(`/orders${params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''}`),
  getOrder: (id: string) => request<ApiOrder>(`/orders/${id}`),
  cancelOrder: (id: string) => request<ApiOrder>(`/orders/${id}/cancel`, { method: 'POST' }),
  confirmOrderReceipt: (id: string) => request<ApiOrder>(`/orders/${id}/confirm-receipt`, { method: 'POST' }),
  createMeetup: (id: string, data: MeetupCreateRequest) => request<ApiMeetup>(`/orders/${id}/meetup`, { method: 'POST', body: JSON.stringify(data) }),
  confirmMeetup: (id: string) => request<ApiMeetup>(`/orders/${id}/meetup/confirm`, { method: 'POST' }),
  cancelMeetup: (id: string) => request<ApiMeetup>(`/orders/${id}/meetup/cancel`, { method: 'POST' }),
  handoverMeetup: (id: string) => request<ApiMeetup>(`/orders/${id}/meetup/handover`, { method: 'POST' }),
  createDelivery: (id: string, data: DeliveryCreateRequest) => request<ApiDelivery>(`/orders/${id}/delivery`, { method: 'POST', body: JSON.stringify(data) }),
  deliveryWebhook: (deliveryId: string, data: DeliveryWebhookRequest) => request<ApiDelivery>(`/orders/delivery/${deliveryId}/webhook`, { method: 'POST', body: JSON.stringify(data) }),

  // 🎁 Donations, ⭐ Reviews & ⚖️ Disputes
  submitDonation: (data: DonationCreateRequest) => request<ApiDonation>('/donations', { method: 'POST', body: JSON.stringify(data) }),
  getDonations: (params?: { limit?: number; offset?: number }) => request<ApiDonation[]>(`/donations${params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''}`),
  approveDonation: (id: string) => request<ApiDonation>(`/donations/${id}/approve`, { method: 'POST' }),
  completeDonation: (id: string) => request<ApiDonation>(`/donations/${id}/complete`, { method: 'POST' }),
  submitReview: (orderId: string, data: ReviewCreateRequest) => request(`/orders/${orderId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  getUserRating: (userId: string) => request<ApiRatingSummary>(`/users/${userId}/rating`),
  openDispute: (orderId: string, data: DisputeCreateRequest) => request(`/orders/${orderId}/disputes`, { method: 'POST', body: JSON.stringify(data) }),
  resolveDispute: (disputeId: string, data: DisputeResolutionRequest) => request(`/disputes/${disputeId}/resolve`, { method: 'POST', body: JSON.stringify(data) }),

  // 📢 Notifications & 👨💼 Admin & 📝 Reports
  getNotifications: (params?: { unread_only?: boolean; limit?: number }) => request<ApiNotification[]>(`/notifications${params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''}`),
  markNotificationRead: (id: string) => request(`/notifications/${id}/read`, { method: 'POST' }),
  getAdminDashboard: () => request('/admin/dashboard'),
  getAdminUsers: (params?: any) => request(`/admin/users${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  updateAdminUser: (id: string, data: any) => request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminListings: (params?: any) => request(`/admin/listings${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  moderateAdminListing: (id: string, data: any) => request(`/admin/listings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminDisputes: (params?: any) => request(`/admin/disputes${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  updateAdminDispute: (id: string, data: any) => request(`/admin/disputes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  createAdminCategory: (data: any) => request('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminCategory: (id: string, data: any) => request(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAdminCategory: (id: string) => request(`/admin/categories/${id}`, { method: 'DELETE' }),
  createAdminBrand: (data: any) => request('/admin/brands', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminBrand: (id: string, data: any) => request(`/admin/brands/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAdminBrand: (id: string) => request(`/admin/brands/${id}`, { method: 'DELETE' }),
  getAdminReports: (params?: any) => request(`/admin/reports${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  updateAdminReport: (id: string, data: any) => request(`/admin/reports/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminAuditLogs: (params?: any) => request(`/admin/audit-logs${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  createReport: (data: ReportCreateRequest) => request('/reports', { method: 'POST', body: JSON.stringify(data) }),
}
