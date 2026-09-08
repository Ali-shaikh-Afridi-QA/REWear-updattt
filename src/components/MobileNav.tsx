import React from 'react'
import { View } from '../types'

interface MobileNavProps {
  currentView: View
  setView: (view: View) => void
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView }) => {
  return (
    <div className="mobile-bottom-nav">
      <button
        className={`mobile-nav-item ${currentView === 'landing' ? 'active' : ''}`}
        onClick={() => setView('landing')}
      >
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'browse' || currentView === 'home' ? 'active' : ''}`}
        onClick={() => setView('browse')}
      >
        <span>Discover</span>
      </button>

      <button
        className="mobile-sell-btn"
        onClick={() => setView('sell')}
        title="Sell / Valuation"
        style={{ fontSize: '12px', fontWeight: 800 }}
      >
        <span>+ Sell</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'orders' ? 'active' : ''}`}
        onClick={() => setView('orders')}
      >
        <span>Orders</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'wallet' ? 'active' : ''}`}
        onClick={() => setView('wallet')}
      >
        <span>Wallet</span>
      </button>
    </div>
  )
}
