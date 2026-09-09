import React, { useState } from 'react'
import { User } from '../types'
import { apiService } from '../services/apiService'

interface DonateFlowProps {
  user: User
  onCompleteDonation: (points: number) => void
  onSubmitDonation?: (data: Parameters<typeof apiService.submitDonation>[0]) => Promise<number>
  onCancel: () => void
}

export const DonateFlow: React.FC<DonateFlowProps> = ({
  user,
  onCompleteDonation,
  onSubmitDonation,
  onCancel,
}) => {
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(1)
  const [clothingCount, setClothingCount] = useState(3)
  const [ngoPartner, setNgoPartner] = useState('Goonj NGO')
  const [conditionChecks, setConditionChecks] = useState<string[]>(['Washed and clean', 'No major tears'])
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
  ])
  const [categoryId, setCategoryId] = useState('')
  const [rewardPoints, setRewardPoints] = useState(0)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const estimatedPoints = 400 + clothingCount * 40

  React.useEffect(() => {
    apiService.getCategories({ limit: 1 })
      .then((items) => setCategoryId(items[0]?.id || ''))
      .catch(() => undefined)
  }, [])

  const toggleCheck = (value: string) => {
    setConditionChecks((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value])
  }

  const handleConfirm = async () => {
    setError('')
    setIsSubmitting(true)
    let finalPoints = estimatedPoints

    if (onSubmitDonation) {
      if (!categoryId) {
        setError('Donation categories are unavailable right now. Please try again shortly.')
        setIsSubmitting(false)
        return
      }

      try {
        finalPoints = await onSubmitDonation({
          title: `${clothingCount} garment donation to ${ngoPartner}`,
          description: `Donation bundle submitted through ReWear. Partner: ${ngoPartner}. Condition checks: ${conditionChecks.join(', ')}.`,
          category_id: categoryId,
          age: 1,
          condition: conditionChecks.includes('Washed and clean') && conditionChecks.includes('No major tears') ? 'good' : 'fair',
          questionnaire: {
            brand: 'none',
            stains: false,
            tears: !conditionChecks.includes('No major tears'),
            fading: false,
            zip_condition: conditionChecks.includes('No broken zips'),
            buttons: true,
            stitching: conditionChecks.includes('Valid for reuse'),
            other_defects: false,
          },
          idempotency_key: `rewear-donation-${Date.now()}`,
        })
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : 'Unable to submit donation right now.')
        setIsSubmitting(false)
        return
      }
    }

    setRewardPoints(finalPoints)
    setSubmitted(true)
    setIsSubmitting(false)
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
              Earned +{rewardPoints || estimatedPoints} Eco Karma Reward Points!
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
              Drop-off code: <strong>RW-DON-9921</strong> (Valid at any nearby {ngoPartner} collection box)
            </div>
          </div>

          <button className="btn-primary" onClick={() => onCompleteDonation(rewardPoints || estimatedPoints)}>
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
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Donation Flow • Step {step} of 4
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Donate Wearable Clothing</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Direct social impact with verified NGO partners in Pune</p>
        </div>

        {error && <div style={{ background: '#FDF0F0', border: '1px solid #F5C6C6', color: 'var(--rose)', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>{error}</div>}

        {step === 1 && (
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
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: 'var(--bg-cream)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: 'var(--muted)' }}>
              <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Wearability Pledge</div>
              Donated clothes must be clean, washed, and structurally wearable without severe tears or major missing zippers.
            </div>

            {['Washed and clean', 'No major tears', 'No broken zips', 'Valid for reuse'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleCheck(item)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${conditionChecks.includes(item) ? 'var(--ink)' : 'var(--line)'}`,
                  background: conditionChecks.includes(item) ? 'var(--lime-soft)' : '#fff',
                  fontWeight: 700,
                  color: 'var(--ink)',
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {photos.map((photo, index) => (
                <div key={index} style={{ position: 'relative', height: '120px', borderRadius: '10px', overflow: 'hidden' }}>
                  <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== index))}
                    style={{ position: 'absolute', top: '6px', right: '6px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff' }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => [...prev, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'])}
                  style={{
                    height: '120px',
                    borderRadius: '10px',
                    border: '2px dashed var(--line)',
                    background: 'var(--bg-cream)',
                    color: 'var(--muted)',
                    fontWeight: 700,
                  }}
                >
                  + Add Photo
                </button>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--lime-soft)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Estimated reward</div>
              <div style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0' }}>{estimatedPoints} Points</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Based on item count and condition quality.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '13px' }}>
              <div><span style={{ color: 'var(--muted)' }}>Partner:</span> <strong>{ngoPartner}</strong></div>
              <div><span style={{ color: 'var(--muted)' }}>Items:</span> <strong>{clothingCount}</strong></div>
              <div><span style={{ color: 'var(--muted)' }}>Condition:</span> <strong>{conditionChecks.join(', ') || 'Reviewed'}</strong></div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={step === 1 ? onCancel : () => setStep((prev) => Math.max(1, prev - 1))}>
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step < 4 ? (
            <button className="btn-primary" onClick={() => setStep((prev) => prev + 1)}>
              Continue
            </button>
          ) : (
            <button className="btn-primary" disabled={isSubmitting} onClick={handleConfirm}>
              {isSubmitting ? 'Submitting Donation...' : 'Confirm Donation & Earn Points'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
