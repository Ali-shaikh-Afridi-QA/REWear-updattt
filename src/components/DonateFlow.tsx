import React, { useState } from 'react'
import { User } from '../types'

interface DonateFlowProps {
  user: User
  onCompleteDonation: () => void
  onCancel: () => void
}

export const DonateFlow: React.FC<DonateFlowProps> = ({
  user,
  onCompleteDonation,
  onCancel,
}) => {
  const [submitted, setSubmitted] = useState(false)
  const [clothingCount, setClothingCount] = useState(3)
  const [ngoPartner, setNgoPartner] = useState('Goonj NGO')

  const handleConfirm = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: '640px', margin: '30px auto', padding: '0 16px' }}>
        <div className="card-clean animate-fade-in" style={{ padding: '36px', textAlign: 'center' }}>
          <div className="badge-lime" style={{ marginBottom: '12px' }}>DONATION CONFIRMED</div>
          <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Thank You for Giving Back!</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '8px', marginBottom: '20px' }}>
            Your donation of <strong>{clothingCount} garments</strong> to <strong>{ngoPartner}</strong> has been registered.
          </p>

          <div style={{ background: 'var(--lime-soft)', border: '1px solid #C4EAA2', padding: '16px', borderRadius: '12px', marginBottom: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
              Earned +400 Eco Karma Reward Points!
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
              Drop-off code: <strong>RW-DON-9921</strong> (Valid at any nearby {ngoPartner} collection box)
            </div>
          </div>

          <button className="btn-primary" onClick={onCompleteDonation}>
            Back to Wallet & Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '720px', margin: '30px auto', padding: '0 16px 80px' }}>
      <div className="card-clean animate-fade-in" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Donate Wearable Clothing</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Direct social impact with verified NGO partners in Pune</p>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Number of Garments to Donate
            </label>
            <select
              value={clothingCount}
              onChange={(e) => setClothingCount(Number(e.target.value))}
              style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '14px' }}
            >
              <option value={1}>1 Item</option>
              <option value={3}>3 Items (Standard Bundle)</option>
              <option value={5}>5 Items (Large Box)</option>
              <option value={10}>10+ Items (Wardrobe Clearance)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Select Verified NGO Partner
            </label>
            <select
              value={ngoPartner}
              onChange={(e) => setNgoPartner(e.target.value)}
              style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '14px' }}
            >
              <option value="Goonj NGO">Goonj NGO — Clothes for Work Initiative</option>
              <option value="Clothes Box Foundation">Clothes Box Foundation — Winter Warmth Drive</option>
              <option value="Robin Hood Army">Robin Hood Army — Local Pune Chapter</option>
            </select>
          </div>

          <div style={{ background: 'var(--bg-cream)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: 'var(--muted)' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Wearability Pledge</div>
            Donated clothes must be clean, washed, and structurally wearable without severe tears or major missing zippers.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={handleConfirm}>
            Confirm Donation & Earn Points
          </button>
        </div>
      </div>
    </div>
  )
}
