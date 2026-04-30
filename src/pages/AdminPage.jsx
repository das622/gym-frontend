import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const PLATFORM_STATS = [
  { label: 'Total Users', value: '2,841', delta: '+12%', color: 'var(--col-green)' },
  { label: 'Active This Week', value: '1,204', delta: '+8%', color: 'var(--col-blue)' },
  { label: 'Sessions Logged', value: '18,342', delta: '+22%', color: 'var(--col-accent)' },
  { label: 'Avg Sets / Session', value: '24.6', delta: '+3%', color: 'var(--col-purple)' },
]

const ACTIVITY_LOG = [
  { time: '2 min ago', event: 'marcus@example.com logged a new workout', type: 'workout' },
  { time: '15 min ago', event: 'New user registered: alex.smith@gmail.com', type: 'user' },
  { time: '1 hr ago', event: 'coach@nippard.com updated PPL program', type: 'program' },
  { time: '2 hrs ago', event: 'Revenue report generated for April 2025', type: 'report' },
  { time: '3 hrs ago', event: 'System: database backup completed', type: 'system' },
  { time: '5 hrs ago', event: '48 new workout sessions logged today', type: 'workout' },
]

const typeColors = {
  workout: '#22c55e',
  user: '#3b82f6',
  program: '#a855f7',
  report: '#ff6b35',
  system: '#5a5a70',
}

function StatCard({ label, value, delta, color }) {
  return (
    <div style={cStyles.stat}>
      <div style={cStyles.statLabel}>{label}</div>
      <div style={{ ...cStyles.statValue, color }}>{value}</div>
      <div style={{ ...cStyles.statDelta, color: delta.startsWith('+') ? 'var(--col-green)' : 'var(--col-accent)' }}>
        {delta} vs last month
      </div>
    </div>
  )
}

const cStyles = {
  stat: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '36px',
    lineHeight: 1,
    letterSpacing: '-0.01em',
  },
  statDelta: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
  },
}

