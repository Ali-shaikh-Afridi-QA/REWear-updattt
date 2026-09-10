import React, { useState } from 'react'
import { X } from 'lucide-react'
import { User, WalletTransaction } from '../types'
import { PointsIcon } from './PointsIcon'

interface WalletPageProps {
  user: User
  transactions: WalletTransaction[]
  onOpenSell: () => void
  onOpenDonate: () => void
}

export const WalletPage: React.FC<WalletPageProps> = ({
  user,
  transactions,
  onOpenSell,
  onOpenDonate,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'earned' | 'spent' | 'locked'>('all')
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null)

  const availablePoints = user.pointsBalance - user.lockedPoints

  const filteredTxs = transactions.filter((tx) => {
    if (filterType === 'all') return true
    return tx.type === filterType
  })

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 16px 80px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px' }}>ReWear Points Wallet</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Manage earned points, active escrow holds, and transaction history.</p>
      </div>

      {/* Main Balance Banner */}
      <div
        className="card-clean"
        style={{
          background: 'linear-gradient(135deg, #162E33 0%, #203D43 100%)',
          color: '#fff',
          padding: '28px',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '11px', color: '#CDFF9B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
          OFFICIAL REWEAR BALANCE
        </div>

        <div style={{ fontSize: '40px', fontWeight: 800, margin: '6px 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PointsIcon size={36} color="#CDFF9B" />
          <span>{user.pointsBalance.toLocaleString()}</span>
          <span style={{ fontSize: '16px', color: '#B2C4C0', fontWeight: 600 }}>Total Points</span>
        </div>

        {/* 3-Column Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#8E9F9B' }}>Current Balance</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PointsIcon size={16} color="#fff" />
              <span>{user.pointsBalance.toLocaleString()}</span>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Pts</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#8E9F9B' }}>Locked (Escrow)</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PointsIcon size={16} color="#fff" />
              <span>{user.lockedPoints.toLocaleString()}</span>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Pts</span>
            </div>
          </div>

          <div style={{ background: 'rgba(205, 255, 155, 0.15)', border: '1px solid rgba(205, 255, 155, 0.3)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#CDFF9B' }}>Available</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#CDFF9B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PointsIcon size={16} color="#CDFF9B" />
              <span>{availablePoints.toLocaleString()}</span>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Pts</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onOpenSell}>
            Earn Points (Sell / Value Clothes)
          </button>
          <button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }} onClick={onOpenDonate}>
            Earn Points (Donate Items)
          </button>
        </div>
      </div>

      {/* PDF Summary Table Display */}
      <div className="card-clean" style={{ padding: '20px', marginBottom: '24px', background: '#fff' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>Points Breakdown Table</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
              <th style={{ padding: '8px 12px' }}>Category</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Points Value</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '10px 12px', fontWeight: 700 }}>Current Balance</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: 'var(--ink)' }}>{user.pointsBalance.toLocaleString()} Points</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--muted)' }}>Locked (Escrow Hold)</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: 'var(--rose)' }}>{user.lockedPoints.toLocaleString()} Points</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', fontWeight: 800, color: '#3B6B2E' }}>Available Balance</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#3B6B2E' }}>{availablePoints.toLocaleString()} Points</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Transaction History Section */}
      <div className="card-clean" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Transaction History</h3>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'earned', label: 'Earned' },
              { key: 'spent', label: 'Spent' },
              { key: 'locked', label: 'Locked' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: filterType === f.key ? 700 : 600,
                  background: filterType === f.key ? 'var(--ink)' : 'var(--bg-cream)',
                  color: filterType === f.key ? '#CDFF9B' : 'var(--muted)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredTxs.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid var(--line)',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{tx.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  {tx.date} • {tx.status} {tx.orderId ? `• Order #${tx.orderId}` : ''}
                </div>
              </div>

              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: tx.type === 'earned' ? '#2E7D32' : tx.type === 'spent' ? '#C62828' : 'var(--ink)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {tx.type === 'earned' ? '+' : tx.type === 'spent' ? '-' : ''}<PointsIcon size={14} color={tx.type === 'earned' ? '#2E7D32' : tx.type === 'spent' ? '#C62828' : '#203D43'} />{tx.points} Pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="modal-backdrop" onClick={() => setSelectedTx(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '28px' }}>
            <button className="modal-close" onClick={() => setSelectedTx(null)}>
              <X size={20} />
            </button>

            <div className="badge-lime" style={{ marginBottom: '12px' }}>TRANSACTION DETAIL</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>{selectedTx.title}</h3>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
              Transaction Ref: {selectedTx.id} • {selectedTx.date}
            </div>

            <div style={{ background: 'var(--bg-cream)', padding: '16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--muted)' }}>Amount</span>
                <strong style={{ fontSize: '16px', color: 'var(--ink)' }}>{selectedTx.points} ReWear Points</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--muted)' }}>Type</span>
                <strong style={{ textTransform: 'capitalize' }}>{selectedTx.type}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--muted)' }}>Status</span>
                <strong style={{ color: selectedTx.status === 'Completed' ? '#3B6B2E' : 'var(--ink)' }}>{selectedTx.status}</strong>
              </div>
              {selectedTx.orderId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--muted)' }}>Linked Order</span>
                  <strong>#{selectedTx.orderId}</strong>
                </div>
              )}
              {selectedTx.counterpartyName && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Party</span>
                  <strong>{selectedTx.counterpartyName}</strong>
                </div>
              )}
            </div>

            {selectedTx.details && (
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                {selectedTx.details}
              </p>
            )}

            <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => setSelectedTx(null)}>
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

