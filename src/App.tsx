import React, { useEffect, useState } from 'react'
import { View, User, Product, Order, WalletTransaction, NotificationItem } from './types'
import { INITIAL_USER } from './mockData'

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
import { DisputeModal } from './components/DisputeModal'
import { NotificationsDrawer } from './components/NotificationsDrawer'
import { ChatModal } from './components/ChatModal'
import { AdminPage } from './components/AdminPage'
import { AuthPage } from './components/auth/AuthPage'
import { CheckCircle2 } from 'lucide-react'
import { apiService, clearAuthTokens, toAppUser, ApiPointTransaction, ApiNotification } from './services/apiService'

export const App: React.FC = () => {
  const [view, setView] = useState<View>('login')
  const [user, setUser] = useState<User>(INITIAL_USER)
  const [displayProducts, setDisplayProducts] = useState<Product[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [favorites, setFavorites] = useState<number[]>([])

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productToExchange, setProductToExchange] = useState<Product | null>(null)
  const [itemForDispute, setItemForDispute] = useState<Order | Product | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const loadWalletData = async () => {
    try {
      const [wallet, transactionList] = await Promise.all([
        apiService.getWallet(),
        apiService.getWalletTransactions({ limit: 100 }),
      ])

      setUser((prev) => ({
        ...prev,
        pointsBalance: wallet.total_balance,
        lockedPoints: wallet.locked_balance,
      }))

      const mapTransaction = (transaction: ApiPointTransaction): WalletTransaction => {
        const type = transaction.transaction_type === 'debit'
          ? 'spent'
          : transaction.transaction_type === 'refund'
            ? 'refund'
            : 'earned'

        return {
          id: transaction.id,
          title: transaction.reason || transaction.reference,
          date: new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          points: Math.abs(transaction.points),
          type,
          status: 'Completed',
        }
      }

      setTransactions(transactionList.items.map(mapTransaction))
    } catch {
      // Keep mock wallet data visible if the authenticated wallet API is unavailable.
    }
  }

  const loadMyListings = async () => {
    try {
      const myListings = await apiService.getMyListings({ limit: 100 })
      setUser((prev) => ({ ...prev, itemsListed: myListings.length }))
    } catch {
      // Keep local listing counts when the listings API is unavailable.
    }
  }

  const loadBackendOrders = async () => {
    try {
      const response = await apiService.getOrders({ limit: 100 })
      setOrders((currentOrders) => {
        const backendOrders = response.items
          .map((item): Order | null => {
            const product = currentOrders.find((order) => order.product.backendListingId === item.listing_id)?.product
            if (!product) return null

            const stageIndex = item.status === 'completed' ? 5 : item.status === 'points_released' ? 4 : item.status === 'received' ? 3 : item.status === 'reserved' || item.status === 'fulfillment_pending' ? 2 : 1
            return {
              id: `ORD-${item.id.slice(0, 8)}`,
              backendOrderId: item.id,
              product,
              type: 'meetup' as const,
              points: item.points_total,
              counterparty: {
                name: product.seller.name,
                avatar: product.seller.avatar,
                role: 'seller' as const,
                rating: product.seller.rating,
                phone: '+91 98765 00112',
              },
              status: item.status === 'cancelled' ? 'cancelled' as const : item.status === 'disputed' ? 'disputed' as const : item.status === 'completed' ? 'completed' as const : 'active' as const,
              stage: stageIndex >= 5 ? 'Completed' as const : stageIndex >= 4 ? 'Points Released' as const : stageIndex >= 3 ? 'Item Received' as const : stageIndex >= 2 ? 'Meetup/Delivery Set' as const : 'Points Locked' as const,
              stageIndex,
              createdAt: item.created_at,
            }
          })
          .filter((order): order is Order => order !== null)

        if (backendOrders.length === 0) return currentOrders
        const backendIds = new Set(backendOrders.map((order) => order.backendOrderId).filter((id): id is string => Boolean(id)))
        return [...backendOrders, ...currentOrders.filter((order) => !order.backendOrderId || !backendIds.has(order.backendOrderId))]
      })
    } catch {
      // Keep local order data if the authenticated orders API is unavailable.
    }
  }

  const loadUserRating = async (userId: string) => {
    try {
      const rating = await apiService.getUserRating(userId)
      setUser((prev) => ({
        ...prev,
        rating: rating.average_rating ?? 0,
        ratingCount: rating.review_count,
      }))
    } catch {
      // Keep the profile rating fallback when the rating endpoint is unavailable.
    }
  }

  const loadNotifications = async () => {
    try {
      const apiNotifications = await apiService.getNotifications({ limit: 100 })
      const mapNotification = (notification: ApiNotification): NotificationItem => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        time: new Date(notification.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        read: notification.is_read,
        type: notification.notification_type === 'chat' ? 'chat' : notification.notification_type === 'points' ? 'points' : notification.notification_type === 'order' ? 'order' : 'system',
      })
      setNotifications(apiNotifications.map(mapNotification))
    } catch {
      // Keep mock notifications visible if the authenticated notifications API is unavailable.
    }
  }

  useEffect(() => {
    let isMounted = true

    apiService.restoreSession()
      .then((apiUser) => {
        if (!isMounted || !apiUser) return
        setUser(toAppUser(apiUser))
        setIsAuthenticated(true)
        setView('browse')
        void loadWalletData()
        void loadMyListings()
        void loadBackendOrders()
        void loadUserRating(apiUser.id)
        void loadNotifications()
      })
      .finally(() => {
        if (isMounted) setAuthReady(true)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await apiService.logout()
    } catch {
      // Always clear local credentials so sign-out succeeds on a transient network failure.
    } finally {
      clearAuthTokens()
      setIsAuthenticated(false)
      setView('login')
    }
  }

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const exists = prev.includes(id)
      showToast(exists ? 'Removed from saved favorites' : 'Saved to favorites ❤️')
      return exists ? prev.filter((item) => item !== id) : [...prev, id]
    })
  }

  // Handle adding new listing from Cashify Valuation flow
  const handleCompleteListing = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev])
    setUser((prev) => ({
      ...prev,
      itemsListed: prev.itemsListed + 1,
    }))
    showToast(`Listing Published! Valuation: ${newProduct.points} ReWear Points 🎉`)
    setView('browse')
  }

  const updateBackendListingStatus = async (product: Product, action: 'publish' | 'cancel' | 'delete') => {
    if (!product.backendListingId) return
    if (action === 'delete') {
      await apiService.deleteListing(product.backendListingId)
      setProducts((prev) => prev.filter((item) => item.id !== product.id))
      showToast('Listing deleted successfully.')
      return
    }

    if (action === 'publish') {
      await apiService.publishListing(product.backendListingId)
      setProducts((prev) => prev.map((item) => item.id === product.id ? { ...item, status: 'active' } : item))
      showToast('Listing published successfully.')
      return
    }

    await apiService.cancelListing(product.backendListingId)
    setProducts((prev) => prev.map((item) => item.id === product.id ? { ...item, status: 'completed' } : item))
    showToast('Listing cancelled successfully.')
  }

  // Handle confirming an exchange checkout
  const handleConfirmExchange = async (product: Product, exchangeType: 'meetup' | 'delivery') => {
    const pointsCost = product.points

    let holdId: string | undefined
    if (product.backendListingId) {
      try {
        const holdResponse = await apiService.reservePoints({
          listing_id: product.backendListingId,
          idempotency_key: `rewear-${product.backendListingId}-${Date.now()}`,
          expires_in_seconds: 900,
        })
        holdId = holdResponse.hold.id
        setUser((prev) => ({
          ...prev,
          pointsBalance: holdResponse.total_balance,
          lockedPoints: holdResponse.locked_balance,
        }))
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to lock points for this exchange.')
        return
      }
    }

    if (!holdId) {
      setUser((prev) => ({
        ...prev,
        pointsBalance: prev.pointsBalance - pointsCost,
        lockedPoints: prev.lockedPoints + pointsCost,
      }))
    }

    let backendOrderId: string | undefined
    if (product.backendListingId) {
      try {
        const createdOrder = await apiService.createOrder({
          listing_id: product.backendListingId,
          idempotency_key: `rewear-order-${product.backendListingId}-${Date.now()}`,
        })
        backendOrderId = createdOrder.id
      } catch (error) {
        if (holdId) await apiService.releasePoints(holdId).catch(() => undefined)
        showToast(error instanceof Error ? error.message : 'Unable to create the marketplace order.')
        return
      }
    }

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      backendOrderId,
      product: product,
      type: exchangeType,
      points: pointsCost,
      counterparty: {
        name: product.seller.name,
        avatar: product.seller.avatar,
        role: 'seller',
        rating: product.seller.rating,
        phone: '+91 98765 00112',
      },
      status: 'active',
      stage: 'Points Locked',
      stageIndex: 1,
      meetupDetails: {
        locationName: 'FC Road Starbucks / Goodluck Cafe',
        address: 'Deccan Gymkhana, Pune',
        date: 'Tomorrow, 5:30 PM',
        time: '17:30',
        isConfirmed: true,
      },
      deliveryDetails: {
        totalFee: 120,
        buyerShare: 60,
        sellerShare: 60,
        trackingNumber: `RW-DEL-${Math.floor(100000 + Math.random() * 900000)}`,
        carrier: 'Dunzo Eco Express',
        status: 'Courier assigned',
      },
      holdId,
      createdAt: 'Just now',
    }

    setOrders((prev) => [newOrder, ...prev])

    const newTx: WalletTransaction = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      title: `Escrow Hold: ${product.title}`,
      date: 'Today',
      points: pointsCost,
      type: 'locked',
      status: 'Pending Escrow',
      orderId: newOrder.id,
    }
    setTransactions((prev) => [newTx, ...prev])

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Exchange Confirmed!',
      message: `${pointsCost} ReWear Points held safely in escrow for Order #${newOrder.id}.`,
      time: 'Just now',
      read: false,
      type: 'points',
    }
    setNotifications((prev) => [newNotif, ...prev])

    setProductToExchange(null)
    setSelectedProduct(null)
    showToast(`Exchange Requested! ${pointsCost} Points locked in escrow 🔒`)
    setView('orders')
  }

  const handleConfirmMeetup = async (order: Order, location: string) => {
    if (order.backendOrderId) {
      try {
        const meetup = order.meetupId
          ? await apiService.confirmMeetup(order.backendOrderId)
          : await apiService.createMeetup(order.backendOrderId, {
              location,
              scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              idempotency_key: `rewear-meetup-${order.backendOrderId}-${Date.now()}`,
            }).then(() => apiService.confirmMeetup(order.backendOrderId!))
        setOrders((prev) => prev.map((item) => item.id === order.id ? {
          ...item,
          meetupId: meetup.id,
          stage: 'Meetup/Delivery Set',
          stageIndex: 2,
          meetupDetails: { ...item.meetupDetails!, locationName: meetup.location, isConfirmed: meetup.status === 'confirmed' },
        } : item))
        showToast('Meetup details confirmed.')
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to confirm meetup details.')
      }
      return
    }

    handleUpdateOrderStage(order.id, 2)
  }

  const handleHandoverMeetup = async (order: Order) => {
    if (order.backendOrderId && order.meetupId) {
      try {
        await apiService.handoverMeetup(order.backendOrderId)
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to confirm meetup handover.')
        return
      }
    }
    handleUpdateOrderStage(order.id, 3)
  }

  const handleConfirmDelivery = async (order: Order) => {
    if (order.backendOrderId) {
      try {
        const delivery = await apiService.createDelivery(order.backendOrderId, {
          address: order.meetupDetails?.address || user.location,
          idempotency_key: `rewear-delivery-${order.backendOrderId}-${Date.now()}`,
        })
        setOrders((prev) => prev.map((item) => item.id === order.id ? {
          ...item,
          deliveryId: delivery.id,
          stage: 'Meetup/Delivery Set',
          stageIndex: 2,
          deliveryDetails: {
            totalFee: delivery.fee,
            buyerShare: delivery.buyer_fee,
            sellerShare: delivery.seller_fee,
            trackingNumber: delivery.tracking_number || 'Awaiting tracking number',
            carrier: 'Courier partner',
            status: delivery.status,
          },
        } : item))
        showToast('Delivery request confirmed.')
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to create delivery request.')
      }
      return
    }

    handleUpdateOrderStage(order.id, 2)
  }

  // Update Order Stage
  const handleUpdateOrderStage = async (orderId: string, nextStageIndex: number) => {
    const order = orders.find((item) => item.id === orderId)
    if (order?.backendOrderId && nextStageIndex >= 4 && order.stageIndex < 4) {
      try {
        await apiService.getOrder(order.backendOrderId)
        await apiService.confirmOrderReceipt(order.backendOrderId)
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to confirm marketplace receipt.')
        return
      }
    } else if (order?.holdId && nextStageIndex >= 4 && order.stageIndex < 4) {
      try {
        const holdResponse = await apiService.capturePoints(order.holdId)
        setUser((prev) => ({
          ...prev,
          pointsBalance: holdResponse.total_balance,
          lockedPoints: holdResponse.locked_balance,
        }))
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to capture escrow points.')
        return
      }
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord

        const isFullyCompleted = nextStageIndex >= 5
        const updatedStatus = isFullyCompleted ? 'completed' : ord.status

        if (isFullyCompleted && ord.counterparty.role === 'seller' && !ord.holdId && !ord.backendOrderId) {
          setUser((u) => ({
            ...u,
            lockedPoints: Math.max(0, u.lockedPoints - ord.points),
            successfulExchanges: u.successfulExchanges + 1,
          }))
          showToast(`Points released from escrow! Exchange completed 🎉`)
        }

        return {
          ...ord,
          stageIndex: nextStageIndex,
          status: updatedStatus,
        }
      })
    )
  }

  const handleCancelOrder = async (orderId: string) => {
    const order = orders.find((item) => item.id === orderId)
    if (!order) return

    if (order.backendOrderId) {
      try {
        if (order.meetupId) await apiService.cancelMeetup(order.backendOrderId)
        await apiService.cancelOrder(order.backendOrderId)
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to cancel this marketplace order.')
        return
      }
    } else if (order.holdId) {
      try {
        const holdResponse = await apiService.releasePoints(order.holdId)
        setUser((prev) => ({
          ...prev,
          pointsBalance: holdResponse.total_balance,
          lockedPoints: holdResponse.locked_balance,
        }))
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to release escrow points.')
        return
      }
    } else {
      setUser((prev) => ({
        ...prev,
        pointsBalance: prev.pointsBalance + order.points,
        lockedPoints: Math.max(0, prev.lockedPoints - order.points),
      }))
    }

    setOrders((prev) => prev.map((item) => item.id === orderId ? { ...item, status: 'cancelled' } : item))
    showToast('Exchange cancelled and escrow points released.')
  }

  const unreadNotifsCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (view === 'favorites') {
      setDisplayProducts(products.filter((product) => favorites.includes(product.id)))
      return
    }
    setDisplayProducts(products)
  }, [view, products, favorites])

  useEffect(() => {
    const listingId = selectedProduct?.backendListingId
    if (!listingId) return

    let isMounted = true
    Promise.all([apiService.getListing(listingId), apiService.getPhotos(listingId)])
      .then(([listing, photos]) => {
        if (!isMounted) return
        setSelectedProduct((current) => current && current.backendListingId === listingId
          ? {
              ...current,
              title: listing.title,
              description: listing.description || current.description,
              defects: listing.defects ? listing.defects.split(',').map((item) => item.trim()).filter(Boolean) : current.defects,
              images: photos.length > 0 ? photos.sort((a, b) => a.sort_order - b.sort_order).map((photo) => photo.photo_url) : current.images,
            }
          : current)
      })
      .catch(() => {
        // Keep the discovery preview if detail/photo APIs are unavailable.
      })

    return () => {
      isMounted = false
    }
  }, [selectedProduct?.backendListingId])

  if (!authReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#162E33', color: '#fff' }}>
        Restoring your session…
      </div>
    )
  }

  if (!isAuthenticated || view === 'login') {
    return (
      <AuthPage
        initialMode="login"
        onSuccess={(u) => {
          setUser(u)
          setIsAuthenticated(true)
          void loadWalletData()
          void loadMyListings()
          void loadBackendOrders()
          void loadUserRating(u.id)
          void loadNotifications()
          showToast(`Welcome back, ${u.name}! Signed in successfully 🎉`)
          setView('browse')
        }}
      />
    )
  }

  return (
    <div className="app-shell">
      <Navbar
        currentView={view}
        setView={setView}
        user={user}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifs={() => setShowNotifications(true)}
        onOpenChat={() => setShowChat(true)}
        onOpenAdmin={user.role === 'admin' ? () => setView('admin') : undefined}
      />

      <main style={{ flex: 1 }}>
        {view === 'landing' && (
          <LandingPage
            setView={setView}
            featuredProducts={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {(view === 'home' || view === 'browse' || view === 'favorites') && (
          <DiscoverPage
            products={view === 'favorites' ? displayProducts : products}
            user={user}
            onSelectProduct={(p) => setSelectedProduct(p)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenSell={() => setView('sell')}
            onOpenDonate={() => setView('donate')}
          />
        )}

        {view === 'sell' && (
          <SellCashifyFlow
            user={user}
            onCompleteListing={handleCompleteListing}
            onCancel={() => setView('browse')}
          />
        )}

        {view === 'donate' && (
          <DonateFlow
            user={user}
            onSubmitDonation={async (data) => {
              const donation = await apiService.submitDonation(data)
              void apiService.getDonations({ limit: 20 }).catch(() => undefined)
              return donation.reward_points ?? 0
            }}
            onCompleteDonation={(points) => {
              setUser((prev) => ({
                ...prev,
                pointsBalance: prev.pointsBalance + points,
                donationsCompleted: prev.donationsCompleted + 1,
              }))
              showToast(`Received +${points} Eco Karma Points for donation! 🌱`)
              setView('wallet')
            }}
            onCancel={() => setView('browse')}
          />
        )}

        {view === 'orders' && (
          <OrdersPage
            orders={orders}
            onUpdateStage={handleUpdateOrderStage}
            onCancelOrder={handleCancelOrder}
            onConfirmMeetup={handleConfirmMeetup}
            onHandoverMeetup={handleHandoverMeetup}
            onConfirmDelivery={handleConfirmDelivery}
            onSubmitReview={async (order, rating, comment) => {
              if (!order.backendOrderId) return
              await apiService.submitReview(order.backendOrderId, { rating, comment: comment || null })
              await loadUserRating(order.product.seller.id)
              showToast('Review submitted successfully.')
            }}
            onOpenDispute={(ord) => setItemForDispute(ord)}
          />
        )}

        {view === 'wallet' && (
          <WalletPage
            user={user}
            transactions={transactions}
            onOpenSell={() => setView('sell')}
            onOpenDonate={() => setView('donate')}
          />
        )}

        {view === 'profile' && (
          <ProfilePage
            user={user}
            products={products}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onSignOut={handleSignOut}
            onUpdateProfile={async (updated) => {
              await apiService.updateProfile({
                display_name: updated.name,
                city: updated.location,
                avatar_url: updated.avatar || null,
              })
              setUser((current) => ({ ...current, ...updated }))
              showToast('Profile updated successfully! ✨')
            }}
            onDeactivateAccount={async () => {
              await apiService.updateAccountStatus(user.id, false)
              await handleSignOut()
            }}
            onPublishListing={(product) => updateBackendListingStatus(product, 'publish')}
            onCancelListing={(product) => updateBackendListingStatus(product, 'cancel')}
            onDeleteListing={(product) => updateBackendListingStatus(product, 'delete')}
          />
        )}

        {view === 'admin' && user.role === 'admin' && (
          <AdminPage user={user} onBack={() => setView('browse')} />
        )}
      </main>

      <MobileNav currentView={view} setView={setView} />

      {/* Item Detail Modal */}
      {selectedProduct && (
        <ItemDetailModal
          product={selectedProduct}
          user={user}
          onClose={() => setSelectedProduct(null)}
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={handleToggleFavorite}
          onInitiateExchange={(p) => setProductToExchange(p)}
          onReportListing={(p) => setItemForDispute(p)}
        />
      )}

      {/* Exchange Checkout Modal */}
      {productToExchange && (
        <ExchangeModal
          product={productToExchange}
          user={user}
          onClose={() => setProductToExchange(null)}
          onConfirmExchange={handleConfirmExchange}
        />
      )}

      {/* Dispute & Report Modal */}
      {itemForDispute && (
        <DisputeModal
          itemOrOrder={itemForDispute}
          onClose={() => setItemForDispute(null)}
          onSubmitDispute={(reason) => {
            if (itemForDispute && 'backendOrderId' in itemForDispute && itemForDispute.backendOrderId) {
              return apiService.openDispute(itemForDispute.backendOrderId, {
                reason,
                evidence_metadata: { submitted_from: 'frontend', submitted_at: new Date().toISOString() },
              }).then(() => {
                showToast('Dispute filed. Points release held in escrow 🛡️')
              })
            }
            if (itemForDispute && 'backendListingId' in itemForDispute && itemForDispute.backendListingId) {
              return apiService.createReport({ listing_id: itemForDispute.backendListingId, reason }).then(() => {
                showToast('Listing report submitted for Trust & Safety review.')
              })
            }
            showToast('Report submitted for Trust & Safety review.')
          }}
        />
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <NotificationsDrawer
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllRead={() => {
            const unread = notifications.filter((notification) => !notification.read && /^[0-9a-f-]{36}$/i.test(notification.id))
            void Promise.all(unread.map((notification) => apiService.markNotificationRead(notification.id))).catch(() => undefined)
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
            showToast('All notifications marked as read')
          }}
          onMarkRead={(id) => {
            if (/^[0-9a-f-]{36}$/i.test(id)) void apiService.markNotificationRead(id).catch(() => undefined)
            setNotifications((prev) => prev.map((notification) => notification.id === id ? { ...notification, read: true } : notification))
          }}
        />
      )}

      {/* Phase 2 Chat Modal */}
      {showChat && (
        <ChatModal user={user} onClose={() => setShowChat(false)} />
      )}

      {/* Toast Popup */}
      {toast && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--ink)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '30px',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 200,
            border: '1px solid rgba(205,255,155,0.3)',
          }}
        >
          <CheckCircle2 size={18} color="#CDFF9B" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
