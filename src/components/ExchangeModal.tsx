import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Product, User } from '../types'
import { PointsIcon } from './PointsIcon'

interface ExchangeModalProps {
  product: Product
  user: User
  onClose: () => void
  onConfirmExchange: (product: Product, exchangeType: 'meetup' | 'delivery') => void
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  product,
  user,
  onClose,
  onConfirmExchange,
}) => {
  const [pickupType, setPickupType] = useState<'meetup' | 'delivery'>('meetup')
  const hasEnoughPoints = user.pointsBalance >= product.points

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', padding: '28px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>Confirm ReWear Exchange</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
          Points will be safely locked in escrow until you receive and verify the item.
        </p>

        {/* Product Card Summary */}
        <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-cream)', padding: '14px', borderRadius: '10px', marginBottom: '20px' }}>
          <img
            src={product.images[0]}
            alt={product.title}
            style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>{product.brand} • {product.size}</div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '2px 0 4px' }}>{product.title}</h4>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {product.distance} away • ★ {product.seller.rating} seller
            </div>
          </div>
        </div>

        {/* Fulfillment Method Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            Choose Exchange Fulfillment Method
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              onClick={() => setPickupType('meetup')}
              style={{
                border: '2px solid ' + (pickupType === 'meetup' ? 'var(--ink)' : 'var(--line)'),
                background: pickupType === 'meetup' ? 'var(--lime-soft)' : '#fff',
                padding: '12px',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800 }}>Nearby Meetup</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Free • Local spot in Pune</div>
            </div>

            <div
              onClick={() => setPickupType('delivery')}
              style={{
                border: '2px solid ' + (pickupType === 'delivery' ? 'var(--ink)' : 'var(--line)'),
                background: pickupType === 'delivery' ? 'var(--lime-soft)' : '#fff',
                padding: '12px',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800 }}>50/50 Split Delivery</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>₹60 Buyer / ₹60 Seller</div>
            </div>
          </div>
        </div>

        {/* Points Balance Calculation */}
        <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '14px 0', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)' }}>
            <span>Available Wallet Balance</span>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><PointsIcon size={14} color="#203D43" />{user.pointsBalance.toLocaleString()} Pts</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink)', fontWeight: 700 }}>
            <span>Item Escrow Points Hold</span>
            <span style={{ color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: '4px' }}>- <PointsIcon size={14} color="#E53E3E" />{product.points} Pts</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '15px', paddingTop: '6px', borderTop: '1px dashed var(--line)' }}>
            <span>Remaining Available Points</span>
            <span style={{ color: hasEnoughPoints ? 'var(--ink)' : 'var(--rose)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PointsIcon size={14} color={hasEnoughPoints ? '#203D43' : '#E53E3E'} />{(user.pointsBalance - product.points).toLocaleString()} Pts
            </span>
          </div>
        </div>

        {/* Action Button without Icon */}
        <button
          className="btn-primary"
          style={{ width: '100%', padding: '14px', opacity: hasEnoughPoints ? 1 : 0.6 }}
          disabled={!hasEnoughPoints}
          onClick={() => onConfirmExchange(product, pickupType)}
        >
          Confirm & Lock {product.points} Points
        </button>
      </div>
    </div>
  )
}
