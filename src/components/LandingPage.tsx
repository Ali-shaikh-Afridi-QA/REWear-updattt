import React from 'react'
import { View, Product } from '../types'
import { ProductCard } from './ProductCard'

interface LandingPageProps {
  setView: (view: View) => void
  featuredProducts: Product[]
  onSelectProduct: (p: Product) => void
  favorites: number[]
  onToggleFavorite: (id: number) => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setView,
  featuredProducts,
  onSelectProduct,
  favorites,
  onToggleFavorite,
}) => {
  return (
    <div className="landing-wrapper" style={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #203D43 0%, #162E33 100%)',
          color: '#fff',
          padding: '60px 20px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(205, 255, 155, 0.12)',
                border: '1px solid rgba(205, 255, 155, 0.3)',
                padding: '6px 14px',
                borderRadius: '30px',
                color: '#CDFF9B',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '20px',
              }}
            >
              ReWear Circular Fashion Economy
            </div>

            <h1
              style={{
                fontSize: 'clamp(36px, 5vw, 60px)',
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: '-1.5px',
                marginBottom: '20px',
              }}
            >
              Give Clothes a <br />
              <span style={{ color: '#CDFF9B', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 500 }}>
                Second Life.
              </span>
            </h1>

            <p style={{ fontSize: '16px', color: '#B2C4C0', lineHeight: 1.6, marginBottom: '28px', maxWidth: '520px' }}>
              Exchange pre-loved wardrobe items seamlessly using <strong>ReWear Points</strong>. Cashify-style instant valuation, nearby local swaps, or 50/50 split delivery. Zero waste, total transparency.
            </p>

            {/* Clean Action Buttons without Icons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button className="btn-primary" onClick={() => setView('browse')}>
                Explore Nearby Clothes
              </button>
              <button
                className="btn-secondary"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
                onClick={() => setView('sell')}
              >
                Value & Sell Clothes
              </button>
              <button
                className="btn-secondary"
                style={{ background: 'transparent', color: '#CDFF9B', borderColor: 'rgba(205,255,155,0.3)' }}
                onClick={() => setView('donate')}
              >
                Donate to NGO
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#CDFF9B' }}>14,500+</div>
                <div style={{ fontSize: '12px', color: '#8E9F9B' }}>Garments Recirculated</div>
              </div>
              <div className="desktop-only" style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>98.4%</div>
                <div style={{ fontSize: '12px', color: '#8E9F9B' }}>Successful Swaps</div>
              </div>
              <div className="desktop-only" style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#CDFF9B' }}>4.9 ★</div>
                <div style={{ fontSize: '12px', color: '#8E9F9B' }}>User Trust Score</div>
              </div>
            </div>
          </div>

          {/* Hero Banner Visual */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '3px solid rgba(255,255,255,0.1)',
                maxHeight: '440px',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=85"
                alt="ReWear Fashion Exchange"
                style={{ width: '100%', height: '440px', objectFit: 'cover' }}
              />
            </div>

            <div
              className="card-clean"
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                padding: '12px 16px',
                maxWidth: '240px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Instant Cashify Valuation</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Get points in 60 seconds</div>
            </div>

            <div
              className="card-clean"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '10px 16px',
                background: 'var(--ink)',
                color: '#fff',
                borderColor: 'rgba(205,255,155,0.3)',
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              750 ReWear Points
            </div>
          </div>
        </div>
      </section>

      {/* How ReWear Works */}
      <section style={{ padding: '70px 20px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div className="badge-lime" style={{ marginBottom: '12px' }}>SIMPLE 3-STEP PROCESS</div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>How ReWear Works</h2>
          <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '6px' }}>Trade unused clothes for points or donate them for verified social impact.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div className="card-clean" style={{ padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--lime-soft)', color: 'var(--ink)', display: 'grid', placeItems: 'center', fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
              01
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Snap & Value Item</h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6 }}>
              Answer our guided 11-step Cashify questionnaire about brand, condition, and defects to get an instant ReWear Points valuation.
            </p>
          </div>

          <div className="card-clean" style={{ padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--lime-soft)', color: 'var(--ink)', display: 'grid', placeItems: 'center', fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
              02
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Exchange or Donate</h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6 }}>
              Choose a nearby meetup spot or request delivery with a transparent 50/50 fee split between buyer and seller.
            </p>
          </div>

          <div className="card-clean" style={{ padding: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--lime-soft)', color: 'var(--ink)', display: 'grid', placeItems: 'center', fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
              03
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Points Escrow Release</h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6 }}>
              Points are safely held in escrow and automatically unlocked to the seller once the buyer confirms receiving the item.
            </p>
          </div>
        </div>
      </section>

      {/* Featured / Nearby Clothes Grid */}
      <section style={{ padding: '0 20px 70px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>NEARBY DISCOVERY</div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px' }}>Fresh Nearby Listings</h2>
          </div>
          <button className="btn-secondary" onClick={() => setView('browse')}>
            View All Listings
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onSelectProduct(product)}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Environmental Impact Counter */}
      <section style={{ background: '#EBF3E7', padding: '60px 20px', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--ink)' }}>2,450,000 L</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px', fontWeight: 600 }}>Water Saved from Fabric Production</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--ink)' }}>18,200 kg</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px', fontWeight: 600 }}>CO2 Emissions Avoided</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--ink)' }}>6,800+</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px', fontWeight: 600 }}>Items Donated to Verified NGOs</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--ink)' }}>₹42 Lakhs</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px', fontWeight: 600 }}>Community Money Saved</div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section style={{ padding: '70px 20px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <div className="badge-lime" style={{ marginBottom: '12px' }}>TRUST & TRANSPARENCY</div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
              Built for Safe & Fair Peer-to-Peer Swapping
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              We've designed ReWear to eliminate common peer-to-peer marketplace anxieties with escrow points protection, mandatory condition defect disclosures, and public meetup verification.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Escrow Points Guarantee</h4>
                <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Points remain locked safely until you inspect and receive the garment.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Cashify Defect Disclosures</h4>
                <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Sellers must disclose stains, tears, fading, or zipper flaws up front.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>50/50 Split Courier Shipping</h4>
                <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Long distance deliveries automatically divide shipping fees 50/50.</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: '20px', padding: '36px' }}>
            <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '12px', color: '#CDFF9B' }}>
              Ready to clear out your closet?
            </h3>
            <p style={{ color: '#B2C4C0', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Join thousands of conscious fashion lovers in Pune & across India. Turn unwanted clothes into ReWear Points today.
            </p>
            <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={() => setView('sell')}>
              Start Cashify Valuation Flow
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--ink)', color: '#fff', padding: '50px 20px 30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: '#CDFF9B' }}>
              ReWear
            </div>
            <p style={{ color: '#8E9F9B', fontSize: '13px', lineHeight: 1.6 }}>
              India's premier circular fashion & garment exchange platform. Give every thread a purpose.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#CDFF9B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Marketplace</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#B2C4C0' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setView('browse')}>Discover Items</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setView('sell')}>Sell / Exchange Flow</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setView('donate')}>Donate to NGO</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setView('wallet')}>Points Wallet</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#CDFF9B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Safety & Support</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#B2C4C0' }}>
              <span>How Escrow Works</span>
              <span>Nearby Meetup Safety</span>
              <span>Dispute Resolution</span>
              <span>Help Center</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#CDFF9B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Legal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#B2C4C0' }}>
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
              <span>Contact Us</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#8E9F9B' }}>
          <div>© 2026 ReWear Circular Systems. All rights reserved.</div>
          <div>Sustainable Fashion Marketplace</div>
        </div>
      </footer>
    </div>
  )
}
