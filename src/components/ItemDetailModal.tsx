import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Product, User } from '../types'
import { PointsIcon } from './PointsIcon'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80'

interface ItemDetailModalProps {
  product: Product
  user: User
  onClose: () => void
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
  onInitiateExchange: (product: Product) => void
  onReportListing: (product: Product) => void
  photoIds?: string[]
  onDeletePhoto?: (photoId: string) => Promise<void>
  isOwner?: boolean
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  product,
  user,
  onClose,
  isFavorite,
  onToggleFavorite,
  onInitiateExchange,
  onReportListing,
  isOwner = false,
  photoIds = [],
  onDeletePhoto,
}) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '0' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Gallery View */}
          <div style={{ background: '#EAF0E8', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative', height: '320px', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
              <img
                src={product.images[activeImgIndex] || product.images[0] || FALLBACK_IMAGE}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {product.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveImgIndex(idx)}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: idx === activeImgIndex ? '3px solid var(--ink)' : '2px solid transparent',
                        opacity: idx === activeImgIndex ? 1 : 0.7,
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                    {onDeletePhoto && photoIds[idx] && (
                      <button
                        type="button"
                        aria-label="Delete photo"
                        title="Delete photo"
                        onClick={() => void onDeletePhoto(photoIds[idx])}
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: 0,
                          background: 'var(--rose)',
                          color: '#fff',
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {product.brand} • {product.category}
              </div>
              <span className="badge-lime">{product.condition}</span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '14px' }}>
              {product.title}
            </h1>

            {/* Points Value Callout */}
            <div
              style={{
                background: 'var(--lime-soft)',
                border: '1px solid #C4EAA2',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Required Valuation</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PointsIcon size={24} color="#203D43" />
                  <span>{product.points}</span>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>ReWear Points</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--muted)' }}>
                <div style={{ fontWeight: 700, color: 'var(--ink)' }}>Escrow Protected</div>
                <span>Points held safely</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '14px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', marginBottom: '16px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--muted)', display: 'block', fontSize: '11px' }}>Size</span>
                <strong>{product.size}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--muted)', display: 'block', fontSize: '11px' }}>Gender Fit</span>
                <strong>{product.gender}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--muted)', display: 'block', fontSize: '11px' }}>Distance</span>
                <strong>{product.distance} away</strong>
              </div>
              <div>
                <span style={{ color: 'var(--muted)', display: 'block', fontSize: '11px' }}>Location</span>
                <strong>{product.seller.location || 'India'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--muted)', display: 'block', fontSize: '11px' }}>Fulfillment</span>
                <strong>{product.pickupType === 'both' ? 'Meetup or Delivery' : product.pickupType === 'meetup' ? 'Nearby Meetup' : 'Long Distance Delivery'}</strong>
              </div>
            </div>

            {/* Disclosed Defects */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                Disclosed Wear & Defects
              </div>
              {product.defects.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#3B6B2E', background: '#F0F9ED', padding: '6px 10px', borderRadius: '6px' }}>
                  Verified pristine condition — No defects disclosed.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {product.defects.map((def, idx) => (
                    <div key={idx} style={{ fontSize: '12px', color: '#993D3D', background: '#FDF0F0', padding: '6px 10px', borderRadius: '6px', fontWeight: 600 }}>
                      ⚠️ {def}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* Seller Profile Card */}
            <div
              style={{
                background: 'var(--bg-cream)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{product.seller.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  {product.seller.location || 'India'} • ★ {product.seller.rating} rating • {product.seller.exchangesCount} swaps
                </div>
              </div>
            </div>

            {/* Clean Action Buttons without Icons */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {isOwner ? (
                  <div
                    className="badge-lime"
                    style={{ flex: 1, minHeight: '46px', display: 'grid', placeItems: 'center' }}
                  >
                    YOUR LISTING
                  </div>
                ) : (
                  <button
                    className="btn-primary"
                    style={{ flex: 1, height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => onInitiateExchange(product)}
                  >
                    Get / Exchange Item (<PointsIcon size={14} color="#fff" />{product.points} Pts)
                  </button>
                )}

              <button
                className="btn-secondary"
                style={{ height: '46px', padding: '0 16px', background: isFavorite ? 'var(--lime)' : '#fff' }}
                onClick={() => onToggleFavorite(product.id)}
              >
                {isFavorite ? 'Saved' : 'Save Item'}
              </button>

              <button
                className="btn-secondary"
                style={{ height: '46px', padding: '0 16px', color: 'var(--rose)', borderColor: '#F5C6C6' }}
                onClick={() => onReportListing(product)}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
