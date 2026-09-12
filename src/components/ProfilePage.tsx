import React, { useState } from 'react'
import { User, Product } from '../types'
import { ProductCard } from './ProductCard'
import { X, Check } from 'lucide-react'

interface ProfilePageProps {
  user: User
  products: Product[]
  favorites: number[]
  onToggleFavorite: (id: number) => void
  onSelectProduct: (p: Product) => void
  onSignOut?: () => void
  onUpdateProfile?: (updatedUser: User) => Promise<void> | void
  onDeactivateAccount?: () => Promise<void> | void
  onPublishListing?: (product: Product) => Promise<void> | void
  onCancelListing?: (product: Product) => Promise<void> | void
  onDeleteListing?: (product: Product) => Promise<void> | void
  onUpdateListing?: (product: Product, data: { title: string; description: string }) => Promise<void>
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  products,
  favorites,
  onToggleFavorite,
  onSelectProduct,
  onSignOut,
  onUpdateProfile,
  onDeactivateAccount,
  onPublishListing,
  onCancelListing,
  onDeleteListing,
  onUpdateListing,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'favorites' | 'badges'>('listings')
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email || '')
  const [location, setLocation] = useState(user.location || '')
  const [avatar, setAvatar] = useState(user.avatar || '')
  const [isSaving, setIsSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [listingTitle, setListingTitle] = useState('')
  const [listingDescription, setListingDescription] = useState('')
  const [listingSaving, setListingSaving] = useState(false)

  const savedProducts = products.filter((p) => favorites.includes(p.id))

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError('')
    const updated: User = {
      ...user,
      name,
      email,
      location,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    }
    if (onUpdateProfile) {
      setIsSaving(true)
      try {
        await onUpdateProfile(updated)
      } catch (error) {
        setProfileError(error instanceof Error ? error.message : 'Unable to save profile changes.')
        setIsSaving(false)
        return
      } finally {
        setIsSaving(false)
      }
    }
    setIsEditing(false)
  }

  const handleDeactivateAccount = async () => {
    if (!onDeactivateAccount || !window.confirm('Deactivate your ReWear account? You can contact support to restore it later.')) return
    setIsSaving(true)
    setProfileError('')
    try {
      await onDeactivateAccount()
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Unable to deactivate your account.')
      setIsSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 16px 80px' }}>
      {/* Profile Header */}
      <div
        className="card-clean"
        style={{
          padding: '28px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--lime)' }}
        />

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{user.name}</h1>
            <span className="badge-lime">Verified Swapper</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--muted)', marginTop: '4px', flexWrap: 'wrap' }}>
            <span>{user.location}</span>
            <span>Member since {user.memberSince}</span>
            <span style={{ color: 'var(--ink)', fontWeight: 700 }}>
              ★ {user.rating} ({user.ratingCount} reviews)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
          {onSignOut && (
            <button
              className="btn-secondary"
              onClick={onSignOut}
              style={{ color: '#d93025', borderColor: '#fce8e6', background: '#fce8e6' }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Reputation Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card-clean" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>{user.successfulExchanges}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>Successful Swaps</div>
        </div>

        <div className="card-clean" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>{user.donationsCompleted}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>Donations Completed</div>
        </div>

        <div className="card-clean" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>{user.itemsListed}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>Items Listed</div>
        </div>

        <div className="card-clean" style={{ padding: '20px', textAlign: 'center', background: 'var(--lime-soft)' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>{user.pointsBalance}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>ReWear Points Balance</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--line)', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('listings')}
          style={{
            padding: '12px 18px',
            fontWeight: 700,
            fontSize: '14px',
            borderBottom: activeTab === 'listings' ? '2px solid var(--ink)' : '2px solid transparent',
            color: activeTab === 'listings' ? 'var(--ink)' : 'var(--muted)',
            background: 'transparent',
            border: 0,
          }}
        >
          My Listed Items ({products.filter((p) => p.seller.name === user.name).length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          style={{
            padding: '12px 18px',
            fontWeight: 700,
            fontSize: '14px',
            borderBottom: activeTab === 'favorites' ? '2px solid var(--ink)' : '2px solid transparent',
            color: activeTab === 'favorites' ? 'var(--ink)' : 'var(--muted)',
            background: 'transparent',
            border: 0,
          }}
        >
          Saved Favorites ({savedProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          style={{
            padding: '12px 18px',
            fontWeight: 700,
            fontSize: '14px',
            borderBottom: activeTab === 'badges' ? '2px solid var(--ink)' : '2px solid transparent',
            color: activeTab === 'badges' ? 'var(--ink)' : 'var(--muted)',
            background: 'transparent',
            border: 0,
          }}
        >
          Reputation Badges ({user.badges.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'listings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {products
            .filter((p) => p.seller.name === user.name)
            .map((prod) => (
              <div key={prod.id}>
                <ProductCard
                  product={prod}
                  onClick={() => onSelectProduct(prod)}
                  isFavorite={favorites.includes(prod.id)}
                  onToggleFavorite={onToggleFavorite}
                />
                {prod.backendListingId && (onPublishListing || onCancelListing || onDeleteListing) && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {prod.status !== 'active' && onPublishListing && (
                      <button className="btn-secondary" style={{ padding: '6px 8px', fontSize: '11px' }} onClick={() => onPublishListing(prod)}>Publish</button>
                    )}
                    {prod.status === 'active' && onCancelListing && (
                      <button className="btn-secondary" style={{ padding: '6px 8px', fontSize: '11px' }} onClick={() => onCancelListing(prod)}>Cancel</button>
                    )}
                    {onDeleteListing && (
                      <button className="btn-secondary" style={{ padding: '6px 8px', fontSize: '11px', color: 'var(--rose)' }} onClick={() => onDeleteListing(prod)}>Delete</button>
                    )}
                    {onUpdateListing && (
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 8px', fontSize: '11px' }}
                        onClick={() => {
                          setEditingProduct(prod)
                          setListingTitle(prod.title)
                          setListingDescription(prod.description)
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                )}
                {editingProduct?.id === prod.id && onUpdateListing && (
                  <form
                    onSubmit={async (event) => {
                      event.preventDefault()
                      setListingSaving(true)
                      try {
                        await onUpdateListing(prod, {
                          title: listingTitle.trim(),
                          description: listingDescription.trim(),
                        })
                        setEditingProduct(null)
                      } finally {
                        setListingSaving(false)
                      }
                    }}
                    style={{ display: 'grid', gap: '8px', marginTop: '8px' }}
                  >
                    <input
                      value={listingTitle}
                      onChange={(event) => setListingTitle(event.target.value)}
                      required
                      placeholder="Listing title"
                    />
                    <textarea
                      value={listingDescription}
                      onChange={(event) => setListingDescription(event.target.value)}
                      required
                      rows={3}
                      placeholder="Listing description"
                    />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-primary" type="submit" disabled={listingSaving}>
                        {listingSaving ? 'Saving...' : 'Save changes'}
                      </button>
                      <button className="btn-secondary" type="button" onClick={() => setEditingProduct(null)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div>
          {savedProducts.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
              No saved items yet. Explore listings to save your favorite garments!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {savedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onClick={() => onSelectProduct(prod)}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'badges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {user.badges.map((badge, idx) => (
            <div
              key={idx}
              className="card-clean"
              style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--lime)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                  color: 'var(--ink)',
                }}
              >
                🌱
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>{badge}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Verified Community Credential</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14, 26, 28, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 300,
            padding: '16px',
          }}
        >
          <div
            className="card-clean animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '28px',
              background: '#fff',
              borderRadius: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>Edit Account Details</h2>
              <button
                onClick={() => setIsEditing(false)}
                style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {profileError && <div style={{ color: 'var(--rose)', background: '#FDF0F0', border: '1px solid #F5C6C6', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 700 }}>{profileError}</div>}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '13px', outline: 0 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '13px', outline: 0 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  City / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kothrud, Pune"
                  required
                  style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '13px', outline: 0 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '13px', outline: 0 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: isSaving ? 0.7 : 1 }}
                >
                  <Check size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>

              {onDeactivateAccount && (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleDeactivateAccount}
                  style={{ color: '#d93025', fontSize: '12px', fontWeight: 700, textAlign: 'center', padding: '8px' }}
                >
                  Deactivate Account
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
