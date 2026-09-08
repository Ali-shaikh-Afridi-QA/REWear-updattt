import React from 'react'
import { Heart, MapPin, Star, AlertCircle } from 'lucide-react'
import { Product } from '../types'
import { PointsIcon } from './PointsIcon'

interface ProductCardProps {
  product: Product
  onClick: () => void
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="card-clean" style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      {/* Image Wrap */}
      <div style={{ position: 'relative', height: '240px', background: '#EAF0E8' }} onClick={onClick}>
        <img
          src={product.images[0]}
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Favorite Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(product.id)
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: isFavorite ? '#CDFF9B' : '#fff',
            color: isFavorite ? '#203D43' : '#627571',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            transition: 'transform 0.2s',
          }}
          title={isFavorite ? 'Remove from saved' : 'Save item'}
        >
          <Heart size={18} fill={isFavorite ? '#203D43' : 'none'} />
        </button>

        {/* Condition Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(32, 61, 67, 0.88)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '4px 8px',
            borderRadius: '6px',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {product.defects.length > 0 && <AlertCircle size={11} color="#CDFF9B" />}
          {product.condition}
        </div>

        {/* Distance Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: '#fff',
            color: 'var(--ink)',
            fontSize: '10px',
            fontWeight: 700,
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <MapPin size={11} color="#627571" />
          {product.distance}
        </div>
      </div>

      {/* Product Content */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }} onClick={onClick}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {product.brand} • Size {product.size}
        </div>

        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--ink)',
            marginTop: '4px',
            marginBottom: '10px',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '40px',
          }}
        >
          {product.title}
        </h3>

        {/* Points & Seller Row */}
        <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--ink)', fontWeight: 800, fontSize: '16px' }}>
            <PointsIcon size={16} color="#203D43" />
            <span>{product.points}</span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>Pts</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
            <Star size={12} color="#E5A93C" fill="#E5A93C" />
            <span>{product.seller.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
