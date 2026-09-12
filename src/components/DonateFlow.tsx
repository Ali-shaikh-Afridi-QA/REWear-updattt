import React, { useEffect, useState } from 'react'
import { User } from '../types'
import { PointsIcon } from './PointsIcon'
import { apiService, CatalogItem } from '../services/apiService'

interface DonateFlowProps {
  user: User
  onCompleteDonation: () => void
  onCancel: () => void
}

const NGO_DETAILS: Record<string, { address: string; time: string; phone: string; impact: string }> = {
  'Goonj NGO': {
    address: 'Goonj Collection Center, Flat 4, Model Colony, Pune',
    time: 'Mon–Sat: 10:00 AM – 6:00 PM',
    phone: '+91 98230 44551',
    impact: 'Repackaged for rural community disaster relief & employment drives.',
  },
  'Clothes Box Foundation': {
    address: 'Clothes Box Hub, Lane 6, Koregaon Park, Pune',
    time: 'Daily: 9:00 AM – 8:00 PM',
    phone: '+91 97640 11223',
    impact: 'Distributed to night shelters and underprivileged school children.',
  },
  'Robin Hood Army': {
    address: 'RHA Community Desk, Swargate Bus Stand, Pune',
    time: 'Sun: 11:00 AM – 4:00 PM',
    phone: '+91 99221 88776',
    impact: 'Handed directly to local street families in Pune.',
  },
}

