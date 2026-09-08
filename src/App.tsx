import React, { useEffect, useState } from 'react'
import { View, User, Product, Order, WalletTransaction, NotificationItem } from './types'
import { INITIAL_USER, INITIAL_PRODUCTS, MOCK_ORDERS, MOCK_WALLET_TRANSACTIONS, MOCK_NOTIFICATIONS } from './mockData'

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
import { AuthPage } from './components/auth/AuthPage'
import { CheckCircle2 } from 'lucide-react'
import { apiService, clearAuthTokens, toAppUser } from './services/apiService'

export const App: React.FC = () => {
  const [view, setView] = useState<View>('login')
  const [user, setUser] = useState<User>(INITIAL_USER)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_WALLET_TRANSACTIONS)
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS)
  const [favorites, setFavorites] = useState<number[]>([1, 3])

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

  useEffect(() => {
    let isMounted = true

    apiService.restoreSession()
      .then((apiUser) => {
        if (!isMounted || !apiUser) return
        setUser(toAppUser(apiUser))
        setIsAuthenticated(true)
        setView('browse')
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

  // Handle confirming an exchange checkout
  const handleConfirmExchange = (product: Product, exchangeType: 'meetup' | 'delivery') => {
    const pointsCost = product.points

    setUser((prev) => ({
      ...prev,
      pointsBalance: prev.pointsBalance - pointsCost,
      lockedPoints: prev.lockedPoints + pointsCost,
    }))

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
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

  // Update Order Stage
  const handleUpdateOrderStage = (orderId: string, nextStageIndex: number) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord

        const isFullyCompleted = nextStageIndex >= 5
        const updatedStatus = isFullyCompleted ? 'completed' : ord.status

        if (isFullyCompleted && ord.counterparty.role === 'seller') {
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

  const unreadNotifsCount = notifications.filter((n) => !n.read).length

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

        {(view === 'home' || view === 'browse') && (
          <DiscoverPage
            products={products}
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
            onCompleteDonation={() => {
              setUser((prev) => ({
                ...prev,
                pointsBalance: prev.pointsBalance + 400,
                donationsCompleted: prev.donationsCompleted + 1,
              }))
              showToast('Received +400 Eco Karma Points for donation! 🌱')
              setView('wallet')
            }}
            onCancel={() => setView('browse')}
          />
        )}

        {view === 'orders' && (
          <OrdersPage
            orders={orders}
            onUpdateStage={handleUpdateOrderStage}
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
            onUpdateProfile={(updated) => {
              setUser(updated)
              showToast('Profile updated successfully! ✨')
            }}
          />
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
            showToast('Dispute filed. Points release held in escrow 🛡️')
          }}
        />
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <NotificationsDrawer
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
            showToast('All notifications marked as read')
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