export default function AdminPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [tab, setTab] = useState('overview')

  const changeRole = (id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))
  }

  const TABS = ['overview', 'users', 'activity', 'system']

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>
            <span style={styles.badgeDot} /> ADMIN PANEL
          </div>
          <h1 style={styles.title}>Platform Dashboard</h1>
          <p style={styles.subtitle}>Manage users, monitor activity, control platform settings</p>
        </div>
        <div style={styles.adminInfo}>
          <div style={styles.adminAvatar}>{user?.avatar}</div>
          <div>
            <div style={styles.adminName}>{user?.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--col-accent)', letterSpacing: '0.08em' }}>OWNER</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...styles.tab,
              ...(tab === t ? styles.tabActive : {}),
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div style={styles.section}>
          <div style={styles.statsGrid}>
            {PLATFORM_STATS.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Quick actions */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>QUICK ACTIONS</div>
            <div style={styles.actionGrid}>
              {[
                { icon: '👤', label: 'Add User', desc: 'Create new account' },
                { icon: '📋', label: 'Export Data', desc: 'Download CSV report' },
                { icon: '📢', label: 'Broadcast', desc: 'Message all users' },
                { icon: '⚙️', label: 'Settings', desc: 'Platform config' },
                { icon: '🔒', label: 'Security', desc: 'Auth & sessions' },
                { icon: '📊', label: 'Analytics', desc: 'Detailed reports' },
              ].map(a => (
                <button key={a.label} style={styles.actionBtn}>
                  <span style={styles.actionIcon}>{a.icon}</span>
                  <span style={styles.actionLabel}>{a.label}</span>
                  <span style={styles.actionDesc}>{a.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Revenue + growth */}
          <div style={styles.twoCol}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>SUBSCRIPTION BREAKDOWN</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                {[
                  { plan: 'Owner', count: 1, pct: 0.04, color: '#e8212b' },
                  { plan: 'Pro', count: 312, pct: 11, color: '#ff6b35' },
                  { plan: 'Standard', count: 2528, pct: 89, color: '#3b82f6' },
                ].map(p => (
                  <div key={p.plan}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--col-text-2)' }}>{p.plan}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--col-text)' }}>{p.count}</span>
                    </div>
                    <div style={{ background: 'var(--col-surface-3)', borderRadius: '2px', height: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: '2px', transition: 'width 600ms ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>PLATFORM HEALTH</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
                {[
                  { metric: 'API Uptime', val: '99.98%', status: 'green' },
                  { metric: 'Avg Response Time', val: '42ms', status: 'green' },
                  { metric: 'DB Connections', val: '24 / 100', status: 'green' },
                  { metric: 'Error Rate', val: '0.02%', status: 'green' },
                  { metric: 'Storage Used', val: '14.2 GB / 100 GB', status: 'yellow' },
                ].map(m => (
                  <div key={m.metric} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--col-text-2)' }}>{m.metric}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: m.status === 'green' ? 'var(--col-green)' : m.status === 'yellow' ? 'var(--col-yellow)' : 'var(--col-accent)',
                    }}>{m.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <div style={styles.section}>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={styles.cardTitle}>USER MANAGEMENT</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--col-text-3)' }}>
                {users.length} accounts
              </span>
            </div>
            <div style={styles.table}>
              {/* Header */}
              <div style={{ ...styles.tableRow, ...styles.tableHeader }}>
                <div style={styles.tc1}>USER</div>
                <div style={styles.tc2}>ROLE</div>
                <div style={styles.tc3}>PLAN</div>
                <div style={styles.tc4}>JOINED</div>
                <div style={styles.tc5}>ACTIONS</div>
              </div>
              {/* Rows */}
              {users.map(u => (
                <div key={u.id} style={styles.tableRow}>
                  <div style={{ ...styles.tc1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--col-surface-3)',
                      border: `2px solid ${roleColor(u.role)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '11px',
                      color: 'var(--col-text)',
                      flexShrink: 0,
                    }}>{u.avatar}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: 'var(--col-text)' }}>{u.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--col-text-3)' }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={styles.tc2}>
                    <select
                      value={u.role}
                      onChange={e => changeRole(u.id, e.target.value)}
                      style={{
                        background: 'var(--col-surface-2)',
                        border: '1px solid var(--col-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: roleColor(u.role),
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        letterSpacing: '0.05em',
                      }}
                    >
                      <option value="athlete">ATHLETE</option>
                      <option value="coach">COACH</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </div>
                  <div style={{ ...styles.tc3, fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--col-text-2)', textTransform: 'uppercase' }}>
                    {u.subscription}
                  </div>
                  <div style={{ ...styles.tc4, fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--col-text-3)' }}>
                    {u.joinDate}
                  </div>
                  <div style={{ ...styles.tc5, display: 'flex', gap: '6px' }}>
                    <button style={styles.tblBtn} onClick={() => setEditingUser(u)}>Edit</button>
                    <button style={{ ...styles.tblBtn, color: 'var(--col-accent)', borderColor: 'rgba(232,33,43,0.3)' }}>
                      Suspend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity tab */}
      {tab === 'activity' && (
        <div style={styles.section}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>ACTIVITY LOG</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginTop: '8px' }}>
              {ACTIVITY_LOG.map((entry, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 0', borderBottom: i < ACTIVITY_LOG.length - 1 ? '1px solid var(--col-border)' : 'none' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: typeColors[entry.type],
                    flexShrink: 0,
                    marginTop: '5px',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--col-text-2)' }}>{entry.event}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--col-text-3)', marginTop: '3px' }}>{entry.time}</div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: typeColors[entry.type],
                    background: `${typeColors[entry.type]}18`,
                    border: `1px solid ${typeColors[entry.type]}33`,
                    borderRadius: '3px',
                    padding: '2px 7px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    flexShrink: 0,
                  }}>
                    {entry.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System tab */}
      {tab === 'system' && (
        <div style={styles.section}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>SYSTEM CONFIGURATION</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              {[
                { key: 'MAINTENANCE_MODE', val: 'false', editable: true },
                { key: 'MAX_UPLOAD_MB', val: '10', editable: true },
                { key: 'JWT_EXPIRY_DAYS', val: '7', editable: true },
                { key: 'DEFAULT_USER_ROLE', val: 'athlete', editable: true },
                { key: 'APP_VERSION', val: '1.0.0', editable: false },
                { key: 'NODE_ENV', val: 'production', editable: false },
                { key: 'DB_POOL_SIZE', val: '100', editable: false },
              ].map(cfg => (
                <div key={cfg.key} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', background: 'var(--col-surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--col-border)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--col-blue)', flex: 1, letterSpacing: '0.05em' }}>{cfg.key}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--col-text)', fontWeight: 500 }}>{cfg.val}</div>
                  {cfg.editable ? (
                    <button style={{ ...styles.tblBtn, fontSize: '11px' }}>Edit</button>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--col-text-3)', letterSpacing: '0.05em' }}>READONLY</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function roleColor(role) {
  return { admin: '#e8212b', coach: '#ff6b35', athlete: '#3b82f6' }[role] || '#9898b0'
}

const styles = {
  root: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeIn 0.4s ease both',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-accent)',
    letterSpacing: '0.12em',
    marginBottom: '8px',
  },
  badgeDot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    background: 'var(--col-accent)',
    borderRadius: '50%',
    animation: 'pulse-glow 2s ease infinite',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '36px',
    letterSpacing: '0.01em',
    color: 'var(--col-text)',
    lineHeight: 1.1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--col-text-3)',
    marginTop: '8px',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '14px 18px',
  },
  adminAvatar: {
    width: '40px',
    height: '40px',
    background: 'var(--col-accent-glow)',
    border: '2px solid var(--col-accent)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '14px',
    color: 'var(--col-text)',
  },
  adminName: {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--col-text)',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    borderBottom: '1px solid var(--col-border)',
    paddingBottom: '0',
  },
  tab: {
    padding: '10px 18px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--col-text-3)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '13px',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'color 150ms, border-color 150ms',
    marginBottom: '-1px',
  },
  tabActive: {
    color: 'var(--col-text)',
    borderBottomColor: 'var(--col-accent)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  card: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.1em',
    color: 'var(--col-text)',
    marginBottom: '16px',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
  },
  actionBtn: {
    background: 'var(--col-surface-2)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 150ms, background 150ms',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  actionIcon: { fontSize: '20px' },
  actionLabel: {
    display: 'block',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--col-text)',
    marginTop: '4px',
  },
  actionDesc: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.05em',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'auto',
  },
  tableHeader: {
    background: 'var(--col-surface-2)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--col-text-3)',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.1em',
    marginBottom: '4px',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 130px 100px 110px 160px',
    gap: '12px',
    padding: '12px 8px',
    alignItems: 'center',
    borderBottom: '1px solid var(--col-border)',
    minWidth: '640px',
  },
  tc1: {}, tc2: {}, tc3: {}, tc4: {}, tc5: {},
  tblBtn: {
    padding: '5px 12px',
    background: 'var(--col-surface-2)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--col-text-2)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'background 150ms',
  },
}
