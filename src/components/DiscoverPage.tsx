import React, { useState, useMemo, useEffect } from 'react'
import { Product, User, FilterOptions } from '../types'
import { ProductCard } from './ProductCard'
import { PointsIcon } from './PointsIcon'
import { apiService, CatalogItem, ApiDiscoveryListing } from '../services/apiService'

interface DiscoverPageProps {
  products: Product[]
  user: User
  onSelectProduct: (p: Product) => void
  favorites: number[]
  onToggleFavorite: (id: number) => void
  onOpenSell: () => void
  onOpenDonate: () => void
}

const CATEGORIES = ['All', 'Jackets', 'Dresses', 'Shoes', 'T-Shirts', 'Hoodies', 'Shirts', 'Jeans']
const BRANDS = ['All', "Levi's", 'Zara', 'Nike', 'H&M', 'Adidas', 'Uniqlo', 'Mango', 'Thrift Vintage']
const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL', 'UK 6', 'UK 7']
const CONDITIONS = ['All', 'Brand New with Tags', 'Like New', 'Excellent', 'Good']

const DISCOVERY_IMAGE = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80'

function mapDiscoveryListing(item: ApiDiscoveryListing, categoryItems: CatalogItem[], brandItems: CatalogItem[]): Product {
  const category = categoryItems.find((catalogItem) => catalogItem.id === item.category_id)?.name || 'Clothing'
  const brand = brandItems.find((catalogItem) => catalogItem.id === item.brand_id)?.name || 'Local Brand'
  const condition = item.condition === 'like_new' ? 'Like New' : item.condition === 'good' ? 'Good' : 'Well Worn'
  const numericId = Number.parseInt(item.id.replace(/[^0-9]/g, '').slice(0, 8) || '0', 10)

  return {
    id: numericId,
    backendListingId: item.id,
    title: item.title,
    brand,
    category,
    size: item.size,
    gender: 'Unisex',
    condition,
    defects: [],
    points: item.points_required,
    distance: item.distance_km == null ? 'Distance unavailable' : `${item.distance_km.toFixed(1)} km`,
    distanceKm: item.distance_km ?? 999,
    seller: {
      id: item.seller.id,
      name: item.seller.username,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: 0,
      location: item.location || 'Location unavailable',
      exchangesCount: 0,
      joinedDate: 'Recently',
    },
    images: [DISCOVERY_IMAGE],
    description: item.description || 'A community-listed pre-loved garment.',
    pickupType: 'both',
    createdAt: item.created_at,
    status: item.status === 'reserved' ? 'reserved' : 'active',
  }
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  products,
  user,
  onSelectProduct,
  favorites,
  onToggleFavorite,
  onOpenSell,
  onOpenDonate,
}) => {
  const [filterOpen, setFilterOpen] = useState(false)
  const [categories, setCategories] = useState(CATEGORIES)
  const [brands, setBrands] = useState(BRANDS)
  const [categoryItems, setCategoryItems] = useState<CatalogItem[]>([])
  const [brandItems, setBrandItems] = useState<CatalogItem[]>([])
  const [remoteProducts, setRemoteProducts] = useState<Product[] | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    query: '',
    category: 'All',
    brand: 'All',
    size: 'All',
    condition: 'All',
    maxPoints: 1500,
    maxDistanceKm: 10,
    sortBy: 'nearest',
  })

  const resetFilters = () => {
    setFilters({
      query: '',
      category: 'All',
      brand: 'All',
      size: 'All',
      condition: 'All',
      maxPoints: 1500,
      maxDistanceKm: 10,
      sortBy: 'nearest',
    })
  }

  useEffect(() => {
    let isMounted = true

    Promise.all([apiService.getCategories({ limit: 200 }), apiService.getBrands({ limit: 200 })])
      .then(([categoryItems, brandItems]) => {
        if (!isMounted) return
        setCategoryItems(categoryItems)
        setBrandItems(brandItems)
        if (categoryItems.length > 0) setCategories(['All', ...categoryItems.map((item) => item.name)])
        if (brandItems.length > 0) setBrands(['All', ...brandItems.map((item) => item.name)])
      })
      .catch(() => {
        // Keep local filter options available if the catalog API is unavailable.
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const categoryId = categoryItems.find((item) => item.name === filters.category)?.id
    const brandId = brandItems.find((item) => item.name === filters.brand)?.id
    const conditionMap: Record<string, string> = {
      'Like New': 'like_new',
      Good: 'good',
      Excellent: 'good',
      'Brand New with Tags': 'like_new',
    }
    const sortMap: Record<FilterOptions['sortBy'], string> = {
      nearest: 'distance',
      newest: 'newest',
      lowest_points: 'price_asc',
      best_rated: 'newest',
    }
    const params: Record<string, string | number> = {
      limit: 100,
      max_points: filters.maxPoints,
      radius_km: filters.maxDistanceKm,
      sort: sortMap[filters.sortBy],
    }

    if (filters.query.trim()) params.search = filters.query.trim()
    if (categoryId) params.category_id = categoryId
    if (brandId) params.brand_id = brandId
    if (filters.size !== 'All') params.size = filters.size
    if (filters.condition !== 'All') params.condition = conditionMap[filters.condition] || 'good'

    apiService.searchListings(params)
      .then((response) => {
        if (!isMounted) return
        setRemoteProducts(response.items.map((item) => mapDiscoveryListing(item, categoryItems, brandItems)))
      })
      .catch(() => {
        if (isMounted) setRemoteProducts(null)
      })

    return () => {
      isMounted = false
    }
  }, [filters, categoryItems, brandItems])

  const activeProducts = remoteProducts ?? products

  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter((p) => {
        const matchesQuery =
          p.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          p.brand.toLowerCase().includes(filters.query.toLowerCase()) ||
          p.seller.name.toLowerCase().includes(filters.query.toLowerCase())
        const matchesCategory = filters.category === 'All' || p.category === filters.category
        const matchesBrand = filters.brand === 'All' || p.brand === filters.brand
        const matchesSize = filters.size === 'All' || p.size === filters.size
        const matchesCondition = filters.condition === 'All' || p.condition === filters.condition
        const matchesPoints = p.points <= filters.maxPoints
        const matchesDistance = p.distanceKm <= filters.maxDistanceKm

        return (
          matchesQuery &&
          matchesCategory &&
          matchesBrand &&
          matchesSize &&
          matchesCondition &&
          matchesPoints &&
          matchesDistance
        )
      })
      .sort((a, b) => {
        if (filters.sortBy === 'nearest') return a.distanceKm - b.distanceKm
        if (filters.sortBy === 'lowest_points') return a.points - b.points
        if (filters.sortBy === 'best_rated') return b.seller.rating - a.seller.rating
        return b.id - a.id // newest
      })
  }, [activeProducts, filters])

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px 80px' }}>
      {/* Wallet Points & Quick Action Bar */}
      <div
        className="card-clean"
        style={{
          background: 'linear-gradient(135deg, #203D43 0%, #2A4F56 100%)',
          color: '#fff',
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: '#CDFF9B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
            YOUR REWEAR BALANCE
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '2px' }}>
            {user.pointsBalance.toLocaleString()} <span style={{ fontSize: '15px', fontWeight: 600, color: '#B2C4C0' }}>Available Points</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8E9F9B', marginTop: '4px' }}>
            {user.lockedPoints} Points locked in active exchange escrow
          </div>
        </div>

        {/* Action Buttons without icons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onOpenSell}>
            Sell / Valuation
          </button>
          <button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }} onClick={onOpenDonate}>
            Donate Item
          </button>
        </div>
      </div>

      {/* Search & Toolbar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Search Bar */}
        <div
          style={{
            flex: 1,
            minWidth: '240px',
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: '10px',
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            height: '46px',
          }}
        >
          <input
            type="text"
            placeholder="Search by jacket, dress, brand, or seller..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            style={{ border: 0, outline: 0, width: '100%', background: 'transparent', fontSize: '14px', color: 'var(--ink)' }}
          />
          {filters.query && (
            <button onClick={() => setFilters({ ...filters, query: '' })} style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Clear
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          className="btn-secondary"
          style={{ height: '46px', background: filterOpen ? 'var(--ink)' : '#fff', color: filterOpen ? '#fff' : 'var(--ink)' }}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          Filters
        </button>

        {/* Sort Select */}
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
          style={{
            height: '46px',
            padding: '0 14px',
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--ink)',
            cursor: 'pointer',
            outline: 0,
          }}
        >
          <option value="nearest">Sort: Nearest Distance</option>
          <option value="lowest_points">Sort: Lowest Points</option>
          <option value="best_rated">Sort: Best Rated Seller</option>
          <option value="newest">Sort: Newest Listings</option>
        </select>
      </div>

      {/* Categories Horizontal Scroll */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters({ ...filters, category: cat })}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: filters.category === cat ? 700 : 600,
              background: filters.category === cat ? 'var(--ink)' : '#fff',
              color: filters.category === cat ? '#CDFF9B' : 'var(--muted)',
              border: '1px solid ' + (filters.category === cat ? 'var(--ink)' : 'var(--line)'),
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid & Filter Sidebar Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: filterOpen ? '240px 1fr' : '1fr', gap: '24px' }}>
        {/* Sidebar Filters */}
        {filterOpen && (
          <div className="card-clean animate-fade-in" style={{ padding: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Refine Search</h3>
              <button
                onClick={resetFilters}
                style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}
              >
                Clear
              </button>
            </div>

            {/* Brand Filter */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
                Brand
              </label>
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                style={{ width: '100%', height: '36px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 8px', fontSize: '13px' }}
              >
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
                Size
              </label>
              <select
                value={filters.size}
                onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                style={{ width: '100%', height: '36px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 8px', fontSize: '13px' }}
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Distance Radius Slider */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                <span>Max Distance</span>
                <span style={{ color: 'var(--ink)' }}>{filters.maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={filters.maxDistanceKm}
                onChange={(e) => setFilters({ ...filters, maxDistanceKm: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#203D43' }}
              />
            </div>

            {/* Max Points Slider */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                <span>Max ReWear Points</span>
                <span style={{ color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '4px' }}><PointsIcon size={12} color="#203D43" />{filters.maxPoints} pts</span>
              </div>
              <input
                type="range"
                min="200"
                max="2000"
                step="50"
                value={filters.maxPoints}
                onChange={(e) => setFilters({ ...filters, maxPoints: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#203D43' }}
              />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '13px', color: 'var(--muted)' }}>
            <span>Showing <strong>{filteredProducts.length}</strong> items nearby</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div
              className="card-clean"
              style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>No items matched your filters</h3>
              <p style={{ fontSize: '14px', marginTop: '6px' }}>Try widening your distance radius or clearing selected category filters.</p>
              <button className="btn-secondary" style={{ marginTop: '16px' }} onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() => onSelectProduct(p)}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
