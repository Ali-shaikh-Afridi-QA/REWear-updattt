import React, { useState } from 'react'
import { Order } from '../types'

interface MeetupAndDeliveryUIProps {
  order: Order
  onUpdateStage: (orderId: string, nextStageIndex: number) => void
  onCancelOrder: (orderId: string) => void
  onOpenDispute: (order: Order) => void
  onConfirmMeetup?: (order: Order, location: string) => void | Promise<void>
  onHandoverMeetup?: (order: Order) => void | Promise<void>
  onCancelMeetup?: (order: Order) => void | Promise<void>
  onConfirmDelivery?: (order: Order) => void | Promise<void>
}

export const MeetupAndDeliveryUI: React.FC<MeetupAndDeliveryUIProps> = ({
  order,
  onUpdateStage,
  onCancelOrder,
  onOpenDispute,
  onConfirmMeetup,
  onHandoverMeetup,
  onCancelMeetup,
  onConfirmDelivery,
}) => {
  const [selectedSpot, setSelectedSpot] = useState(
    order.meetupDetails?.locationName || 'FC Road Starbucks / Goodluck Cafe Junction'
  )
  const [copiedTracking, setCopiedTracking] = useState(false)

  const isMeetup = order.type === 'meetup'

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedTracking(true)
    setTimeout(() => setCopiedTracking(false), 2000)
  }

  return (
    <div className="card-clean" style={{ padding: '20px', marginTop: '16px' }}>
      {isMeetup ? (
        /* NEARBY MEETUP UI */
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div className="badge-lime">NEARBY MEETUP ARRANGEMENT</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
              Approx Distance: {order.product.distance}
            </div>
          </div>

          <div style={{ background: 'var(--bg-cream)', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '10px' }}>
              Selected Safe Public Meetup Location
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '14px' }}>
              {[
                'FC Road Starbucks / Goodluck Cafe',
                'Westend Mall Entrance, Aundh',
                'Phoenix Marketcity Main Gate',
                'Deccan Metro Station Exit 2',
              ].map((spot) => (
                <button
                  key={spot}
                  onClick={() => setSelectedSpot(spot)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid ' + (selectedSpot === spot ? 'var(--ink)' : 'var(--line)'),
                    background: selectedSpot === spot ? 'var(--lime-soft)' : '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    textAlign: 'left',
                    color: 'var(--ink)',
                  }}
                >
                  {spot}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--ink)', flexWrap: 'wrap' }}>
              <div>Date: <strong>Tomorrow, 5:30 PM</strong></div>
              <div>Status: <strong style={{ color: '#3B6B2E' }}>Confirmed by Seller</strong></div>
            </div>
          </div>

          {/* Action Row without Button Icons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {order.stageIndex < 4 && (
              <button
                className="btn-primary"
                onClick={() => {
                  if (order.stageIndex === 1 && onConfirmMeetup) return onConfirmMeetup(order, selectedSpot)
                  if (order.stageIndex === 2 && onHandoverMeetup) return onHandoverMeetup(order)
                  onUpdateStage(order.id, Math.min(5, order.stageIndex + 1))
                }}
              >
                {order.stageIndex === 1 ? 'Confirm Meetup Details' : order.stageIndex === 2 ? 'Mark Item Handed Over (Seller)' : 'Buyer: Item Received & Release Points'}
              </button>
            )}

            <button className="btn-secondary" style={{ color: 'var(--rose)', borderColor: '#F5C6C6' }} onClick={() => onOpenDispute(order)}>
              Report Problem / Open Dispute
            </button>
            {order.stageIndex < 3 && (
              <button className="btn-secondary" style={{ color: 'var(--rose)', borderColor: '#F5C6C6' }} onClick={() => onCancelOrder(order.id)}>
                Cancel Exchange
              </button>
            )}
            {onCancelMeetup && order.stageIndex < 3 && (
              <button className="btn-secondary" style={{ color: 'var(--rose)', borderColor: '#F5C6C6' }} onClick={() => onCancelMeetup(order)}>
                Cancel Meetup
              </button>
            )}
          </div>
        </div>
      ) : (
        /* LONG-DISTANCE DELIVERY UI */
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div className="badge-lime">LONG-DISTANCE DELIVERY (50/50 FEE SPLIT)</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
              Dunzo Eco Courier Express
            </div>
          </div>

          {/* 50/50 Fee Split Transparency Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #162E33 0%, #203D43 100%)',
              color: '#fff',
              padding: '16px',
              borderRadius: '10px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#CDFF9B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              TRANSPARENT COURIER SPLIT
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginTop: '10px', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: '#8E9F9B' }}>Total Fee</div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>₹{order.deliveryDetails?.totalFee || 120}</div>
              </div>

              <div style={{ background: 'rgba(205, 255, 155, 0.15)', border: '1px solid rgba(205,255,155,0.3)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: '#CDFF9B' }}>Buyer Share</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#CDFF9B' }}>₹{order.deliveryDetails?.buyerShare || 60}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: '#8E9F9B' }}>Seller Share</div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>₹{order.deliveryDetails?.sellerShare || 60}</div>
              </div>
            </div>
          </div>

          {/* Tracking Bar */}
          <div style={{ background: 'var(--bg-cream)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Tracking Code</div>
              <div style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'monospace', color: 'var(--ink)' }}>
                {order.deliveryDetails?.trackingNumber || 'RW-DEL-884920'}
              </div>
            </div>

            <button
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '11px' }}
              onClick={() => handleCopyTracking(order.deliveryDetails?.trackingNumber || 'RW-DEL-884920')}
            >
              {copiedTracking ? 'Copied!' : 'Copy Tracking Code'}
            </button>
          </div>

          {/* Actions without icons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {order.stageIndex < 4 && (
              <button
                className="btn-primary"
                onClick={() => {
                  if (order.stageIndex === 1 && onConfirmDelivery) return onConfirmDelivery(order)
                  onUpdateStage(order.id, Math.min(5, order.stageIndex + 1))
                }}
              >
                {order.stageIndex === 1 ? 'Confirm Delivery Request' : 'Buyer: Confirm Item Received & Release Points'}
              </button>
            )}

            <button className="btn-secondary" style={{ color: 'var(--rose)', borderColor: '#F5C6C6' }} onClick={() => onOpenDispute(order)}>
              Report Problem / Open Dispute
            </button>
            {order.stageIndex < 3 && (
              <button className="btn-secondary" style={{ color: 'var(--rose)', borderColor: '#F5C6C6' }} onClick={() => onCancelOrder(order.id)}>
                Cancel Exchange
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
