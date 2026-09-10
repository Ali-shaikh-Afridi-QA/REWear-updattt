import React from 'react'
import { UXStateMode } from '../types'
import { AlertTriangle, MapPinOff, WifiOff, CheckCircle2, Clock, ShieldAlert } from 'lucide-react'

interface UXStatesBarProps {
  currentUXState: UXStateMode
  setUXState: (mode: UXStateMode) => void
}

export const UXStatesBar: React.FC<UXStatesBarProps> = ({ currentUXState, setUXState }) => {
  return (
    <div
      style={{
        background: '#162E33',
        color: '#fff',
        padding: '8px 16px',
        fontSize: '12px',
        borderBottom: '1px solid rgba(205, 255, 155, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        zIndex: 90,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ background: '#CDFF9B', color: '#203D43', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
          UX SIMULATOR
        </span>
        <span style={{ fontWeight: 700, color: '#CDFF9B' }}>Section 23 UX States Tester:</span>
      </div>

      <select
        value={currentUXState}
        onChange={(e) => setUXState(e.target.value as UXStateMode)}
        style={{
          background: 'rgba(255,255,255,0.12)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '6px',
          padding: '4px 10px',
          fontSize: '12px',
          fontWeight: 700,
          outline: 0,
          cursor: 'pointer',
        }}
      >
        <option value="none" style={{ color: '#000' }}>State: Normal App Operation</option>
        <option value="loading" style={{ color: '#000' }}>State 1: Loading Skeleton View</option>
        <option value="no_nearby" style={{ color: '#000' }}>State 2: No Nearby Clothes Empty State</option>
        <option value="no_search" style={{ color: '#000' }}>State 3: No Search Results</option>
        <option value="insufficient_points" style={{ color: '#000' }}>State 4: Insufficient Points Notice</option>
        <option value="item_reserved" style={{ color: '#000' }}>State 5: Item Already Reserved</option>
        <option value="listing_expired" style={{ color: '#000' }}>State 6: Listing Expired</option>
        <option value="upload_failed" style={{ color: '#000' }}>State 7: Photo Upload Failed</option>
        <option value="network_error" style={{ color: '#000' }}>State 8: Network Error Offline Banner</option>
        <option value="location_denied" style={{ color: '#000' }}>State 9: Location Permission Denied</option>
        <option value="delivery_unavailable" style={{ color: '#000' }}>State 10: Delivery Unavailable</option>
        <option value="delivery_fee_pending" style={{ color: '#000' }}>State 11: Delivery Fee Pending</option>
        <option value="dispute_in_progress" style={{ color: '#000' }}>State 12: Dispute In Progress Banner</option>
        <option value="success_confirmation" style={{ color: '#000' }}>State 13: Success Confirmation Modal</option>
      </select>
    </div>
  )
}

export const RenderUXStateOverlay: React.FC<{
  mode: UXStateMode
  onClose: () => void
}> = ({ mode, onClose }) => {
  if (mode === 'none') return null

  if (mode === 'network_error') {
    return (
      <div
        style={{
          background: '#C62828',
          color: '#fff',
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <WifiOff size={16} />
        <span>Network Error: Connection lost. Reconnecting to ReWear Escrow servers...</span>
        <button onClick={onClose} style={{ color: '#fff', textDecoration: 'underline', marginLeft: '12px' }}>Dismiss</button>
      </div>
    )
  }

  if (mode === 'location_denied') {
    return (
      <div
        style={{
          background: '#FFF3E0',
          borderBottom: '1px solid #FFE0B2',
          color: '#E65100',
          padding: '12px 16px',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPinOff size={18} />
          <span>Location Permission Denied. Showing default Pune area listings.</span>
        </div>
        <button
          className="btn-primary"
          style={{ padding: '4px 12px', fontSize: '11px', background: '#E65100' }}
          onClick={onClose}
        >
          Enter Location Manually
        </button>
      </div>
    )
  }

  if (mode === 'dispute_in_progress') {
    return (
      <div
        style={{
          background: '#FFF8E1',
          borderBottom: '1px solid #FFE082',
          color: '#8D6E63',
          padding: '12px 16px',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} color="#D84315" />
          <span style={{ color: '#D84315' }}>Dispute in Progress (Case #DSP-88192): Points hold frozen pending review.</span>
        </div>
        <button onClick={onClose} style={{ fontSize: '11px', fontWeight: 700 }}>Dismiss Banner</button>
      </div>
    )
  }

  if (mode === 'success_confirmation') {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '32px', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="#203D43" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '22px', fontWeight: 800 }}>Success Confirmation!</h3>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px', marginBottom: '20px' }}>
            Your action was processed successfully. Points held in escrow and notified to both swappers.
          </p>
          <button className="btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    )
  }

  if (mode === 'insufficient_points') {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
          <AlertTriangle size={44} color="#E75A5A" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--rose)' }}>Insufficient ReWear Points</h3>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px', marginBottom: '20px' }}>
            You need <strong>750 Points</strong> for this exchange but currently have <strong>300 Points</strong> available.
          </p>
          <button className="btn-primary" onClick={onClose}>
            Earn Points via Cashify Valuation
          </button>
        </div>
      </div>
    )
  }

  return null
}
