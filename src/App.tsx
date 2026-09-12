import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  User,
  Product,
  Order,
  WalletTransaction,
  NotificationItem,
} from './types'

import { Navbar } from './components/Navbar'
import { MobileNav } from './components/MobileNav'
import { LandingPage } from './components/LandingPage'
import { DiscoverPage } from './components/DiscoverPage'
import { ItemDetailModal } from './components/ItemDetailModal'
import { SellCashifyFlow } from './components/SellCashifyFlow'
import { DonateFlow } from './components/DonateFlow'
import { ExchangeModal } from './components/ExchangeModal'
import { OrdersPage } from './components/OrdersPage'
import { WalletPage } from './components/WalletPage'
import { ProfilePage } from './components/ProfilePage'
import { FavoritesPage } from './components/FavoritesPage'
import { MessagesPage } from './components/MessagesPage'
import { HelpPage } from './components/HelpPage'
import { DisputeModal } from './components/DisputeModal'
import { NotificationsDrawer } from './components/NotificationsDrawer'
import { ChatModal } from './components/ChatModal'
import { AdminPage } from './components/AdminPage'

import { AuthPage } from './components/auth/AuthPage'
import { CheckCircle2 } from 'lucide-react'

import {
  apiService,
  clearAuthTokens,
  toApiMediaUrl,
  toAppUser,
} from './services/apiService'

const EMPTY_USER: User = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  location: '',
  memberSince: '',
  rating: 0,
  ratingCount: 0,
  successfulExchanges: 0,
  donationsCompleted: 0,
  itemsListed: 0,
  pointsBalance: 0,
  lockedPoints: 0,
  badges: [],
}

function responseItems<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[]

  if (
    response &&
    typeof response === 'object' &&
    ('items' in response ||
      'data' in response ||
      'orders' in response ||
      'transactions' in response ||
      'notifications' in response)
  ) {
    const payload = response as Record<string, unknown>
    const items =
      payload.items ??
      payload.data ??
      payload.orders ??
      payload.transactions ??
      payload.notifications

    return Array.isArray(items) ? (items as T[]) : []
  }

  return []
}

function toUiProduct(value: unknown): Product {
  const listing = (value || {}) as Record<string, unknown>
  const listingId = typeof listing.id === 'string' ? listing.id : ''
  const numericId = Number.parseInt(listingId.replace(/[^0-9]/g, '').slice(0, 8) || '0', 10)
  const rawCondition = typeof listing.condition === 'string' ? listing.condition : 'fair'
  const condition: Product['condition'] = rawCondition === 'like_new'
    ? 'Like New'
    : rawCondition === 'good'
      ? 'Good'
      : 'Well Worn'
  const rawStatus = typeof listing.status === 'string' ? listing.status.toLowerCase() : 'draft'
  const status: Product['status'] = rawStatus === 'active'
    ? 'active'
    : rawStatus === 'reserved'
      ? 'reserved'
      : rawStatus === 'completed'
        ? 'completed'
        : 'expired'

  return {
    id: numericId,
    backendListingId: listingId,
    title: typeof listing.title === 'string' ? listing.title : 'Untitled listing',
    brand: typeof listing.brand_id === 'string' ? listing.brand_id : 'Local Brand',
    category: typeof listing.category_id === 'string' ? listing.category_id : 'Clothing',
    size: typeof listing.size === 'string' ? listing.size : 'N/A',
    gender: 'Unisex',
    condition,
    defects: typeof listing.defects === 'string' && listing.defects ? listing.defects.split(', ') : [],
    points: typeof listing.points_required === 'number' ? listing.points_required : 0,
    distance: 'Distance unavailable',
    distanceKm: 999,
    seller: {
      id: typeof (listing.seller as Record<string, unknown> | undefined)?.id === 'string' ? (listing.seller as Record<string, string>).id : '',
      name: typeof (listing.seller as Record<string, unknown> | undefined)?.username === 'string' ? (listing.seller as Record<string, string>).username : 'You',
      avatar: '',
      rating: 0,
      location: typeof listing.location === 'string' ? listing.location : 'Location unavailable',
      exchangesCount: 0,
      joinedDate: 'Recently',
    },
    images: [],
    description: typeof listing.description === 'string' ? listing.description : '',
    pickupType: 'both',
    createdAt: typeof listing.created_at === 'string' ? listing.created_at : new Date().toISOString(),
    status,
  }
}

