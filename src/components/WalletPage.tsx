import React, { useState } from 'react'
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#8E9F9B' }}>Locked Escrow</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PointsIcon size={16} color="#fff" />
              <span>{user.lockedPoints.toLocaleString()}</span>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Pts</span>
            </div>
          </div>

          <div style={{ background: 'rgba(205, 255, 155, 0.15)', border: '1px solid rgba(205, 255, 155, 0.3)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#CDFF9B' }}>Available to Spend</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#CDFF9B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PointsIcon size={16} color="#CDFF9B" />
              <span>{availablePoints.toLocaleString()}</span>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Pts</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#8E9F9B' }}>Total Lifetime Earned</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PointsIcon size={16} color="#fff" />
              <span>2,900</span>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Pts</span>
            </div>
          </div>
        </div>
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
                }}
              >
                {tx.type === 'earned' ? '+' : tx.type === 'spent' ? '-' : ''}{tx.points} Pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
