import { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard', roles: ['admin', 'coach', 'athlete'] },
  { to: '/workouts', icon: '◈', label: 'Workouts', roles: ['admin', 'coach', 'athlete'] },
  { to: '/progress', icon: '↗', label: 'Progress', roles: ['admin', 'coach', 'athlete'] },
  { to: '/programs', icon: '≡', label: 'Programs', roles: ['admin', 'coach', 'athlete'] },
  { to: '/admin', icon: '⊛', label: 'Admin', roles: ['admin'] },
  { to: '/coach', icon: '✦', label: 'Coaching', roles: ['admin', 'coach'] },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role))

  const roleColor = {
    admin: '#e8212b',
    coach: '#ff6b35',
    athlete: '#3b82f6',
  }[user?.role] || '#9898b0'

  const roleBadge = {
    admin: 'ADMIN',
    coach: 'COACH',
    athlete: 'ATHLETE',
  }[user?.role] || user?.role?.toUpperCase()

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: collapsed ? 64 : 220 }}>
        {/* Logo */}
        <div style={styles.sidebarLogo}>
          <div style={styles.logoMark}>L</div>
          {!collapsed && (
            <div>
              <div style={styles.logoText}>LIFTS</div>
              <div style={styles.logoSub}>Cloud Training</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          {visibleItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? 'var(--col-surface-3)' : 'transparent',
                borderLeft: `2px solid ${isActive ? 'var(--col-accent)' : 'transparent'}`,
                color: isActive ? 'var(--col-text)' : 'var(--col-text-2)',
                justifyContent: collapsed ? 'center' : 'flex-start',
              })}
              title={collapsed ? item.label : ''}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span style={styles.navLabel}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user & collapse */}
        <div style={styles.sidebarBottom}>
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{ ...styles.collapseBtn, justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <span style={styles.navIcon}>{collapsed ? '→' : '←'}</span>
            {!collapsed && <span style={styles.navLabel}>Collapse</span>}
          </button>

          <div style={{ ...styles.userCard, flexDirection: collapsed ? 'column' : 'row' }}>
            <div style={{ ...styles.avatar, borderColor: roleColor }}>
              {user?.avatar}
            </div>
            {!collapsed && (
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user?.name}</div>
                <div style={{ ...styles.roleBadge, color: roleColor }}>
                  {roleBadge}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            style={{ ...styles.logoutBtn, justifyContent: collapsed ? 'center' : 'flex-start' }}
            title="Sign out"
          >
            <span style={styles.navIcon}>⏻</span>
            {!collapsed && <span style={styles.navLabel}>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--col-bg)',
  },
  sidebar: {
    flexShrink: 0,
    background: 'var(--col-surface)',
    borderRight: '1px solid var(--col-border)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 200ms ease',
    overflow: 'hidden',
  },
  sidebarLogo: {
    padding: '20px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid var(--col-border)',
    minHeight: '72px',
  },
  logoMark: {
    width: '36px',
    height: '36px',
    flexShrink: 0,
    background: 'var(--col-accent)',
    color: '#fff',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '16px',
    letterSpacing: '0.1em',
    color: 'var(--col-text)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.08em',
    marginTop: '2px',
    whiteSpace: 'nowrap',
  },
  nav: {
    flex: 1,
    padding: '12px 0',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    letterSpacing: '0.05em',
    transition: 'background 150ms, color 150ms',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  navIcon: {
    fontSize: '16px',
    flexShrink: 0,
    width: '20px',
    textAlign: 'center',
    display: 'inline-block',
  },
  navLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sidebarBottom: {
    borderTop: '1px solid var(--col-border)',
    padding: '12px 0 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  collapseBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 16px',
    background: 'none',
    border: 'none',
    color: 'var(--col-text-3)',
    fontSize: '13px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    width: '100%',
    transition: 'color 150ms',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    overflow: 'hidden',
  },
  avatar: {
    width: '32px',
    height: '32px',
    flexShrink: 0,
    background: 'var(--col-surface-3)',
    border: '2px solid',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '12px',
    color: 'var(--col-text)',
  },
  userInfo: {
    overflow: 'hidden',
  },
  userName: {
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '13px',
    color: 'var(--col-text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  roleBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '0.08em',
    marginTop: '1px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 16px',
    background: 'none',
    border: 'none',
    color: 'var(--col-text-3)',
    fontSize: '13px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    width: '100%',
    transition: 'color 150ms',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    background: 'var(--col-bg)',
  },
}
