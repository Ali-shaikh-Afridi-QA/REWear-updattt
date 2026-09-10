import React, { useState } from 'react'
import { X, Send, Image, Ban, Flag } from 'lucide-react'
import { User } from '../types'

interface ChatModalProps {
  user: User
  onClose: () => void
}

export const ChatModal: React.FC<ChatModalProps> = ({ user, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Riya Shah', text: 'Hi Ananya! Is 5:30 PM tomorrow good for meeting at FC Road Starbucks?', time: '10:15 AM' },
    { id: 2, sender: 'You', text: 'Yes, 5:30 PM works great for me! I will carry the denim jacket.', time: '10:18 AM' },
    { id: 3, sender: 'Riya Shah', text: 'Awesome, see you near the main entrance entrance table.', time: '10:20 AM' },
  ])
  const [input, setInput] = useState('')
  const [attachmentName, setAttachmentName] = useState('')
  const [isBlocked, setIsBlocked] = useState(false)
  const [notice, setNotice] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'You', text: input, time: 'Just now' },
    ])
    setInput('')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '0', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'var(--ink)', color: '#fff', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
              alt=""
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>Riya Shah</div>
              <div style={{ fontSize: '11px', color: '#CDFF9B' }}>Active Order #ORD-98421 • Levi's Jacket</div>
            </div>
          </div>

          <button onClick={onClose} style={{ color: '#fff' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', padding: '10px 16px', borderBottom: '1px solid var(--line)', background: '#fff' }}>
          <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '11px' }} onClick={() => setNotice('User reported to Trust & Safety.') }>
            <Flag size={13} /> Report
          </button>
          <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '11px' }} onClick={() => { setIsBlocked(true); setNotice('User blocked for this conversation.') }}>
            <Ban size={13} /> Block
          </button>
          {notice && <span style={{ alignSelf: 'center', color: 'var(--muted)', fontSize: '11px', fontWeight: 700 }}>{notice}</span>}
        </div>

        {/* Message Log */}
        <div style={{ padding: '20px', height: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-cream)' }}>
          {isBlocked ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
              This conversation is blocked.
            </div>
          ) : messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                background: msg.sender === 'You' ? 'var(--ink)' : '#fff',
                color: msg.sender === 'You' ? '#fff' : 'var(--ink)',
                padding: '10px 14px',
                borderRadius: '12px',
                border: msg.sender === 'You' ? 'none' : '1px solid var(--line)',
                fontSize: '13px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>{msg.text}</div>
              <div style={{ fontSize: '10px', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>{msg.time}</div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <div style={{ padding: '16px', background: '#fff', borderTop: '1px solid var(--line)', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label title="Attach photo" style={{ color: 'var(--muted)', cursor: isBlocked ? 'default' : 'pointer' }}>
            <Image size={18} />
            <input type="file" accept="image/*" disabled={isBlocked} onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || '')} style={{ display: 'none' }} />
          </label>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isBlocked}
            title={attachmentName || undefined}
            style={{ flex: 1, height: '42px', borderRadius: '20px', border: '1px solid var(--line)', padding: '0 16px', fontSize: '13px', outline: 0 }}
          />
          <button className="btn-primary" disabled={isBlocked} style={{ height: '42px', width: '42px', padding: 0, borderRadius: '50%' }} onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