const valuationCategoryByName: Record<string, string> = {
  jackets: 'outerwear', 't-shirts': 'tops', shirts: 'tops', tops: 'tops',
  dresses: 'dresses', jeans: 'bottoms', trousers: 'bottoms', shoes: 'shoes',
  hoodies: 'tops', 'ethnic wear': 'other', accessories: 'accessories',
}

const valuationBrandByName: Record<string, string> = {
  nike: 'premium', adidas: 'premium', puma: 'premium', levis: 'premium',
  zara: 'standard', 'h&m': 'standard', uniqlo: 'standard', mango: 'standard',
}

async function hydrateListingProduct(
  value: unknown,
  categories: Array<{ id: string; name: string }>,
  brands: Array<{ id: string; name: string }>
): Promise<Product> {
  const raw = (value || {}) as Record<string, unknown>
  const product = toUiProduct(value)
  const listingId = product.backendListingId

  if (!listingId) return product

  const [photosResult, valuationResult] = await Promise.allSettled([
    apiService.getPhotos(listingId),
    (async () => {
      const categoryName = categories.find((item) => item.id === raw.category_id)?.name?.toLowerCase() || ''
      const brandName = brands.find((item) => item.id === raw.brand_id)?.name?.toLowerCase() || ''
      const rawCondition = typeof raw.condition === 'string' ? raw.condition : 'fair'
      return apiService.valueListing(listingId, {
        category: valuationCategoryByName[categoryName] || 'other',
        brand: valuationBrandByName[brandName] || 'none',
        age: typeof raw.age === 'number' ? raw.age : 0,
        condition: rawCondition === 'like_new' ? 'like_new' : rawCondition === 'good' ? 'good' : 'fair',
        stains: typeof raw.defects === 'string' && raw.defects.toLowerCase().includes('stain'),
        tears: typeof raw.defects === 'string' && raw.defects.toLowerCase().includes('tear'),
        fading: typeof raw.defects === 'string' && raw.defects.toLowerCase().includes('fading'),
        zip_condition: !(typeof raw.defects === 'string' && raw.defects.toLowerCase().includes('zipper')),
        buttons: !(typeof raw.defects === 'string' && raw.defects.toLowerCase().includes('button')),
        stitching: !(typeof raw.defects === 'string' && raw.defects.toLowerCase().includes('stitch')),
        other_defects: Boolean(raw.defects),
      })
    })(),
  ])

  const images = photosResult.status === 'fulfilled'
    ? photosResult.value
        .sort((left, right) => left.sort_order - right.sort_order)
        .map((photo) => toApiMediaUrl(photo.photo_url))
    : []
  const points = valuationResult.status === 'fulfilled' && typeof valuationResult.value.points === 'number'
    ? valuationResult.value.points
    : product.points

  return {
    ...product,
    points,
    images,
  }
}