export const DonateFlow: React.FC<DonateFlowProps> = ({
  user,
  onCompleteDonation,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1)
  const [clothingCount, setClothingCount] = useState(3)
  const [ngoPartner, setNgoPartner] = useState('Goonj NGO')
  const [isWashed, setIsWashed] = useState(true)
  const [isWearable, setIsWearable] = useState(true)
  const [hasMajorTears, setHasMajorTears] = useState(false)
  const [categories, setCategories] = useState<CatalogItem[]>([])
  const [rewardPoints, setRewardPoints] = useState(0)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=400&q=80',
  ])

  useEffect(() => {
    apiService.getCategories({ limit: 200 }).then(setCategories).catch(() => setError('Unable to load donation categories.'))
  }, [])

  const handleConfirm = async () => {
    const categoryId = categories[0]?.id
    if (!categoryId) {
      setError('A donation category is required. Please try again.')
      return
    }

    setIsSubmitting(true)
    setError('')
    try {
      const donation = await apiService.submitDonation({
        title: `${clothingCount} garment donation`,
        description: `Donation to ${ngoPartner}. Washed: ${isWashed}. Wearable: ${isWearable}.`,
        category_id: categoryId,
        age: 1,
        condition: hasMajorTears ? 'fair' : 'good',
        questionnaire: {
          stains: false,
          tears: hasMajorTears,
          fading: false,
          zip_condition: true,
          buttons: true,
          stitching: !hasMajorTears,
          other_defects: false,
        },
        idempotency_key: crypto.randomUUID(),
      })
      setRewardPoints(typeof donation.reward_points === 'number' ? donation.reward_points : 0)
      setStep(3)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to register donation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedNgoInfo = NGO_DETAILS[ngoPartner] || NGO_DETAILS['Goonj NGO']

  if (step === 3) {
    return (
      <div style={{ maxWidth: '680px', margin: '30px auto', padding: '0 16px 80px' }}>
        <div className="card-clean animate-fade-in" style={{ padding: '36px', textAlign: 'center' }}>
          <div className="badge-lime" style={{ marginBottom: '12px' }}>DONATION CONFIRMED</div>
          <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Thank You for Giving Back!</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '8px', marginBottom: '20px' }}>
            Your donation of <strong>{clothingCount} garments</strong> to <strong>{ngoPartner}</strong> has been registered.
          </p>

          {/* Reward Points Box */}
          <div style={{ background: 'var(--lime-soft)', border: '1px solid #C4EAA2', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ECO KARMA REWARD POINTS
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '4px 0' }}>
              <PointsIcon size={28} color="#203D43" />
              <span>+{rewardPoints} Points</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Added directly to your ReWear Points Wallet balance
            </div>
          </div>

          {/* Receiver / Fulfillment Info */}
          <div style={{ textAlign: 'left', background: 'var(--bg-cream)', padding: '18px', borderRadius: '12px', marginBottom: '28px', border: '1px solid var(--line)', fontSize: '13px' }}>
            <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: '15px', marginBottom: '8px' }}>
              Fulfillment & Drop-Off Instructions
            </div>
            <div style={{ marginBottom: '4px', color: 'var(--muted)' }}>
              <strong>Center Address:</strong> {selectedNgoInfo.address}
            </div>
            <div style={{ marginBottom: '4px', color: 'var(--muted)' }}>
              <strong>Operating Hours:</strong> {selectedNgoInfo.time}
            </div>
            <div style={{ color: 'var(--muted)' }}>
              <strong>Helpline:</strong> {selectedNgoInfo.phone}
            </div>
          </div>

          <button className="btn-primary" style={{ padding: '14px 28px' }} onClick={onCompleteDonation}>
            Claim Points & Return to Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '760px', margin: '30px auto', padding: '0 16px 80px' }}>
      <div className="card-clean animate-fade-in" style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
          <div className="badge-lime" style={{ marginBottom: '8px' }}>DIRECT SOCIAL IMPACT</div>
          <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Donate Wearable Clothing</h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
            Donate pre-loved clothing to verified NGO partners in Pune and earn Eco Karma Reward Points.
          </p>
        </div>

        {step === 1 && (
          <div>
            {/* Step 1: Questionnaire */}
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>1. Donation Questionnaire & Quantity</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Number of Garments to Donate
                </label>
                <select
                  value={clothingCount}
                  onChange={(e) => setClothingCount(Number(e.target.value))}
                  style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '14px', outline: 0 }}
                >
                  <option value={1}>1 Item (+135 Pts)</option>
                  <option value={3}>3 Items — Standard Bundle</option>
                  <option value={5}>5 Items — Large Box (+675 Pts)</option>
                  <option value={10}>10+ Items — Wardrobe Clearance (+1,350 Pts)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Select Verified NGO Partner
                </label>
                <select
                  value={ngoPartner}
                  onChange={(e) => setNgoPartner(e.target.value)}
                  style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '14px', outline: 0 }}
                >
                  <option value="Goonj NGO">Goonj NGO — Clothes for Work Initiative</option>
                  <option value="Clothes Box Foundation">Clothes Box Foundation — Winter Warmth Drive</option>
                  <option value="Robin Hood Army">Robin Hood Army — Local Pune Chapter</option>
                </select>
              </div>

              {/* Condition Questionnaire Checks */}
              <div style={{ background: 'var(--bg-cream)', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '12px', color: 'var(--ink)' }}>
                  Wearability & Hygiene Questionnaire
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isWashed}
                      onChange={(e) => setIsWashed(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#203D43' }}
                    />
                    <span>Items have been freshly washed & sanitized prior to donation.</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isWearable}
                      onChange={(e) => setIsWearable(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#203D43' }}
                    />
                    <span>Items are structurally wearable for daily use (no severe mold or odor).</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!hasMajorTears}
                      onChange={(e) => setHasMajorTears(!e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#203D43' }}
                    />
                    <span>Free of major unwearable tears or missing main zippers.</span>
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={onCancel}>Cancel</button>
              <button className="btn-primary" onClick={() => setStep(2)}>
                Next: Upload Photos & View Rewards
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Step 2: Photo Upload & Review */}
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>2. Upload Photos & Verify Reward</h3>

            {/* Photo Grid */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Bundle Photos Preview (2-4 photos)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
                {photos.map((p, idx) => (
                  <div key={idx} style={{ height: '110px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                    <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '9px', padding: '2px 4px', borderRadius: '4px' }}>
                      Photo {idx + 1}
                    </span>
                  </div>
                ))}

                <div
                  style={{
                    height: '110px',
                    borderRadius: '10px',
                    border: '2px dashed var(--muted-light)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    background: 'var(--bg-cream)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--muted)',
                  }}
                  onClick={() => setPhotos([...photos, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=400&q=80'])}
                >
                  + Add Photo
                </div>
              </div>
            </div>

            {/* Estimated Reward Display */}
            <div style={{ background: 'var(--lime-soft)', border: '1px solid #C4EAA2', padding: '20px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                ESTIMATED REWARD POINTS
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '4px 0' }}>
                <PointsIcon size={32} color="#203D43" />
                <span>+{rewardPoints} Points</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Guaranteed points credited to your wallet upon drop-off code verification at {ngoPartner}.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              {error && <div style={{ color: 'var(--rose)', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>{error}</div>}
              <button className="btn-primary" disabled={isSubmitting} onClick={handleConfirm}>
                {isSubmitting ? 'Registering donation...' : 'Confirm Donation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

