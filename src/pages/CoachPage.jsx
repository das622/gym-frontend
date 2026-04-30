import { useAuth } from '../context/AuthContext'

const ATHLETES = [
  { name: 'Marcus Johnson', avatar: 'MJ', plan: 'PPL', streak: 5, lastSession: '2025-04-20', progress: 78 },
  { name: 'Alex Rivera', avatar: 'AR', plan: 'Upper/Lower', streak: 12, lastSession: '2025-04-21', progress: 91 },
  { name: 'Sam Park', avatar: 'SP', plan: 'Fundamentals', streak: 3, lastSession: '2025-04-19', progress: 54 },
  { name: 'Jordan Lee', avatar: 'JL', plan: 'Full Body HF', streak: 0, lastSession: '2025-04-15', progress: 32 },
]

export default function CoachPage() {
  const { user } = useAuth()

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>✦ COACHING PANEL</div>
          <h1 style={styles.title}>MY ATHLETES</h1>
          <p style={styles.subtitle}>Monitor progress, adjust programs, and message clients</p>
        </div>
      </div>

      <div style={styles.statsRow}>
        {[
          { label: 'Athletes', value: ATHLETES.length },
          { label: 'Active This Week', value: 3 },
          { label: 'Avg Adherence', value: '64%' },
          { label: 'Check-ins Due', value: 2 },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={styles.statVal}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={styles.athleteList}>
        {ATHLETES.map(a => (
          <div key={a.name} style={styles.athleteCard}>
            <div style={styles.athleteLeft}>
              <div style={styles.avatar}>{a.avatar}</div>
              <div>
                <div style={styles.athleteName}>{a.name}</div>
                <div style={styles.athletePlan}>{a.plan} · Last: {a.lastSession}</div>
              </div>
            </div>
            <div style={styles.athleteProgress}>
              <div style={styles.progressLabel}>ADHERENCE</div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${a.progress}%`,
                  background: a.progress >= 75 ? 'var(--col-green)' : a.progress >= 50 ? 'var(--col-yellow)' : 'var(--col-accent)',
                }} />
              </div>
              <div style={styles.progressPct}>{a.progress}%</div>
            </div>
            <div style={styles.streakBadge}>
              🔥 {a.streak}d streak
            </div>
            <div style={styles.athleteActions}>
              <button style={styles.msgBtn}>Message</button>
              <button style={styles.viewBtn}>View Log</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  root: {
    padding: '32px',
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeIn 0.4s ease both',
  },
  header: {},
  badge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#ff6b35',
    letterSpacing: '0.12em',
    marginBottom: '8px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '36px',
    color: 'var(--col-text)',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    lineHeight: 1,
  },
  subtitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-text-3)',
    marginTop: '6px',
    letterSpacing: '0.05em',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statCard: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 20px',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.1em',
    marginBottom: '6px',
  },
  statVal: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '32px',
    color: 'var(--col-text)',
    lineHeight: 1,
  },
  athleteList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  athleteCard: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  athleteLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: '200px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--col-surface-3)',
    border: '2px solid var(--col-border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '13px',
    color: 'var(--col-text)',
    flexShrink: 0,
  },
  athleteName: {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '15px',
    color: 'var(--col-text)',
  },
  athletePlan: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-text-3)',
    marginTop: '2px',
    letterSpacing: '0.04em',
  },
  athleteProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '200px',
  },
  progressLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.08em',
    flexShrink: 0,
  },
  progressBar: {
    flex: 1,
    height: '6px',
    background: 'var(--col-surface-3)',
    borderRadius: '3px',
    overflow: 'hidden',
    minWidth: '80px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 600ms ease',
  },
  progressPct: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--col-text-2)',
    fontWeight: 500,
    minWidth: '32px',
    textAlign: 'right',
    flexShrink: 0,
  },
  streakBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-text-2)',
    background: 'var(--col-surface-2)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '4px 10px',
    flexShrink: 0,
  },
  athleteActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  msgBtn: {
    padding: '7px 14px',
    background: 'none',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--col-text-2)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
  viewBtn: {
    padding: '7px 14px',
    background: '#ff6b3520',
    border: '1px solid #ff6b3544',
    borderRadius: 'var(--radius-sm)',
    color: '#ff6b35',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
}