function toUiOrder(value: unknown): Order {
  const order = (value || {}) as Record<string, unknown>
  const rawStatus = typeof order.status === 'string' ? order.status.toLowerCase() : 'pending'
  const status: Order['status'] = rawStatus.includes('cancel')
    ? 'cancelled'
    : rawStatus.includes('complete') || rawStatus.includes('delivered')
      ? 'completed'
      : 'active'
  const listingId = typeof order.listing_id === 'string' ? order.listing_id : ''
  const orderId = typeof order.id === 'string' ? order.id : listingId
  const points = typeof order.points_total === 'number' ? order.points_total : 0
  const stageIndex = status === 'completed' ? 5 : status === 'cancelled' ? 0 : 1

  return {
    id: orderId,
    backendOrderId: orderId,
    product: {
      id: 0,
      backendListingId: listingId,
      title: `Listing ${listingId.slice(0, 8)}`,
      brand: 'Catalog item',
      category: 'Clothing',
      size: 'N/A',
      gender: 'Unisex',
      condition: 'Good',
      defects: [],
      points,
      distance: 'Distance unavailable',
      distanceKm: 999,
      seller: {
        id: typeof order.seller_id === 'string' ? order.seller_id : '',
        name: 'ReWear member',
        avatar: '',
        rating: 0,
        location: 'Location unavailable',
        exchangesCount: 0,
        joinedDate: 'Recently',
      },
      images: [],
      description: 'Order details loaded from ReWear.',
      pickupType: 'both',
      createdAt: typeof order.created_at === 'string' ? order.created_at : new Date().toISOString(),
      status: 'active',
    },
    type: 'delivery',
    points,
    counterparty: {
      id: typeof order.seller_id === 'string' ? order.seller_id : undefined,
      name: 'ReWear member',
      avatar: '',
      role: 'seller',
      rating: 0,
      phone: '',
    },
    status,
    stage: status === 'completed' ? 'Completed' : status === 'cancelled' ? 'Exchange Requested' : 'Points Locked',
    stageIndex,
    createdAt: typeof order.created_at === 'string' ? order.created_at : 'Recently',
  }
}

