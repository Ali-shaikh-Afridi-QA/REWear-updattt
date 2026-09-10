import React from 'react'
import { Product } from '../types'
import { ProductCard } from './ProductCard'

interface FavoritesPageProps {
  products: Product[]
  favorites: number[]
  onToggleFavorite: (id: number) => void
  onSelectProduct: (p: Product) => void
  onOpenBrowse: () => void
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  products,
  favorites,
  onToggleFavorite,
  onSelectProduct,
  onOpenBrowse,
}) => {
  const savedProducts = products.filter((p) => favorites.includes(p.id))

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 16px 80px' }}>
      <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="badge-lime" style={{ marginBottom: '6px' }}>SAVED GARMENTS</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px' }}>Your Saved Favorites ({savedProducts.length})</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '2px' }}>
            Garments saved for later exchange or price tracking.
          </p>
        </div>

        <button className="btn-secondary" onClick={onOpenBrowse}>
          Explore More Clothes
        </button>
      </div>

      {/* Favorites Grid */}
      {savedProducts.length === 0 ? (
        <div className="card-clean" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>No saved items in your list yet</h3>
          <p style={{ fontSize: '14px', marginTop: '6px', marginBottom: '20px' }}>
            Tap the heart icon on any listing card while discovering clothes to save it here!
          </p>
          <button className="btn-primary" onClick={onOpenBrowse}>
            Browse Nearby Marketplace
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
          {savedProducts.map((p) => (
            <div key={p.id} style={{ position: 'relative' }}>
              <ProductCard
                product={p}
                onClick={() => onSelectProduct(p)}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(p.id)
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(231, 90, 90, 0.9)',
                  color: '#fff',
                  border: 0,
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  zIndex: 5,
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
