import React, { useState } from 'react'
import { Leaf } from 'lucide-react'
import { AuthMode, User } from '../../types'
import { GoogleIcon } from './SocialIcons'
import { apiService, saveAuthTokens, toAppUser } from '../../services/apiService'

interface AuthProps {
  initialMode?: AuthMode
  onSuccess?: (user: User) => void
  onBack?: () => void
}

export function AuthPage({ initialMode = 'login', onSuccess, onBack }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all required fields.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (isRegister && !/^[A-Za-z0-9_]{3,50}$/.test(name)) {
      setError('Username must be 3–50 characters and use only letters, numbers, or underscores.')
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        await apiService.register({ email: email.trim(), username: name.trim(), password })
      }

      const tokens = await apiService.login({ email: email.trim(), password })
      saveAuthTokens(tokens)
      const apiUser = await apiService.getProfile()
      onSuccess?.(toAppUser(apiUser))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to complete authentication. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(180deg, #162E33 0%, #203D43 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--surface)',
          color: 'var(--ink)',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--line)',
        }}
      >
        {/* Top Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--lime)',
              color: 'var(--ink)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 0 16px rgba(205, 255, 155, 0.4)',
            }}
          >
            <Leaf size={24} />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>ReWear</h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            {isRegister ? 'Join India’s circular fashion economy' : 'Welcome back to your points wallet'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-cream)',
            padding: '4px',
            borderRadius: '30px',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '24px',
              fontSize: '13px',
              fontWeight: 800,
              border: 0,
              background: !isRegister ? 'var(--ink)' : 'transparent',
              color: !isRegister ? '#CDFF9B' : 'var(--muted)',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '24px',
              fontSize: '13px',
              fontWeight: 800,
              border: 0,
              background: isRegister ? 'var(--ink)' : 'transparent',
              color: isRegister ? '#CDFF9B' : 'var(--muted)',
              transition: 'all 0.2s',
            }}
          >
            Register
          </button>
        </div>

        {/* Bonus Points Banner for Registration */}
        {isRegister && (
          <div
            style={{
              background: 'var(--lime-soft)',
              border: '1px solid #C4EAA2',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '20px',
            }}
          >
            🎉 Claim 500 Bonus ReWear Points upon creating your account!
          </div>
        )}

        {/* Form Error */}
        {error && (
          <div style={{ background: '#FDF0F0', border: '1px solid #F5C6C6', padding: '10px', borderRadius: '8px', color: 'var(--rose)', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Username
              </label>
              <input
                type="text"
                placeholder="e.g. ananya_d"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="username"
                required
                style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '13px', outline: 0 }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '13px', outline: 0 }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              minLength={8}
              required
              style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '13px', outline: 0 }}
            />
          </div>

          {/* Submit Button without Icon */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '6px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : isRegister ? 'Register & Claim 500 Points' : 'Sign In'}
          </button>
        </form>

        {/* Google authentication is intentionally unavailable until an OAuth provider is configured. */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0 16px', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
        </div>

        {/* Google Social Button */}
        <button
          type="button"
          disabled
          className="btn-secondary"
          style={{
            width: '100%',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 700,
            background: '#ffffff',
            border: '1px solid var(--line)',
            color: 'var(--ink)',
            borderRadius: '8px',
            opacity: 0.55,
            cursor: 'not-allowed',
          }}
        >
          <GoogleIcon />
          <span>Google sign-in coming soon</span>
        </button>
      </div>
    </div>
  )
}
