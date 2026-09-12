import React, { useState } from 'react'
import { Send, Image, ShieldAlert, X } from 'lucide-react'
import { User, ChatThread } from '../types'

interface MessagesPageProps {
  user: User
  onShowToast: (msg: string) => void
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ user, onShowToast }) => {
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string>('')
  const [inputMessage, setInputMessage] = useState('')

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0]

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeThread) return
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: 'You',
      text: inputMessage,
      time: 'Just now',
      isMine: true,
    }

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t
        return {
          ...t,
          lastMessage: inputMessage,
          lastMessageTime: 'Just now',
          messages: [...t.messages, newMsg],
        }
      })
    )
    setInputMessage('')
  }

  const handleBlockUser = (name: string) => {
    onShowToast(`User ${name} has been reported & blocked from messaging.`)
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t
        return {
          ...t,
          counterparty: { ...t.counterparty, isBlocked: true },
        }
      })
    )
  }

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px 80px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div className="badge-lime" style={{ marginBottom: '6px' }}>PHASE 2 REAL-TIME MESSAGING</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px' }}>Buyer & Seller Conversations</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          Coordinate meetup spots, confirm courier dispatch, and ask item questions directly.
        </p>
      </div>

      <div className="card-clean" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', minHeight: '560px', overflow: 'hidden' }}>
        {/* Thread List Sidebar */}
        <div style={{ borderRight: '1px solid var(--line)', background: '#FAFDF9', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--line)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
            Active Exchange Threads ({threads.length})
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {threads.map((t) => {
              const isActive = t.id === activeThreadId
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--line)',
                    background: isActive ? '#EEFCDA' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    transition: 'background 0.2s',
                  }}
                >
                  <img
                    src={t.counterparty.avatar}
                    alt={t.counterparty.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--ink)' }}>{t.counterparty.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{t.lastMessageTime}</span>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Order #{t.orderId} • {t.productTitle}
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--ink)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.lastMessage}
                    </div>
                  </div>

                  {t.unreadCount > 0 && !isActive && (
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--ink)', color: '#CDFF9B', fontSize: '10px', fontWeight: 800, display: 'grid', placeItems: 'center' }}>
                      {t.unreadCount}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Active Conversation Window */}
        {activeThread && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
            {/* Linked Order Chat Header */}
            <div style={{ padding: '16px 20px', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={activeThread.productImage}
                  alt=""
                  style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>{activeThread.counterparty.name} ★ {activeThread.counterparty.rating}</div>
                  <div style={{ fontSize: '11px', color: '#CDFF9B' }}>
                    Linked Order #{activeThread.orderId} • {activeThread.productTitle}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '11px', color: '#FF8A8A', borderColor: 'rgba(255,138,138,0.4)', background: 'transparent' }}
                  onClick={() => handleBlockUser(activeThread.counterparty.name)}
                >
                  Report / Block User
                </button>
              </div>
            </div>

            {/* Blocked Notice Banner */}
            {activeThread.counterparty.isBlocked && (
              <div style={{ background: '#FDF0F0', color: '#993D3D', padding: '10px 16px', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #F5C6C6' }}>
                ⛔ You have blocked this user. Further messages are disabled.
              </div>
            )}

            {/* Messages Body */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-cream)' }}>
              {activeThread.messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    background: m.isMine ? 'var(--ink)' : '#fff',
                    color: m.isMine ? '#fff' : 'var(--ink)',
                    padding: '12px 16px',
                    borderRadius: m.isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    border: m.isMine ? 'none' : '1px solid var(--line)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '2px', fontWeight: 600 }}>
                    {m.senderName}
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{m.text}</div>
                  <div style={{ fontSize: '10px', opacity: 0.6, textAlign: 'right', marginTop: '4px' }}>
                    {m.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div style={{ padding: '16px', borderTop: '1px solid var(--line)', display: 'flex', gap: '10px', alignItems: 'center', background: '#fff' }}>
              <input
                type="text"
                placeholder={activeThread.counterparty.isBlocked ? 'User is blocked' : 'Type your reply here...'}
                value={inputMessage}
                disabled={activeThread.counterparty.isBlocked}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                style={{ flex: 1, height: '44px', borderRadius: '22px', border: '1px solid var(--line)', padding: '0 18px', fontSize: '13px', outline: 0 }}
              />
              <button
                className="btn-primary"
                style={{ height: '44px', width: '44px', padding: 0, borderRadius: '50%' }}
                disabled={activeThread.counterparty.isBlocked}
                onClick={handleSendMessage}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
