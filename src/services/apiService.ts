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

export function toAppUser(apiUser: ApiUser): User {
  const createdAt = new Date(apiUser.created_at)
  const memberSince = Number.isNaN(createdAt.getTime())
    ? 'Recently'
    : createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return {
    id: apiUser.id,
    email: apiUser.email,
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

  // 🔐 Authentication & Users
  register: (data: { email: string; username: string; password: string }) => request<ApiUser>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) => request<TokenResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  refreshToken: (refresh_token: string) => request<TokenResponse>('/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token }) }),
  logout: () => request('/auth/logout'),
  getProfile: () => request<ApiUser>('/users/me'),
  restoreSession: async (): Promise<ApiUser | null> => {
    const accessToken = getAccessToken()
    const refreshToken = getStoredValue(REFRESH_TOKEN_KEY)

    if (!accessToken && !refreshToken) return null

    try {
      if (accessToken) return await request<ApiUser>('/users/me')

      const tokens = await request<TokenResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
      saveAuthTokens(tokens)
      return await request<ApiUser>('/users/me')
    } catch {
      if (!refreshToken) {
        clearAuthTokens()
        return null
      }

      try {
        const tokens = await request<TokenResponse>('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
        saveAuthTokens(tokens)
        return await request<ApiUser>('/users/me')
      } catch {
        clearAuthTokens()
        return null
      }
    }
  },
  updateProfile: (data: any) => request('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
  updateAccountStatus: (userId: string, active: boolean) => request(`/users/${userId}/status`, { method: 'PATCH', body: JSON.stringify({ active }) }),

  // 📚 Catalog
  getCategories: (params?: any) => request(`/catalog/categories${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  createCategory: (data: any) => request('/catalog/categories', { method: 'POST', body: JSON.stringify(data) }),
  getBrands: (params?: any) => request(`/catalog/brands${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  createBrand: (data: any) => request('/catalog/brands', { method: 'POST', body: JSON.stringify(data) }),

  // 💰 Wallet & Point Holds
  getWallet: () => request('/wallet'),
  getWalletTransactions: (params?: any) => request(`/wallet/transactions${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  reservePoints: (data: any) => request('/wallet/holds', { method: 'POST', body: JSON.stringify(data) }),
  releasePoints: (holdId: string) => request(`/wallet/holds/${holdId}/release`, { method: 'POST' }),
  capturePoints: (holdId: string) => request(`/wallet/holds/${holdId}/capture`, { method: 'POST' }),

  // 🔎 Marketplace Discovery & 📦 Listings
  searchListings: (params?: any) => request(`/listings/search${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  createListing: (data: any) => request('/listings', { method: 'POST', body: JSON.stringify(data) }),
  getListings: (params?: any) => request(`/listings${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  getMyListings: (params?: any) => request(`/listings/mine${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  getListing: (id: string) => request(`/listings/${id}`),
  updateListing: (id: string, data: any) => request(`/listings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteListing: (id: string) => request(`/listings/${id}`, { method: 'DELETE' }),
  publishListing: (id: string) => request(`/listings/${id}/publish`, { method: 'POST' }),
  cancelListing: (id: string) => request(`/listings/${id}/cancel`, { method: 'POST' }),
  uploadPhoto: (id: string, formData: FormData) => {
    const accessToken = getAccessToken()
    return fetch(`${API_BASE_URL}/listings/${id}/photos`, {
      method: 'POST',
      body: formData,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    }).then((r) => r.json())
  },
  getPhotos: (id: string) => request(`/listings/${id}/photos`),
  deletePhoto: (id: string, photoId: string) => request(`/listings/${id}/photos/${photoId}`, { method: 'DELETE' }),
  valueListing: (id: string, questionnaire: any) => request(`/listings/${id}/valuation`, { method: 'POST', body: JSON.stringify(questionnaire) }),

  // 🛒 Orders & 🚚 Fulfillment
  createOrder: (data: any) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: (params?: any) => request(`/orders${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  getOrder: (id: string) => request(`/orders/${id}`),
  cancelOrder: (id: string) => request(`/orders/${id}/cancel`, { method: 'POST' }),
  confirmOrderReceipt: (id: string) => request(`/orders/${id}/confirm-receipt`, { method: 'POST' }),
  createMeetup: (id: string, data: any) => request(`/orders/${id}/meetup`, { method: 'POST', body: JSON.stringify(data) }),
  confirmMeetup: (id: string) => request(`/orders/${id}/meetup/confirm`, { method: 'POST' }),
  cancelMeetup: (id: string) => request(`/orders/${id}/meetup/cancel`, { method: 'POST' }),
  handoverMeetup: (id: string) => request(`/orders/${id}/meetup/handover`, { method: 'POST' }),
  createDelivery: (id: string, data: any) => request(`/orders/${id}/delivery`, { method: 'POST', body: JSON.stringify(data) }),
  deliveryWebhook: (deliveryId: string, data: any) => request(`/orders/delivery/${deliveryId}/webhook`, { method: 'POST', body: JSON.stringify(data) }),

  // 🎁 Donations, ⭐ Reviews & ⚖️ Disputes
  submitDonation: (data: any) => request('/donations', { method: 'POST', body: JSON.stringify(data) }),
  getDonations: (params?: any) => request(`/donations${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  approveDonation: (id: string) => request(`/donations/${id}/approve`, { method: 'POST' }),
  completeDonation: (id: string) => request(`/donations/${id}/complete`, { method: 'POST' }),
  submitReview: (orderId: string, data: any) => request(`/orders/${orderId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  getUserRating: (userId: string) => request(`/users/${userId}/rating`),
  openDispute: (orderId: string, data: any) => request(`/orders/${orderId}/disputes`, { method: 'POST', body: JSON.stringify(data) }),
  resolveDispute: (disputeId: string, data: any) => request(`/disputes/${disputeId}/resolve`, { method: 'POST', body: JSON.stringify(data) }),

  // 📢 Notifications & 👨💼 Admin & 📝 Reports
  getNotifications: (params?: any) => request(`/notifications${params ? '?' + new URLSearchParams(params).toString() : ''}`),
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
  createReport: (data: any) => request('/reports', { method: 'POST', body: JSON.stringify(data) }),
}
