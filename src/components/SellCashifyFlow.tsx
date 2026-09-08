import React, { useState } from 'react'
import { ValuationQuestionnaire, Product, User } from '../types'

interface SellCashifyFlowProps {
  user: User
  onCompleteListing: (newProduct: Product) => void
  onCancel: () => void
}

const CATEGORIES = ['Jackets', 'T-Shirts', 'Shirts', 'Dresses', 'Jeans', 'Shoes', 'Hoodies', 'Ethnic']
const BRANDS = ["Levi's", 'Zara', 'Nike', 'H&M', 'Adidas', 'Uniqlo', 'Mango', 'Puma', 'Other / Local']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'UK 6', 'UK 7', 'UK 8']
const AGES = ['< 6 months', '6–12 months', '1–2 years', '2+ years']
const CONDITIONS = [
  { label: 'Brand New with Tags', desc: 'Unworn with original price tag intact', multiplier: 1.2 },
  { label: 'Like New', desc: 'Worn 1-2 times, no visible signs of wear', multiplier: 1.0 },
  { label: 'Excellent', desc: 'Lightly worn, minor gentle wash wear', multiplier: 0.85 },
  { label: 'Good', desc: 'Regularly worn, fully functional with minor flaws', multiplier: 0.7 },
  { label: 'Well Worn', desc: 'Visible fading or wear, suitable for casual use', multiplier: 0.5 },
]

const DEFECT_OPTIONS = [
  'Minor fabric fading',
  'Stain/spot (< 1cm)',
  'Loose thread or stitching',
  'Slight zipper stickiness',
  'Missing inner label',
  'Minor collar crease',
  'No defects whatsoever',
]

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
]

