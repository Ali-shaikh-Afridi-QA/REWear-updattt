import React, { useState } from 'react'
import { Leaf, Eye, EyeOff, MapPin } from 'lucide-react'
import { AuthMode, User } from '../../types'
import { GoogleIcon } from './SocialIcons'
import { apiService, saveAuthTokens, toAppUser } from '../../services/apiService'

interface AuthProps {
  initialMode?: AuthMode
  onSuccess?: (user: User) => void
  onBack?: () => void
}

const COMMON_LOCATIONS = ['Kothrud, Pune', 'Baner, Pune', 'Hinjewadi, Pune', 'Viman Nagar, Pune', 'Aundh, Pune']

export function AuthPage({ initialMode = 'login', onSuccess, onBack }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [location, setLocation] = useState('Kothrud, Pune')
  const [resetToken, setResetToken] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingUser, setPendingUser] = useState<User | null>(null)

  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'
  const isReset = mode === 'reset'
  const isProfileSetup = mode === 'profile'

  const resetFormState = () => {
    setError('')
    setSuccess('')
  }

  const handleGoogleSignIn = () => {
    resetFormState()
    setLoading(true)
    window.location.assign(apiService.startGoogleLogin())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    resetFormState()

    if (isForgot) {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        setError('Please enter a valid email address to receive reset instructions.')
        return
      }

      setLoading(true)
      try {
        await apiService.forgotPassword({ email: email.trim() })
        setSuccess('Password reset instructions were sent to your email.')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to send reset instructions right now.')
      } finally {
        setLoading(false)
      }
      return
    }

    if (isReset) {
      if (!resetToken || !password) {
        setError('Please provide the reset token and a new password.')
        return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      setLoading(true)
      try {
        await apiService.resetPassword({ token: resetToken.trim(), password })
        setSuccess('Password reset successfully. You can sign in with your new password.')
        setMode('login')
        setPassword('')
        setConfirmPassword('')
        setResetToken('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to reset your password.')
      } finally {
        setLoading(false)
      }
      return
    }

    if (isProfileSetup) {
      if (!location.trim()) {
        setError('Please select your local area to continue.')
        return
      }

      if (pendingUser) {
        setLoading(true)
        try {
          await apiService.updateProfile({ city: location.trim() })
          onSuccess?.({ ...pendingUser, location: location.trim() })
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unable to save your profile location.')
        } finally {
          setLoading(false)
        }
      } else {
        onSuccess?.({
          id: 'user_profile_setup',
          name: name || 'New ReWear Member',
          email: email || 'member@rewear.org',
          location: location.trim(),
          memberSince: 'Recently',
          rating: 5,
          ratingCount: 0,
          successfulExchanges: 0,
          donationsCompleted: 0,
          itemsListed: 0,
          pointsBalance: 500,
          lockedPoints: 0,
          badges: ['Verified Member'],
        })
      }
      return
    }

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

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        await apiService.register({
          email: email.trim(),
          username: name.trim(),
          password,
        })
      }

      const tokens = await apiService.login({ email: email.trim(), password })
      saveAuthTokens(tokens)
      const apiUser = await apiService.getProfile()
      const appUser = toAppUser(apiUser)

      if (isRegister) {
        setPendingUser({ ...appUser, location: location.trim() || appUser.location })
        setMode('profile')
        setSuccess('Account created. Finish your local profile setup to continue.')
        return
      }

      onSuccess?.(appUser)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to complete authentication. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const renderFormHeader = () => {
    if (isForgot) {
      return {
        title: 'Forgot your password?',
        subtitle: 'We’ll email you a secure reset link.',
      }
    }
    if (isReset) {
      return {
        title: 'Reset your password',
        subtitle: 'Choose a new password for your ReWear account.',
      }
    }
    if (isProfileSetup) {
      return {
        title: 'Complete your profile',
        subtitle: 'Set your local area so nearby swaps show up correctly.',
      }
    }
    return {
      title: isRegister ? 'Create your account' : 'Welcome back',
      subtitle: isRegister ? 'Join India’s circular fashion economy' : 'Welcome back to your points wallet',
    }
  }

  const header = renderFormHeader()

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
            {header.subtitle}
          </p>
        </div>

        {!isForgot && !isReset && !isProfileSetup && (
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
              type="button"
              onClick={() => { setMode('login'); resetFormState() }}
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
              type="button"
              onClick={() => { setMode('register'); resetFormState() }}
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
        )}

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

        {error && (
          <div style={{ background: '#FDF0F0', border: '1px solid #F5C6C6', padding: '10px', borderRadius: '8px', color: 'var(--rose)', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#F0F9ED', border: '1px solid #C4EAA2', padding: '10px', borderRadius: '8px', color: '#2E7D32', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: 600 }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isProfileSetup ? (
            <>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Local area / city
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                  {COMMON_LOCATIONS.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setLocation(item)}
                      style={{
                        background: location === item ? 'var(--lime-soft)' : '#fff',
                        border: `1px solid ${location === item ? '#203D43' : 'var(--line)'}`,
                        borderRadius: '8px',
                        padding: '10px 8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--ink)',
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Or choose another area
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={14} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--muted)' }} />
                  <input
                    type="text"
                    placeholder="e.g. Kharadi, Pune"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px 0 32px', fontSize: '13px', outline: 0 }}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--bg-cream)', borderRadius: '10px', padding: '12px', fontSize: '12px', color: 'var(--muted)' }}>
                <div style={{ fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>Location access</div>
                We use your area to show nearby clothes and safe meetup recommendations.
              </div>
            </>
          ) : (
            <>
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

              {!isReset && !isForgot && (
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
              )}

              {isForgot && (
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
              )}

              {isReset && (
                <>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Reset Token
                    </label>
                    <input
                      type="text"
                      placeholder="Paste your verification token"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '13px', outline: 0 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                        style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 40px 0 12px', fontSize: '13px', outline: 0 }}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', color: 'var(--muted)' }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={8}
                        required
                        style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 40px 0 12px', fontSize: '13px', outline: 0 }}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '10px', color: 'var(--muted)' }}>
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!isReset && !isForgot && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      minLength={8}
                      required
                      style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 40px 0 12px', fontSize: '13px', outline: 0 }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', color: 'var(--muted)' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {isRegister && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      required
                      style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 40px 0 12px', fontSize: '13px', outline: 0 }}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '10px', color: 'var(--muted)' }}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {!isForgot && !isReset && !isProfileSetup && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setMode('forgot'); resetFormState() }} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '6px', opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? 'Processing...'
              : isForgot
                ? 'Send Reset Link'
                : isReset
                  ? 'Reset Password'
                  : isProfileSetup
                    ? 'Finish Profile Setup'
                    : isRegister
                      ? 'Register & Claim 500 Points'
                      : 'Sign In'}
          </button>

          {(isForgot || isReset) && (
            <button
              type="button"
              onClick={() => { setMode('login'); resetFormState() }}
              className="btn-secondary"
              style={{ width: '100%', padding: '12px' }}
            >
              Back to sign in
            </button>
          )}
        </form>

        {!isForgot && !isReset && !isProfileSetup && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0 16px', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
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
                opacity: loading ? 0.7 : 1,
              }}
            >
              <GoogleIcon />
              <span>{loading ? 'Opening Google sign-in...' : 'Continue with Google'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
