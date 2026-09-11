import React, { useState } from 'react'
import { Order, OrderStage } from '../types'
import { MeetupAndDeliveryUI } from './MeetupAndDeliveryUI'
import { PointsIcon } from './PointsIcon'

interface OrdersPageProps {
  orders: Order[]
  onUpdateStage: (
    orderId: string,
    stageIndex: number
  ) => void | Promise<void>

  onCancelOrder: (
    orderId: string
  ) => void | Promise<void>

  onOpenDispute: (order: Order) => void

  onConfirmMeetup?: (
    order: Order,
    location: string
  ) => void | Promise<void>

  onHandoverMeetup?: (
    order: Order
  ) => void | Promise<void>

  onConfirmDelivery?: (
    order: Order
  ) => void | Promise<void>

  onSubmitReview?: (
    order: Order,
    rating: number,
    comment: string
  ) => void | Promise<void>
}

type OrderTab =
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'disputed'

const STAGES: OrderStage[] = [
  'Exchange Requested',
  'Points Locked',
  'Meetup/Delivery Set',
  'Item Received',
  'Points Released',
  'Completed',
]

const TABS: {
  key: OrderTab
  label: string
}[] = [
  {
    key: 'active',
    label: 'Active Exchanges',
  },
  {
    key: 'completed',
    label: 'Completed History',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
  },
  {
    key: 'disputed',
    label: 'Disputes & Issues',
  },
]

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  onUpdateStage,
  onCancelOrder,
  onOpenDispute,
  onConfirmMeetup,
  onHandoverMeetup,
  onConfirmDelivery,
  onSubmitReview,
}) => {
  const [activeTab, setActiveTab] =
    useState<OrderTab>('active')

  const filteredOrders = orders.filter((order) => {
    return order.status === activeTab
  })

  return (
    <div
      style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '24px 16px 80px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-1px',
          }}
        >
          Exchange Orders
        </h1>

        <p
          style={{
            color: 'var(--muted)',
            fontSize: '14px',
          }}
        >
          Track live swaps, escrow holds, and meetup /
          delivery schedules.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom:
            '1px solid var(--line)',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setActiveTab(tab.key)
            }
            style={{
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight:
                activeTab === tab.key
                  ? 800
                  : 600,
              color:
                activeTab === tab.key
                  ? 'var(--ink)'
                  : 'var(--muted)',
              borderBottom:
                '3px solid ' +
                (activeTab === tab.key
                  ? 'var(--ink)'
                  : 'transparent'),
              background: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div
          className="card-clean"
          style={{
            padding: '48px 16px',
            textAlign: 'center',
            color: 'var(--muted)',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--ink)',
            }}
          >
            No {activeTab} orders found
          </h3>

          <p
            style={{
              fontSize: '14px',
              marginTop: '6px',
            }}
          >
            Your active exchange transactions
            will appear here with live tracking
            timelines.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="card-clean animate-fade-in"
              style={{
                padding: '24px',
              }}
            >
              {/* Order Card Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                  borderBottom:
                    '1px solid var(--line)',
                  paddingBottom: '16px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  <img
                    src={ord.product.images[0]}
                    alt={ord.product.title}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                    }}
                  />

                  <div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--muted)',
                        textTransform:
                          'uppercase',
                      }}
                    >
                      Order #{ord.id} •{' '}
                      {ord.createdAt}
                    </div>

                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        marginTop: '2px',
                        marginBottom: '4px',
                      }}
                    >
                      {ord.product.title}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        fontSize: '12px',
                        color:
                          'var(--muted)',
                      }}
                    >
                      <span>
                        Brand:{' '}
                        <strong>
                          {ord.product.brand}
                        </strong>
                      </span>

                      <span>
                        Size:{' '}
                        <strong>
                          {ord.product.size}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'flex-end',
                      gap: '6px',
                    }}
                  >
                    <PointsIcon
                      size={18}
                      color="#203D43"
                    />

                    {ord.points} Pts
                  </div>

                  <div
                    style={{
                      fontSize: '11px',
                      color: '#3B6B2E',
                      fontWeight: 700,
                      marginTop: '2px',
                    }}
                  >
                    Escrow Held
                  </div>
                </div>
              </div>

              {/* 6-Stage Timeline */}
              <div
                style={{
                  margin: '24px 0 28px',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color:
                      'var(--muted)',
                    letterSpacing:
                      '1px',
                    textTransform:
                      'uppercase',
                    marginBottom:
                      '12px',
                  }}
                >
                  EXCHANGE PROGRESS
                  TIMELINE
                </div>

                <div className="timeline-stepper">
                  {STAGES.map(
                    (
                      stageName,
                      idx
                    ) => {
                      const isCompleted =
                        idx <=
                        ord.stageIndex

                      const isActive =
                        idx ===
                        ord.stageIndex

                      return (
                        <div
                          key={
                            stageName
                          }
                          className={`timeline-step ${
                            isCompleted
                              ? 'completed'
                              : ''
                          } ${
                            isActive
                              ? 'active'
                              : ''
                          }`}
                        >
                          <div className="timeline-node">
                            {idx + 1}
                          </div>

                          <span className="timeline-label">
                            {stageName}
                          </span>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>

              {/* Counterparty Contact */}
              <div
                style={{
                  background:
                    'var(--bg-cream)',
                  padding:
                    '12px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'space-between',
                  marginBottom:
                    '16px',
                  fontSize: '12px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems:
                      'center',
                    gap: '8px',
                  }}
                >
                  <img
                    src={
                      ord
                        .counterparty
                        .avatar
                    }
                    alt=""
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius:
                        '50%',
                    }}
                  />

                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      {ord.counterparty
                        .role ===
                      'seller'
                        ? 'Seller'
                        : 'Buyer'}
                      :{' '}
                      {
                        ord
                          .counterparty
                          .name
                      }
                    </div>

                    <div
                      style={{
                        fontSize:
                          '10px',
                        color:
                          'var(--muted)',
                      }}
                    >
                      ★{' '}
                      {
                        ord
                          .counterparty
                          .rating
                      }{' '}
                      Rated User
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    color:
                      'var(--ink)',
                  }}
                >
                  Phone:{' '}
                  {
                    ord.counterparty
                      .phone
                  }
                </div>
              </div>

              {/* Meetup / Delivery */}
              <MeetupAndDeliveryUI
                order={ord}
                onUpdateStage={
                  onUpdateStage
                }
                onCancelOrder={
                  onCancelOrder
                }
                onOpenDispute={
                  onOpenDispute
                }
                onConfirmMeetup={
                  onConfirmMeetup
                }
                onHandoverMeetup={
                  onHandoverMeetup
                }
                onConfirmDelivery={
                  onConfirmDelivery
                }
              />

              {/* Review */}
              {ord.status ===
                'completed' &&
                ord.backendOrderId &&
                onSubmitReview && (
                  <button
                    className="btn-secondary"
                    style={{
                      marginTop:
                        '12px',
                    }}
                    onClick={async () => {
                      const rating =
                        Number(
                          window.prompt(
                            'Rate this exchange from 1 to 5',
                            '5'
                          )
                        )

                      if (
                        !Number.isInteger(
                          rating
                        ) ||
                        rating < 1 ||
                        rating > 5
                      ) {
                        return
                      }

                      const comment =
                        window.prompt(
                          'Optional review comment',
                          ''
                        ) || ''

                      await onSubmitReview(
                        ord,
                        rating,
                        comment
                      )
                    }}
                  >
                    Rate Exchange
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