export const SellCashifyFlow: React.FC<SellCashifyFlowProps> = ({
  user,
  onCompleteListing,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1)
  const [formData, setFormData] = useState<ValuationQuestionnaire>({
    mode: 'sell',
    category: 'Jackets',
    brand: "Levi's",
    size: 'M',
    age: '6–12 months',
    overallCondition: 'Like New',
    defects: [],
    photos: [SAMPLE_PHOTOS[0], SAMPLE_PHOTOS[1]],
    estimatedPoints: 750,
  })

  const calculatePoints = () => {
    let base = 500
    if (formData.brand === "Levi's" || formData.brand === 'Nike' || formData.brand === 'Adidas') base = 700
    if (formData.category === 'Jackets' || formData.category === 'Shoes') base += 200
    if (formData.category === 'Dresses') base += 100

    const cond = CONDITIONS.find((c) => c.label === formData.overallCondition)
    const mult = cond ? cond.multiplier : 1.0

    let defectPenalty = formData.defects.length * 40
    if (formData.defects.includes('No defects whatsoever')) defectPenalty = 0

    const finalPts = Math.max(200, Math.round(base * mult - defectPenalty))
    return finalPts
  }

  const handleNext = () => {
    if (step === 9) {
      const pts = calculatePoints()
      setFormData((prev) => ({ ...prev, estimatedPoints: pts }))
    }
    setStep((s) => Math.min(11, s + 1))
  }

  const handlePrev = () => setStep((s) => Math.max(1, s - 1))

  const toggleDefect = (item: string) => {
    if (item === 'No defects whatsoever') {
      setFormData((prev) => ({ ...prev, defects: ['No defects whatsoever'] }))
      return
    }
    setFormData((prev) => {
      const filtered = prev.defects.filter((d) => d !== 'No defects whatsoever')
      const exists = filtered.includes(item)
      return {
        ...prev,
        defects: exists ? filtered.filter((d) => d !== item) : [...filtered, item],
      }
    })
  }

  const handlePublish = () => {
    const newProduct: Product = {
      id: Date.now(),
      title: `${formData.brand} ${formData.category} (${formData.overallCondition})`,
      brand: formData.brand,
      category: formData.category,
      size: formData.size,
      gender: 'Unisex',
      condition: formData.overallCondition as any,
      defects: formData.defects.filter((d) => d !== 'No defects whatsoever'),
      points: formData.estimatedPoints,
      distance: '0.4 km',
      distanceKm: 0.4,
      seller: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || '',
        rating: user.rating,
        location: user.location,
        exchangesCount: user.successfulExchanges,
        joinedDate: '2024',
      },
      images: formData.photos,
      description: `Verified listing through Cashify valuation flow. Age: ${formData.age}. Condition: ${formData.overallCondition}.`,
      pickupType: 'both',
      createdAt: 'Just now',
      status: 'active',
    }

    onCompleteListing(newProduct)
  }

  return (
    <div style={{ maxWidth: '840px', margin: '20px auto', padding: '0 16px 80px' }}>
      {/* Step Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={step === 1 ? onCancel : handlePrev}
          style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)' }}
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>

        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>
          Cashify Valuation Wizard • Step {step} of 11
        </div>

        <button onClick={onCancel} style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
          Exit
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '6px', background: 'var(--line)', borderRadius: '3px', marginBottom: '24px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${(step / 11) * 100}%`,
            background: 'var(--ink)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* STEP 1: Sell vs Donate */}
      {step === 1 && (
        <div className="card-clean animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>What would you like to do?</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
            Choose whether to exchange your item for ReWear Points or donate it directly to a verified NGO partner.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div
              onClick={() => setFormData({ ...formData, mode: 'sell' })}
              style={{
                border: '2px solid ' + (formData.mode === 'sell' ? 'var(--ink)' : 'var(--line)'),
                borderRadius: '14px',
                padding: '20px',
                cursor: 'pointer',
                background: formData.mode === 'sell' ? 'var(--lime-soft)' : '#fff',
              }}
            >
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>Sell for Points</h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                List your clothing on the ReWear Marketplace and receive points when a buyer claims it.
              </p>
            </div>

            <div
              onClick={() => setFormData({ ...formData, mode: 'donate' })}
              style={{
                border: '2px solid ' + (formData.mode === 'donate' ? 'var(--ink)' : 'var(--line)'),
                borderRadius: '14px',
                padding: '20px',
                cursor: 'pointer',
                background: formData.mode === 'donate' ? 'var(--lime-soft)' : '#fff',
              }}
            >
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>Donate to NGO</h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Donate directly to Goonj or Clothes Box Foundation and receive Eco Karma Reward Points.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Category */}
      {step === 2 && (
        <div className="card-clean animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Select Garment Category</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
            Which category best describes your clothing item?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFormData({ ...formData, category: cat })}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '2px solid ' + (formData.category === cat ? 'var(--ink)' : 'var(--line)'),
                  background: formData.category === cat ? 'var(--lime)' : '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  color: 'var(--ink)',
                  textAlign: 'center',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Brand */}
      {step === 3 && (
        <div className="card-clean animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Select Brand</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
            Known brand garments carry higher points valuation due to standardized sizing.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => setFormData({ ...formData, brand: b })}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '2px solid ' + (formData.brand === b ? 'var(--ink)' : 'var(--line)'),
                  background: formData.brand === b ? 'var(--lime)' : '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  color: 'var(--ink)',
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Size */}
      {step === 4 && (
        <div className="card-clean animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Select Size</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
            What size tag is listed on the collar or washing instruction label?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '12px' }}>
            {SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setFormData({ ...formData, size: sz })}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '2px solid ' + (formData.size === sz ? 'var(--ink)' : 'var(--line)'),
                  background: formData.size === sz ? 'var(--lime)' : '#fff',
                  fontWeight: 800,
                  fontSize: '15px',
                  color: 'var(--ink)',
                }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: Age */}
      {step === 5 && (
        <div className="card-clean animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>How old is this garment?</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
            Approximate time since original purchase.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {AGES.map((ag) => (
              <button
                key={ag}
                onClick={() => setFormData({ ...formData, age: ag })}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '2px solid ' + (formData.age === ag ? 'var(--ink)' : 'var(--line)'),
                  background: formData.age === ag ? 'var(--lime-soft)' : '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: 'var(--ink)',
                  textAlign: 'left',
                }}
              >
                {ag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: Overall Condition */}
      {step === 6 && (
        <div className="card-clean animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Overall Garment Condition</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
            Be as honest as possible. Buyers inspect items during meetup/delivery.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CONDITIONS.map((c) => (
              <div
                key={c.label}
                onClick={() => setFormData({ ...formData, overallCondition: c.label })}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '2px solid ' + (formData.overallCondition === c.label ? 'var(--ink)' : 'var(--line)'),
                  background: formData.overallCondition === c.label ? 'var(--lime-soft)' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>{c.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 7: Defects Checklist */}
      {step === 7 && (
        <div className="card-clean animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Defect & Disclosures Checklist</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
            Select any minor flaws. Disclosing defects builds top-rated seller status!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {DEFECT_OPTIONS.map((item) => {
              const selected = formData.defects.includes(item)
              return (
                <div
                  key={item}
                  onClick={() => toggleDefect(item)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid ' + (selected ? 'var(--ink)' : 'var(--line)'),
                    background: selected ? (item === 'No defects whatsoever' ? 'var(--lime-soft)' : '#FDF0F0') : '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--ink)',
                  }}
                >
                  {item}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* STEP 8: Photo Upload */}
      {step === 8 && (
        <div className="card-clean animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Upload Photos</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
            Include overall front, back, brand tag, and any disclosed defects.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            {formData.photos.map((p, idx) => (
              <div key={idx} style={{ height: '120px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                  {idx === 0 ? 'Cover Photo' : `Photo ${idx + 1}`}
                </span>
              </div>
            ))}

            <div
              style={{
                height: '120px',
                borderRadius: '10px',
                border: '2px dashed var(--muted-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'var(--bg-cream)',
                color: 'var(--muted)',
                fontSize: '13px',
                fontWeight: 700,
              }}
              onClick={() => {
                if (formData.photos.length < SAMPLE_PHOTOS.length) {
                  setFormData({ ...formData, photos: [...formData.photos, SAMPLE_PHOTOS[formData.photos.length]] })
                }
              }}
            >
              + Add Photo
            </div>
          </div>
        </div>
      )}

      {/* STEP 9: Review Answers */}
      {step === 9 && (
        <div className="card-clean animate-fade-in" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Review Garment Details</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
            Confirm your responses before calculating final valuation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '13px', background: 'var(--bg-cream)', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
            <div><span style={{ color: 'var(--muted)' }}>Category:</span> <strong>{formData.category}</strong></div>
            <div><span style={{ color: 'var(--muted)' }}>Brand:</span> <strong>{formData.brand}</strong></div>
            <div><span style={{ color: 'var(--muted)' }}>Size:</span> <strong>{formData.size}</strong></div>
            <div><span style={{ color: 'var(--muted)' }}>Age:</span> <strong>{formData.age}</strong></div>
            <div><span style={{ color: 'var(--muted)' }}>Condition:</span> <strong>{formData.overallCondition}</strong></div>
            <div><span style={{ color: 'var(--muted)' }}>Disclosed Defects:</span> <strong>{formData.defects.join(', ') || 'None'}</strong></div>
          </div>
        </div>
      )}

      {/* STEP 10: Valuation Result Screen */}
      {step === 10 && (
        <div className="card-clean animate-fade-in" style={{ padding: '36px', textAlign: 'center', background: 'linear-gradient(180deg, #FFFFFF 0%, #F4FAF0 100%)' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            VALUATION CALCULATED
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '4px' }}>Your Estimated Value</h2>

          <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--ink)', margin: '16px 0 8px' }}>
            {formData.estimatedPoints} <span style={{ fontSize: '18px', color: 'var(--muted)', fontWeight: 600 }}>ReWear Points</span>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 28px' }}>
            Based on brand popularity (<strong>{formData.brand}</strong>), <strong>{formData.overallCondition}</strong> condition rating, and size demand.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => setStep(6)}>
              Edit Answers
            </button>
            <button className="btn-primary" onClick={handleNext}>
              Confirm & Continue to List
            </button>
          </div>
        </div>
      )}

      {/* STEP 11: Confirm & List */}
      {step === 11 && (
        <div className="card-clean animate-fade-in" style={{ padding: '36px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Ready to Publish Listing</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 28px' }}>
            Your item will be immediately discoverable to buyers in <strong>{user.location}</strong> for <strong>{formData.estimatedPoints} ReWear Points</strong>.
          </p>

          <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }} onClick={handlePublish}>
            Publish Listing Now
          </button>
        </div>
      )}

      {/* Clean Navigation Footer without button icons */}
      {step < 10 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button className="btn-secondary" onClick={step === 1 ? onCancel : handlePrev}>
            Back
          </button>
          <button className="btn-primary" onClick={handleNext}>
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
