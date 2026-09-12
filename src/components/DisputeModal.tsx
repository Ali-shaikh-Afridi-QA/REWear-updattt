import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Order, Product } from '../types'

interface DisputeModalProps {
  itemOrOrder: Order | Product
  onClose: () => void
  onSubmitDispute: (reason: string, details: string) => void | Promise<void>
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  itemOrOrder,
  onClose,
  onSubmitDispute,
}) => {
  const [problemType, setProblemType] = useState('Defect not disclosed in description')
  const [details, setDetails] = useState('')
  const [evidenceName, setEvidenceName] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!details.trim()) {
      setError('Please describe the problem before submitting.')
      return
    }

    setError('')
    await onSubmitDispute(problemType, details)
    setSubmitted(true)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '28px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Dispute / Report Filed</h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px', marginBottom: '20px' }}>
              Our Trust & Safety team will review your report and follow up through your ReWear account.
            </p>
            <button className="btn-primary" onClick={onClose}>Close Window</button>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>Report Issue / File Dispute</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
              Filing a dispute pauses points release from escrow until reviewed by ReWear support.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Select Problem Type
                </label>
                <select
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value)}
                  style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 10px', fontSize: '13px' }}
                >
                  <option value="Defect not disclosed in description">Undisclosed stain, tear, or damage</option>
                  <option value="Item not delivered or no-show at meetup">No-show at agreed meetup / missing package</option>
                  <option value="Wrong size or item sent">Wrong size / wrong item delivered</option>
                  <option value="Counterfeit or fake brand">Fake brand / counterfeit item tag</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Detailed Problem Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the discrepancy in detail..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--line)', padding: '10px', fontSize: '13px', outline: 0 }}
                />
              </div>

              {error && <div style={{ color: 'var(--rose)', fontSize: '12px', fontWeight: 700 }}>{error}</div>}

              <label style={{ border: '2px dashed var(--line)', borderRadius: '8px', padding: '14px', textAlign: 'center', background: 'var(--bg-cream)', color: 'var(--muted)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                {evidenceName ? `Evidence attached: ${evidenceName}` : '+ Attach Evidence Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEvidenceName(e.target.files?.[0]?.name || '')}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={handleSubmit}>
              Submit Dispute & Hold Escrow
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
