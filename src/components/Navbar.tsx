import React, { useState } from 'react'
import { Leaf, Menu, X } from 'lucide-react'
import { View, User } from '../types'
import { PointsIcon } from './PointsIcon'

interface NavbarProps {
  currentView: View
  setView: (view: View) => void
  user: User
  unreadNotifsCount: number
  onOpenNotifs: () => void
  onOpenChat: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setView,
  user,
  unreadNotifsCount,
  onOpenNotifs,
  onOpenChat,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (v: View) => {
    setView(v)
    setMobileMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <button className="brand-logo" onClick={() => handleNavClick('landing')}>
          <div className="brand-icon-box">
            <Leaf size={20} />
          </div>
          <span>ReWear</span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="nav-links desktop-only">
          <button
            className={`nav-btn ${currentView === 'home' || currentView === 'browse' ? 'active' : ''}`}
            onClick={() => handleNavClick('browse')}
          >
            Discover
          </button>
          <button
            className={`nav-btn ${currentView === 'sell' ? 'active' : ''}`}
            onClick={() => handleNavClick('sell')}
          >
            Sell
          </button>
          <button
            className={`nav-btn ${currentView === 'donate' ? 'active' : ''}`}
            onClick={() => handleNavClick('donate')}
          >
            Donate
          </button>
          <button
            className={`nav-btn ${currentView === 'orders' ? 'active' : ''}`}
            onClick={() => handleNavClick('orders')}
          >
            Orders
          </button>
          <button
            className={`nav-btn ${currentView === 'wallet' ? 'active' : ''}`}
            onClick={() => handleNavClick('wallet')}
          >
            Wallet
          </button>
          <button
            className={`nav-btn ${currentView === 'favorites' ? 'active' : ''}`}
            onClick={() => handleNavClick('favorites')}
          >
            Favorites
          </button>
          <button
            className={`nav-btn ${currentView === 'help' ? 'active' : ''}`}
            onClick={() => handleNavClick('help')}
          >
            Help
          </button>
          {user.role === 'admin' && (
            <button
              className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => handleNavClick('admin')}
            >
              Admin
            </button>
          )}
        </nav>

        {/* Right Action Items & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Points Pill */}
          <button
            className="points-pill"
            onClick={() => handleNavClick('wallet')}
            title="View Points Wallet"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px' }}
          >
            <PointsIcon size={16} color="#203D43" />
            <span style={{ fontWeight: 800 }}>{user.pointsBalance.toLocaleString()} Pts</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifs}
            style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            Notifications
            {unreadNotifsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#CDFF9B',
                  color: '#203D43',
                  fontSize: '9px',
                  fontWeight: 800,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Profile Pill */}
          <button
            onClick={() => handleNavClick('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '30px',
              padding: '4px 10px 4px 4px',
              color: '#fff',
            }}
          >
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span className="desktop-only" style={{ fontSize: '12px', fontWeight: 700 }}>
              Profile
            </span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              color: '#fff',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '6px',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--ink)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <button
            className={`nav-btn ${currentView === 'landing' ? 'active' : ''}`}
            onClick={() => handleNavClick('landing')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Home
          </button>
          <button
            className={`nav-btn ${currentView === 'browse' ? 'active' : ''}`}
            onClick={() => handleNavClick('browse')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Discover Clothes
          </button>
          <button
            className={`nav-btn ${currentView === 'sell' ? 'active' : ''}`}
            onClick={() => handleNavClick('sell')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Sell / Valuation
          </button>
          <button
            className={`nav-btn ${currentView === 'donate' ? 'active' : ''}`}
            onClick={() => handleNavClick('donate')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Donate Garments
          </button>
          <button
            className={`nav-btn ${currentView === 'orders' ? 'active' : ''}`}
            onClick={() => handleNavClick('orders')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Exchange Orders
          </button>
          <button
            className={`nav-btn ${currentView === 'wallet' ? 'active' : ''}`}
            onClick={() => handleNavClick('wallet')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Points Wallet
          </button>
          <button
            className={`nav-btn ${currentView === 'favorites' ? 'active' : ''}`}
            onClick={() => handleNavClick('favorites')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Saved Favorites
          </button>
          <button
            className={`nav-btn ${currentView === 'help' ? 'active' : ''}`}
            onClick={() => handleNavClick('help')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Help & Dispute Center
          </button>
          <button
            className={`nav-btn ${currentView === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Profile & Reputation
          </button>
        </div>
      )}
    </header>
  )
}
