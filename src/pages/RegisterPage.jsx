import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register, error, setError } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setLocalError(''); setError(null) }

  const strength = (p) => {
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }

  const pw = form.password
  const pwStrength = strength(pw)
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', '#e8212b', '#ff6b35', '#eab308', '#22c55e']

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 1. Grab the exact string values right now
    const currentEmail = form.email;
    const currentName = form.name;
    const currentPassword = form.password; // explicitly capture it

    if (currentPassword !== form.confirm) {
      setLocalError('Passwords do not match.')
      return
    }
    if (currentPassword.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }
    
    setLoading(true)
    try {
      // 2. Pass the explicitly captured variables, NOT the form object
      console.log("SENDING TO CONTEXT:", { name: currentName, email: currentEmail, password: currentPassword });
      
      await register({ 
          name: currentName, 
          email: currentEmail, 
          password: currentPassword 
      });
      
      navigate('/dashboard')
    } catch {
      // error set in context
    } finally {
      setLoading(false)
    }
  }

  const displayError = localError || error

  return (
    <div style={styles.root}>
      <div style={styles.bg} />
      <div style={styles.bgGrid} />

      <div style={styles.container}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>L</div>
          <div>
            <div style={styles.logoName}>LIFTS</div>
            <div style={styles.logoTagline}>Cloud Training Architecture</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Start your evidence-based journey</p>
          </div>

          {displayError && (
            <div style={styles.errorBanner}>
              <span style={styles.errorDot} />
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>FULL NAME</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Your name"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>PASSWORD</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Min. 6 characters"
                required
                style={styles.input}
              />
              {pw && (
                <div style={styles.strengthWrap}>
                  <div style={styles.strengthBars}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{
                        ...styles.strengthBar,
                        background: i <= pwStrength ? strengthColors[pwStrength] : 'var(--col-border)',
                      }} />
                    ))}
                  </div>
                  <span style={{ ...styles.strengthLabel, color: strengthColors[pwStrength] }}>
                    {strengthLabels[pwStrength]}
                  </span>
                </div>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>CONFIRM PASSWORD</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                placeholder="Repeat password"
                required
                style={{
                  ...styles.input,
                  borderColor: form.confirm && form.confirm !== form.password ? 'var(--col-accent)' : 'var(--col-border)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnLoading : {}) }}
            >
              {loading ? <span style={styles.spinner} /> : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div style={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '24px',
    background: 'var(--col-bg)',
  },
  bg: {
    position: 'absolute',
    bottom: '-20%',
    left: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(ellipse, rgba(232,33,43,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(var(--col-border) 1px, transparent 1px), linear-gradient(90deg, var(--col-border) 1px, transparent 1px)`,
    backgroundSize: '48px 48px',
    opacity: 0.3,
    pointerEvents: 'none',
  },
  container: {
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    animation: 'fadeIn 0.5s ease both',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    justifyContent: 'center',
  },
  logoMark: {
    width: '44px',
    height: '44px',
    background: 'var(--col-accent)',
    color: '#fff',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
  },
  logoName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '22px',
    letterSpacing: '0.1em',
    color: 'var(--col-text)',
    lineHeight: 1,
  },
  logoTagline: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-text-2)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: '2px',
  },
  card: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px',
    boxShadow: 'var(--shadow-lg)',
  },
  cardHeader: {
    marginBottom: '28px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '32px',
    letterSpacing: '0.02em',
    color: 'var(--col-text)',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-text-3)',
    marginTop: '6px',
    letterSpacing: '0.08em',
  },
  errorBanner: {
    background: 'rgba(232,33,43,0.12)',
    border: '1px solid rgba(232,33,43,0.3)',
    borderRadius: 'var(--radius)',
    padding: '10px 14px',
    color: '#ff8088',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  errorDot: {
    width: '6px',
    height: '6px',
    background: '#e8212b',
    borderRadius: '50%',
    flexShrink: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 500,
    color: 'var(--col-text-3)',
    letterSpacing: '0.1em',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--col-surface-2)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--col-text)',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 150ms ease',
  },
  strengthWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  strengthBars: {
    display: 'flex',
    gap: '4px',
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: '3px',
    borderRadius: '2px',
    transition: 'background 300ms ease',
  },
  strengthLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 500,
    minWidth: '40px',
    transition: 'color 300ms ease',
  },
  submitBtn: {
    marginTop: '8px',
    padding: '14px',
    background: 'var(--col-accent)',
    border: 'none',
    borderRadius: 'var(--radius)',
    color: '#fff',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '16px',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'background 150ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '48px',
  },
  submitBtnLoading: {
    background: 'var(--col-accent-dim)',
    cursor: 'not-allowed',
  },
  spinner: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    color: 'var(--col-text-2)',
    fontSize: '14px',
  },
  link: {
    color: 'var(--col-accent)',
    textDecoration: 'none',
    fontWeight: 500,
  },
}
