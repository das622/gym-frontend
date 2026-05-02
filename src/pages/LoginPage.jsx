import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, error, setError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const handleDemoLogin = async (demoEmail, demoPassword) => {
    // 1. Auto-fill the visual form
    setForm({ email: demoEmail, password: demoPassword });

    // 2. Trigger the login!
    setLoading(true);
    try {
      // Pass them as two separate strings, just like handleSubmit!
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch (err) {
      setError("Failed to login to demo account."); // Actually show the error!
    } finally {
      setLoading(false);
    }
  }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch {
      // error is set in context
    } finally {
      setLoading(false)
    }
  }

  const fill = (email, pass) => {
    setForm({ email, password: pass })
    setError(null)
  }

  return (
    <div style={styles.root}>
      {/* Background */}
      <div style={styles.bg} />
      <div style={styles.bgGrid} />

      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoMark}>L</div>
          <div>
            <div style={styles.logoName}>LIFTS</div>
            <div style={styles.logoTagline}>Cloud Training Architecture</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h1 style={styles.title}>Sign In</h1>
            <p style={styles.subtitle}>Track. Analyze. Progress.</p>
          </div>

          {error && (
            <div style={styles.errorBanner}>
              <span style={styles.errorDot} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(null) }}
                placeholder="you@example.com"
                required
                style={styles.input}
                autoComplete="email"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>PASSWORD</label>
              <div style={styles.inputWrap}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(null) }}
                  placeholder="••••••••"
                  required
                  style={{ ...styles.input, paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={styles.eyeBtn}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnLoading : {}) }}
            >
              {loading ? (
                <span style={styles.spinner} />
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={styles.demoSection}>
            <div style={styles.demoLabel}>DEMO ACCOUNTS</div>
            <div style={styles.demoGrid}>
              {[
                { label: 'Admin', email: 'admin@davidlifts.fit', pass: 'DemoLifts123!', color: '#e8212b' },
                { label: 'Athlete', email: 'athlete@davidlifts.fit', pass: 'DemoLifts123!', color: '#3b82f6' },
              ].map(d => (
                <button
                  key={d.label}
                  type="button" 
                  onClick={() => handleDemoLogin(d.email, d.pass)}
                  style={{ ...styles.demoBtn, borderColor: d.color + '44', color: d.color }}
                >
                  <span style={{ ...styles.demoDot, background: d.color }} />
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.footer}>
            New to Lifts Training?{' '}
            <Link to="/register" style={styles.link}>Create account →</Link>
          </div>
        </div>
      </div>
    </div>
  )


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
    top: '-20%',
    right: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(ellipse, rgba(232,33,43,0.12) 0%, transparent 70%)',
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
    gap: '20px',
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
  inputWrap: {
    position: 'relative',
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
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: 1,
    padding: '4px',
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
    transition: 'background 150ms ease, transform 100ms ease',
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
  demoSection: {
    marginTop: '28px',
    paddingTop: '24px',
    borderTop: '1px solid var(--col-border)',
  },
  demoLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.1em',
    marginBottom: '10px',
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  demoBtn: {
    padding: '8px',
    background: 'var(--col-surface-2)',
    border: '1px solid',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '13px',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'background 150ms ease',
  },
  demoDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
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