export const App: React.FC = () => {
  const [view, setView] = useState<View>('login')

  const [user, setUser] = useState<User>(EMPTY_USER)

  const [isAuthenticated, setIsAuthenticated] =
    useState(false)

  const [authReady, setAuthReady] =
    useState(false)

  const [products, setProducts] =
    useState<Product[]>([])

  const [orders, setOrders] =
    useState<Order[]>([])

  const [transactions, setTransactions] =
    useState<WalletTransaction[]>([])

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([])

  const [favorites, setFavorites] =
    useState<number[]>([])

  // =========================
  // Modal State
  // =========================

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  const [selectedPhotoIds, setSelectedPhotoIds] =
    useState<string[]>([])

  const detailRequestId = useRef(0)

  const [productToExchange, setProductToExchange] =
    useState<Product | null>(null)

  const [itemForDispute, setItemForDispute] =
    useState<Order | Product | null>(null)

  const [showNotifications, setShowNotifications] =
    useState(false)

  const [showChat, setShowChat] =
    useState(false)

  const [toast, setToast] =
    useState<string | null>(null)

  // =========================
  // Toast
  // =========================

  const showToast = (msg: string) => {
    setToast(msg)

    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  // =========================
  // Restore Login Session
  // =========================

  useEffect(() => {
    let isMounted = true

    apiService
      .restoreSession()
      .then((apiUser) => {
        if (!isMounted || !apiUser) {
          return
        }

        setUser(toAppUser(apiUser))
        setIsAuthenticated(true)
        setView('browse')
      })
      .finally(() => {
        if (isMounted) {
          setAuthReady(true)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    let isMounted = true

    Promise.allSettled([
      apiService.getOrders({ limit: 100 }),
      apiService.getWallet(),
      apiService.getWalletTransactions({ limit: 100 }),
      apiService.getNotifications({ limit: 100 }),
      apiService.getMyListings({ limit: 100 }),
    ]).then(([ordersResult, walletResult, transactionsResult, notificationsResult, listingsResult]) => {
      if (!isMounted) return

      if (ordersResult.status === 'fulfilled') {
        setOrders(responseItems<unknown>(ordersResult.value).map(toUiOrder))
      }

      if (walletResult.status === 'fulfilled') {
        const wallet = walletResult.value as Record<string, unknown>
        const pointsBalance = wallet.total_balance
        const lockedPoints = wallet.locked_balance

        setUser((previous) => ({
          ...previous,
          ...(typeof pointsBalance === 'number'
            ? { pointsBalance }
            : {}),
          ...(typeof lockedPoints === 'number'
            ? { lockedPoints }
            : {}),
        }))
      }

      if (transactionsResult.status === 'fulfilled') {
        setTransactions(
          responseItems<WalletTransaction>(
            transactionsResult.value
          )
        )
      }

      if (notificationsResult.status === 'fulfilled') {
        setNotifications(
          responseItems<NotificationItem>(
            notificationsResult.value
          )
        )
      }

      if (listingsResult.status === 'fulfilled') {
        const listingItems = responseItems<unknown>(listingsResult.value)
        Promise.all([
          apiService.getCategories({ limit: 200 }),
          apiService.getBrands({ limit: 200 }),
        ]).then(async ([categories, brands]) => {
          const hydratedProducts = await Promise.all(
            listingItems.map((item) => hydrateListingProduct(item, categories, brands))
          )
          if (!isMounted) return
          setProducts(hydratedProducts)
          setUser((previous) => ({
            ...previous,
            itemsListed: hydratedProducts.length,
          }))
        }).catch(() => {
          if (!isMounted) return
          setProducts(listingItems.map(toUiProduct))
          setUser((previous) => ({ ...previous, itemsListed: listingItems.length }))
        })
      }
    })

    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  const refreshBackendState = async () => {
    const [ordersResult, walletResult, transactionsResult] = await Promise.all([
      apiService.getOrders({ limit: 100 }),
      apiService.getWallet(),
      apiService.getWalletTransactions({ limit: 100 }),
    ])

    setOrders(responseItems<unknown>(ordersResult).map(toUiOrder))

    const wallet = walletResult as Record<string, unknown>
    setUser((previous) => ({
      ...previous,
      pointsBalance: typeof wallet.total_balance === 'number' ? wallet.total_balance : previous.pointsBalance,
      lockedPoints: typeof wallet.locked_balance === 'number' ? wallet.locked_balance : previous.lockedPoints,
    }))

    setTransactions(responseItems<WalletTransaction>(transactionsResult))
  }

  // =========================
  // Sign Out
  // =========================

  const handleSignOut = async () => {
    try {
      await apiService.logout()
    } catch {
      // Always clear local credentials
      // even if backend logout fails.
    } finally {
      clearAuthTokens()
      setIsAuthenticated(false)
      setView('login')
    }
  }

  const handleSelectProduct = async (product: Product) => {
    const requestId = detailRequestId.current + 1
    detailRequestId.current = requestId
    setSelectedProduct(product)
    setSelectedPhotoIds([])

    if (!product.backendListingId) return

    try {
      const [listingResult, photosResult] = await Promise.allSettled([
        apiService.getListing(product.backendListingId),
        apiService.getPhotos(product.backendListingId),
      ])

      if (requestId !== detailRequestId.current) return

      const listing = listingResult.status === 'fulfilled'
        ? listingResult.value as Record<string, unknown>
        : {}
      const seller = listing.seller as Record<string, unknown> | undefined
      const sellerId = typeof seller?.id === 'string' ? seller.id : undefined
      const ratingResponse = sellerId
        ? await apiService.getUserRating(sellerId)
        : null

      const photoItems = photosResult.status === 'fulfilled'
        ? responseItems<Record<string, unknown>>(photosResult.value)
        : []
      const photoIds = photoItems
        .map((photo) =>
          typeof photo.id === 'string' ? photo.id : null
        )
        .filter((id): id is string => Boolean(id))
      const photos = photoItems
        .map((photo) =>
          typeof photo.photo_url === 'string' ? toApiMediaUrl(photo.photo_url) : null
        )
        .filter((url): url is string => Boolean(url))

      if (photos.length > 0) setSelectedPhotoIds(photoIds)

      setSelectedProduct((current) => {
        if (
          !current ||
          current.backendListingId !== product.backendListingId
        ) {
          return current
        }

        return {
          ...current,
          description:
            typeof listing.description === 'string'
              ? listing.description
              : current.description,
          images: photos.length > 0 ? photos : current.images,
          seller: {
            ...current.seller,
            location:
              typeof listing.location === 'string' && listing.location.trim()
                ? listing.location
                : current.seller.location,
            rating: ratingResponse && typeof ratingResponse.average_rating === 'number'
              ? ratingResponse.average_rating
              : current.seller.rating,
            exchangesCount: ratingResponse && typeof ratingResponse.review_count === 'number'
              ? ratingResponse.review_count
              : current.seller.exchangesCount,
          },
        }
      })
    } catch {
      // Keep the card data if the detail request fails.
    }
  }

  // =========================
  // Favorites
  // =========================

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const exists = prev.includes(id)

      showToast(
        exists
          ? 'Removed from saved favorites'
          : 'Saved to favorites ❤️'
      )

      return exists
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    })
  }

  // =========================
  // Complete Listing
  // =========================

  const handleCompleteListing = async (
    newProduct: Product
  ) => {
    const listings = await apiService.getMyListings({ limit: 100 })
    const listingItems = responseItems<unknown>(listings)
    const backendProducts = listingItems.map(toUiProduct)
    const publishedProduct = newProduct.backendListingId
      ? {
          ...newProduct,
          id: Number.parseInt(newProduct.backendListingId.replace(/[^0-9]/g, '').slice(0, 8) || '0', 10),
        }
      : newProduct
    const publishedId = publishedProduct.backendListingId
    const mergedProducts = backendProducts.map((product) => {
      if (!publishedId || product.backendListingId !== publishedId) return product
      return {
        ...publishedProduct,
        ...product,
        points: product.points || publishedProduct.points,
        images: product.images.length > 0 ? product.images : publishedProduct.images,
      }
    })
    if (publishedId && !mergedProducts.some((product) => product.backendListingId === publishedId)) {
      mergedProducts.unshift(publishedProduct)
    }
    setProducts(mergedProducts)
    setUser((prev) => ({ ...prev, itemsListed: listingItems.length }))

    showToast(`Listing published for ${newProduct.points} ReWear Points.`)

    setView('browse')
  }

  // =========================
  // Confirm Exchange
  // =========================

  const handleConfirmExchange = async (
    product: Product,
    exchangeType: 'meetup' | 'delivery'
  ) => {
    const pointsCost = product.points

    if (!product.backendListingId) {
      showToast('This listing is not available for exchange yet.')
      return
    }

    try {
      await apiService.createOrder({
        listing_id: product.backendListingId,
        idempotency_key: crypto.randomUUID(),
      })
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Unable to create exchange order.'
      )
      return
    }

    await refreshBackendState()

    setProductToExchange(null)
    setSelectedProduct(null)

    showToast(`Exchange requested for ${pointsCost} points.`)

    setView('orders')
  }

  // =========================
  // Update Order Stage
  // =========================

  const handleUpdateOrderStage = async (
    orderId: string,
    nextStageIndex: number
  ): Promise<void> => {
    const order = orders.find(
      (item) => item.id === orderId
    )

    if (
      nextStageIndex === 3 &&
      order
    ) {
      try {
        await apiService.confirmOrderReceipt(
          order.backendOrderId || order.id
        )
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : 'Unable to confirm item receipt.'
        )
        return
      }
    }

    await refreshBackendState()
    showToast('Receipt confirmed. Order status refreshed.')
  }

  // =========================
  // Cancel Order
  // =========================

  const handleCancelOrder = async (
    orderId: string
  ) => {
    try {
      const order = orders.find(
        (ord) =>
          ord.id === orderId
      )

      if (order) {
        await apiService.cancelOrder(
          order.backendOrderId || order.id
        )
      }

      await refreshBackendState()

      showToast(
        'Order cancelled successfully.'
      )
    } catch (error) {
      console.error(
        'Failed to cancel order:',
        error
      )

      showToast(
        'Unable to cancel order. Please try again.'
      )
    }
  }

  // =========================
  // Mark Notification Read
  // =========================

  const handleMarkNotificationRead = async (
    notificationId: string
  ) => {
    try {
      await apiService.markNotificationRead(
        notificationId
      )
    } catch (error) {
      console.warn(
        'Failed to mark notification as read on backend:',
        error
      )
    }

    // Update UI regardless of backend
    // result so notification immediately
    // appears as read.
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id ===
        notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    )
  }

  // =========================
  // Unread Notifications
  // =========================

  const unreadNotifsCount =
    notifications.filter(
      (n) => !n.read
    ).length

  // =========================
  // Auth Loading
  // =========================

  if (!authReady) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#162E33',
          color: '#fff',
        }}
      >
        Restoring your session…
      </div>
    )
  }

  // =========================
  // Login
  // =========================

  if (
    !isAuthenticated ||
    view === 'login'
  ) {
    return (
      <AuthPage
        initialMode="login"
        onSuccess={(u) => {
          setUser(u)

          setIsAuthenticated(true)

          showToast(
            `Welcome back, ${u.name}! Signed in successfully 🎉`
          )

          setView('browse')
        }}
      />
    )
  }

  // =========================
  // Main Application
  // =========================

  return (
    <div className="app-shell">

      {/* =========================
          Navbar
      ========================= */}

      <Navbar
        currentView={view}
        setView={setView}
        user={user}
        unreadNotifsCount={
          unreadNotifsCount
        }
        onOpenNotifs={() =>
          setShowNotifications(true)
        }
        onOpenChat={() =>
          setView('messages')
        }
      />

      {/* =========================
          Main Content
      ========================= */}

      <main
        style={{
          flex: 1,
        }}
      >

        {/* Landing */}

        {view === 'landing' && (
          <LandingPage
            setView={setView}
            featuredProducts={
              products
            }
            onSelectProduct={(p) =>
              void handleSelectProduct(p)
            }
            favorites={favorites}
            onToggleFavorite={
              handleToggleFavorite
            }
          />
        )}

        {/* Browse / Home */}

        {(view === 'home' ||
          view === 'browse') && (
          <DiscoverPage
            products={products}
            user={user}
            onSelectProduct={(p) =>
              void handleSelectProduct(p)
            }
            favorites={favorites}
            onToggleFavorite={
              handleToggleFavorite
            }
            onOpenSell={() =>
              setView('sell')
            }
            onOpenDonate={() =>
              setView('donate')
            }
          />
        )}

        {/* Sell */}

        {view === 'sell' && (
          <SellCashifyFlow
            user={user}
            onCompleteListing={
              handleCompleteListing
            }
            onCancel={() =>
              setView('browse')
            }
          />
        )}

        {/* Donate */}

        {view === 'donate' && (
          <DonateFlow
            user={user}
            onCompleteDonation={async () => {
              await refreshBackendState()
              setUser((prev) => ({ ...prev, donationsCompleted: prev.donationsCompleted + 1 }))
              showToast('Donation registered. Wallet refreshed.')
              setView('wallet')
            }}
            onCancel={() =>
              setView('browse')
            }
          />
        )}

        {/* Orders */}

        {view === 'orders' && (
          <OrdersPage
            orders={orders}

            onUpdateStage={
              handleUpdateOrderStage
            }

            onCancelOrder={
              handleCancelOrder
            }

            onOpenDispute={(ord) =>
              setItemForDispute(ord)
            }
            onConfirmMeetup={async (order, location) => {
              try {
                const scheduledAt = new Date()
                scheduledAt.setDate(scheduledAt.getDate() + 1)
                scheduledAt.setHours(17, 30, 0, 0)

                await apiService.createMeetup(
                  order.backendOrderId || order.id,
                  {
                    location,
                    scheduled_at: scheduledAt.toISOString(),
                    idempotency_key: crypto.randomUUID(),
                  }
                )
                await apiService.confirmMeetup(
                  order.backendOrderId || order.id
                )
                await refreshBackendState()
                showToast('Meetup confirmed successfully.')
              } catch (error) {
                showToast(error instanceof Error ? error.message : 'Unable to save meetup details.')
              }
            }}
            onHandoverMeetup={async (order) => {
              try {
                await apiService.handoverMeetup(order.backendOrderId || order.id)
                await refreshBackendState()
                showToast('Meetup handover updated successfully.')
              } catch (error) {
                showToast(error instanceof Error ? error.message : 'Unable to update meetup handover.')
              }
            }}
            onCancelMeetup={async (order) => {
              if (!window.confirm('Cancel this meetup arrangement?')) return
              try {
                await apiService.cancelMeetup(order.backendOrderId || order.id)
                await refreshBackendState()
                showToast('Meetup cancelled successfully.')
              } catch (error) {
                showToast(error instanceof Error ? error.message : 'Unable to cancel meetup.')
              }
            }}
            onSubmitReview={async (order, rating, comment) => {
              try {
                await apiService.submitReview(
                  order.backendOrderId || order.id,
                  { rating, comment: comment || null }
                )
                showToast('Review submitted successfully.')
              } catch (error) {
                showToast(error instanceof Error ? error.message : 'Unable to submit review.')
              }
            }}
            onRefreshOrder={async (order) => {
              const orderId =
                order.backendOrderId || order.id
              const detail = (await apiService.getOrder(
                orderId
              )) as Partial<Order>

              setOrders((previous) =>
                previous.map((item) =>
                  item.id === order.id
                    ? { ...item, ...detail }
                    : item
                )
              )

              showToast('Order details refreshed.')
            }}
          />
        )}

        {/* Wallet */}

        {view === 'wallet' && (
          <WalletPage
            user={user}
            transactions={
              transactions
            }
            onOpenSell={() =>
              setView('sell')
            }
            onOpenDonate={() =>
              setView('donate')
            }
          />
        )}

        {/* Favorites */}

        {view === 'favorites' && (
          <FavoritesPage
            products={products}
            favorites={favorites}
            onToggleFavorite={
              handleToggleFavorite
            }
            onSelectProduct={(p) =>
              void handleSelectProduct(p)
            }
            onOpenBrowse={() =>
              setView('browse')
            }
          />
        )}

        {/* Messages */}

        {view === 'messages' && (
          <MessagesPage
            user={user}
            onShowToast={
              showToast
            }
          />
        )}

        {/* Help */}

        {view === 'help' && (
          <HelpPage
            onOpenDispute={() =>
              setItemForDispute(
                products[0]
              )
            }
            onShowToast={
              showToast
            }
          />
        )}

        {view === 'admin' && (
          <AdminPage
            user={user}
            onBack={() => setView('browse')}
          />
        )}

        {/* Profile */}

        {view === 'profile' && (
          <ProfilePage
            user={user}
            products={products}
            favorites={favorites}
            onToggleFavorite={
              handleToggleFavorite
            }
            onSelectProduct={(p) =>
              void handleSelectProduct(p)
            }
            onSignOut={
              handleSignOut
            }
            onUpdateProfile={(
              updated
            ) => {
              setUser(updated)

              showToast(
                'Profile updated successfully! ✨'
              )
            }}
            onUpdateListing={async (product, data) => {
              if (!product.backendListingId) return

              await apiService.updateListing(
                product.backendListingId,
                data
              )

              setProducts((previous) =>
                previous.map((item) =>
                  item.backendListingId === product.backendListingId
                    ? { ...item, ...data }
                    : item
                )
              )

              showToast('Listing updated successfully!')
            }}
            onPublishListing={async (product) => {
              if (!product.backendListingId) return

              await apiService.publishListing(
                product.backendListingId
              )

              setProducts((previous) =>
                previous.map((item) =>
                  item.backendListingId === product.backendListingId
                    ? { ...item, status: 'active' }
                    : item
                )
              )

              showToast('Listing published successfully!')
            }}
            onCancelListing={async (product) => {
              if (!product.backendListingId) return
              if (!window.confirm(`Cancel "${product.title}"?`)) return

              await apiService.cancelListing(
                product.backendListingId
              )

              setProducts((previous) =>
                previous.map((item) =>
                  item.backendListingId === product.backendListingId
                    ? { ...item, status: 'expired' }
                    : item
                )
              )

              showToast('Listing cancelled successfully.')
            }}
            onDeleteListing={async (product) => {
              if (!product.backendListingId) return
              if (!window.confirm(`Delete "${product.title}"?`)) return

              await apiService.deleteListing(
                product.backendListingId
              )

              setProducts((previous) =>
                previous.filter(
                  (item) =>
                    item.backendListingId !==
                    product.backendListingId
                )
              )

              setUser((previous) => ({
                ...previous,
                itemsListed: Math.max(
                  0,
                  previous.itemsListed - 1
                ),
              }))

              showToast('Listing deleted successfully.')
            }}
          />
        )}

      </main>

      {/* =========================
          Mobile Navigation
      ========================= */}

      <MobileNav
        currentView={view}
        setView={setView}
        user={user}
      />

      {/* =========================
          Item Detail Modal
      ========================= */}

      {selectedProduct && (
        <ItemDetailModal
          product={
            selectedProduct
          }
          user={user}
          isOwner={selectedProduct.seller.id === user.id}
          onClose={() =>
            setSelectedProduct(null)
          }
          isFavorite={favorites.includes(
            selectedProduct.id
          )}
          photoIds={selectedPhotoIds}
          onDeletePhoto={async (photoId) => {
            if (!selectedProduct.backendListingId) return

            await apiService.deletePhoto(
              selectedProduct.backendListingId,
              photoId
            )

            const photoIndex = selectedPhotoIds.indexOf(photoId)
            setSelectedPhotoIds((previous) =>
              previous.filter((id) => id !== photoId)
            )
            setSelectedProduct((current) =>
              current
                ? {
                    ...current,
                    images: current.images.filter(
                      (_, index) => index !== photoIndex
                    ),
                  }
                : current
            )
            showToast('Photo deleted successfully.')
          }}
          onToggleFavorite={
            handleToggleFavorite
          }
          onInitiateExchange={(p) =>
            setProductToExchange(p)
          }
          onReportListing={(p) =>
            setItemForDispute(p)
          }
        />
      )}

      {/* =========================
          Exchange Checkout Modal
      ========================= */}

      {productToExchange && (
        <ExchangeModal
          product={
            productToExchange
          }
          user={user}
          onClose={() =>
            setProductToExchange(null)
          }
          onConfirmExchange={
            handleConfirmExchange
          }
        />
      )}

      {/* =========================
          Dispute / Report Modal
      ========================= */}

      {itemForDispute && (
        <DisputeModal
          itemOrOrder={
            itemForDispute
          }
          onClose={() =>
            setItemForDispute(null)
          }
          onSubmitDispute={(
            reason,
            details
          ) => {
            const item = itemForDispute
            if (item && 'backendOrderId' in item) {
              return apiService.openDispute(
                item.backendOrderId || item.id,
                { reason: `${reason}: ${details}` }
              ).then(() => {
                showToast('Dispute opened successfully.')
              })
            }

            return apiService.createReport({
              listing_id: item && 'backendListingId' in item ? item.backendListingId || null : null,
              order_id: null,
              reason: `${reason}: ${details}`,
            }).then(() => {
              showToast('Report submitted successfully.')
            })
          }}
        />
      )}

      {/* =========================
          Notifications Drawer
      ========================= */}

      {showNotifications && (
        <NotificationsDrawer
          notifications={
            notifications
          }

          onClose={() =>
            setShowNotifications(
              false
            )
          }

          onMarkRead={
            handleMarkNotificationRead
          }

          onMarkAllRead={() => {
            setNotifications(
              (prev) =>
                prev.map((n) => ({
                  ...n,
                  read: true,
                }))
            )

            showToast(
              'All notifications marked as read'
            )
          }}
        />
      )}

      {/* =========================
          Chat Modal
      ========================= */}

      {showChat && (
        <ChatModal
          user={user}
          onClose={() =>
            setShowChat(false)
          }
        />
      )}

      {/* =========================
          Toast
      ========================= */}

      {toast && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform:
              'translateX(-50%)',
            background:
              'var(--ink)',
            color: '#fff',
            padding:
              '12px 20px',
            borderRadius:
              '30px',
            boxShadow:
              'var(--shadow-lg)',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems:
              'center',
            gap: '8px',
            zIndex: 200,
            border:
              '1px solid rgba(205,255,155,0.3)',
          }}
        >
          <CheckCircle2
            size={18}
            color="#CDFF9B"
          />

          <span>
            {toast}
          </span>
        </div>
      )}

    </div>
  )
}
