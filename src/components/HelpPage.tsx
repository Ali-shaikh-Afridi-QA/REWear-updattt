import React, { useState } from 'react'
import { HelpCircle, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react'

interface HelpPageProps {
  onOpenDispute: () => void
  onShowToast: (msg: string) => void
}

export const HelpPage: React.FC<HelpPageProps> = ({ onOpenDispute, onShowToast }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMsg, setTicketMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const faqs = [
    {
      q: 'How does ReWear Escrow Points protection work?',
      a: 'When you initiate an exchange, the required points are temporarily locked in escrow from your wallet. Points are released to the seller ONLY after you inspect the garment and mark "Item Received".',
    },
    {
      q: 'What is the Cashify-style clothing valuation flow?',
      a: 'Instead of typing long item descriptions, our 11-step Cashify wizard asks guided questions about brand, age, size, condition, and defects to automatically compute a fair ReWear Points value in 60 seconds.',
    },
    {
      q: 'How does the 50/50 courier shipping split work?',
      a: 'For long-distance delivery via Dunzo Eco Express, the total shipping fee (e.g. ₹120) is split evenly: ₹60 added to the buyer checkout and ₹60 deducted from seller payout.',
    },
    {
      q: 'What should I do if an item has undisclosed damage?',
      a: 'Do not mark "Item Received". Immediately click "Report Problem / Open Dispute". Points release will remain frozen while our support team reviews your evidence photo.',
    },
    {
      q: 'Where are safe meetup spots located in Pune?',
      a: 'Recommended safe public meetup spots include FC Road Starbucks / Goodluck Cafe, Westend Mall Aundh, Phoenix Marketcity Viman Nagar, and Deccan Metro Station.',
    },
  ]

  const handleSubmitSupportTicket = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    onShowToast('Support ticket #TK-99401 submitted! We will respond via email within 2 hours.')
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 16px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--line)', paddingBottom: '20px' }}>
        <div className="badge-lime" style={{ marginBottom: '8px' }}>TRUST & SUPPORT CENTER</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>Help & Report Problem</h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '4px' }}>
          Find answers about ReWear Escrow, 50/50 delivery, or file a dispute ticket.
        </p>
      </div>

      {/* 3 Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="card-clean" style={{ padding: '24px', background: 'var(--lime-soft)' }}>
          <ShieldCheck size={28} color="#203D43" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Escrow Guarantee</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '16px' }}>
            Points remain locked in escrow until you receive and verify your item condition.
          </p>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={onOpenDispute}>
            File Exchange Dispute
          </button>
        </div>

        <div className="card-clean" style={{ padding: '24px' }}>
          <MessageSquare size={28} color="#203D43" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Live Buyer/Seller Chat</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '16px' }}>
            Message your exchange partner directly to coordinate Pune meetup spots.
          </p>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>Available in Messages tab</span>
        </div>

        <div className="card-clean" style={{ padding: '24px' }}>
          <AlertCircle size={28} color="#203D43" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Report Problem</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '16px' }}>
            Report counterfeit brands, harassment, or no-shows for immediate moderator review.
          </p>
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', color: 'var(--rose)', borderColor: '#F5C6C6' }} onClick={onOpenDispute}>
            Report Listing or User
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div
                  key={idx}
                  className="card-clean"
                  style={{ padding: '16px', cursor: 'pointer' }}
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                >
                  <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '16px', color: 'var(--muted)' }}>{isOpen ? '−' : '+'}</span>
                  </div>
                  {isOpen && (
                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '10px', lineHeight: 1.6, borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="card-clean" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Submit Support Ticket</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
            Need help with an order, wallet balance issue, or account question?
          </p>

          {submitted ? (
            <div style={{ background: 'var(--lime-soft)', border: '1px solid #C4EAA2', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800 }}>Ticket #TK-99401 Received!</h4>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
                Our Pune safety desk will reply to your registered email address within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitSupportTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Issue Category / Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Escrow points hold query..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                  style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '13px', outline: 0 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Description of Issue
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide order ID or details..."
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  required
                  style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--line)', padding: '10px 12px', fontSize: '13px', outline: 0 }}
                />
              </div>

              <button className="btn-primary" type="submit" style={{ padding: '12px' }}>
                Submit Support Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
