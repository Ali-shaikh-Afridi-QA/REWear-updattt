import React from 'react'
import { X, Bell, Check, ShoppingBag, Leaf, MessageSquare } from 'lucide-react'
import { NotificationItem } from '../types'

interface NotificationsDrawerProps {
  notifications: NotificationItem[]
  onClose: () => void
  onMarkAllRead: () => void
  onMarkRead: (id: string) => void
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  onClose,
  onMarkAllRead,
  onMarkRead,
}) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          maxWidth: '420px',
          width: '90vw',
          maxHeight: '80vh',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '18px' }}>
            <Bell size={20} /> Notifications
          </div>
          <button onClick={onMarkAllRead} style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700 }}>
            Mark all read
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '60vh' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && onMarkRead(n.id)}
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: n.read ? '#fff' : 'var(--lime-soft)',
                border: '1px solid ' + (n.read ? 'var(--line)' : '#C4EAA2'),
                cursor: n.read ? 'default' : 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{n.title}</span>
                <span>{n.time}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.4 }}>{n.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
