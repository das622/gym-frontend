import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useWorkout } from '../context/WorkoutContext'

const TIPS = [
  'Progressive overload is the #1 driver of hypertrophy.',
  'Train close to failure — RPE 7-9 per set.',
  'Sleep is your secret weapon for recovery.',
  '0.7–1g protein per lb bodyweight daily.',
  'RIR 1-2 on your last sets drives adaptation.',
]

function StatCard({ label, value, unit, delta, color }) {
  return (
    <div style={cardStyles.root}>
      <div style={cardStyles.label}>{label}</div>
      <div style={cardStyles.valueWrap}>
        <span style={{ ...cardStyles.value, color: color || 'var(--col-text)' }}>{value}</span>
        {unit && <span style={cardStyles.unit}>{unit}</span>}
      </div>
      {delta !== undefined && (
        <div style={{ ...cardStyles.delta, color: delta >= 0 ? 'var(--col-green)' : 'var(--col-accent)' }}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% this month
        </div>
      )}
    </div>
  )
}

const cardStyles = {
  root: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  valueWrap: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  value: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '36px',
    lineHeight: 1,
    letterSpacing: '-0.01em',
    fontVariantNumeric: 'tabular-nums',
  },
  unit: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--col-text-2)',
  },
  delta: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 500,
  },
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--col-surface-2)',
      border: '1px solid var(--col-border)',
      borderRadius: 'var(--radius)',
      padding: '10px 14px',
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
    }}>
      <div style={{ color: 'var(--col-text-2)', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: 'var(--col-accent)', fontWeight: 600 }}>
        {(payload[0].value / 1000).toFixed(1)}k lbs total volume
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { workouts, getPersonalBests, getVolumeByWeek, getStreak, exercises } = useWorkout()

  const streak = getStreak()
  const pbs = getPersonalBests()
  const volumeData = getVolumeByWeek()

  const tip = useMemo(() => TIPS[Math.floor(Date.now() / 86400000) % TIPS.length], [])

  const totalSets = workouts.reduce((s, w) => s + w.sets.length, 0)
  const avgDuration = workouts.length
    ? Math.round(workouts.reduce((s, w) => s + w.duration, 0) / workouts.length)
    : 0

  const recentWorkouts = [...workouts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  const topPBs = Object.entries(pbs)
    .map(([exId, pb]) => ({ exercise: exercises.find(e => e.id === exId)?.name || exId, ...pb }))
    .sort((a, b) => b.e1rm - a.e1rm)
    .slice(0, 5)

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.greeting}>
            {getGreeting()}, <span style={{ color: 'var(--col-accent)' }}>{user?.name?.split(' ')[0]}</span>
          </div>
          <div style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
        <Link to="/workouts/new" style={styles.newWorkoutBtn}>
          + NEW WORKOUT
        </Link>
      </div>

      {/* Science tip */}
      <div style={styles.tip}>
        <span style={styles.tipIcon}>⚗</span>
        <span style={styles.tipLabel}>SCIENCE NOTE</span>
        <span style={styles.tipText}>{tip}</span>
      </div>

      {/* Stats grid */}
      <div style={styles.statsGrid}>
        <StatCard label="Current Streak" value={streak} unit="days" color="var(--col-accent)" />
        <StatCard label="Total Workouts" value={workouts.length} delta={8} />
        <StatCard label="Total Sets Logged" value={totalSets} />
        <StatCard label="Avg Duration" value={avgDuration} unit="min" />
      </div>

      {/* Volume chart + PBs */}
      <div style={styles.twoCol}>
        {/* Volume chart */}
        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>
            <span>WEEKLY VOLUME</span>
            <span style={styles.cardSubtitle}>lbs lifted per week</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e8212b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e8212b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="week"
                  tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#5a5a70' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#5a5a70' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${(v/1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#e8212b"
                  strokeWidth={2}
                  fill="url(#volGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Personal Bests */}
        <div style={styles.pbCard}>
          <div style={styles.cardTitle}>
            <span>PERSONAL BESTS</span>
            <span style={styles.cardSubtitle}>estimated 1RM</span>
          </div>
          <div style={styles.pbList}>
            {topPBs.map((pb, i) => (
              <div key={pb.exercise} style={styles.pbRow}>
                <div style={styles.pbRank}>{i + 1}</div>
                <div style={styles.pbExercise}>{pb.exercise}</div>
                <div style={styles.pbValue}>{pb.e1rm} <span style={styles.pbUnit}>lbs</span></div>
              </div>
            ))}
            {!topPBs.length && (
              <div style={{ color: 'var(--col-text-3)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                Log your first workout to see PRs
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent workouts */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}>RECENT SESSIONS</div>
          <Link to="/workouts" style={styles.seeAll}>See all →</Link>
        </div>
        <div style={styles.workoutList}>
          {recentWorkouts.map(w => (
            <div key={w.id} style={styles.workoutRow}>
              <div style={styles.workoutDate}>
                {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div style={styles.workoutName}>{w.name}</div>
              <div style={styles.workoutMeta}>
                <span>{w.duration} min</span>
                <span style={styles.dot}>·</span>
                <span>{w.sets.length} sets</span>
                <span style={styles.dot}>·</span>
                <span>{(w.totalVolume / 1000).toFixed(1)}k lbs</span>
              </div>
            </div>
          ))}
          {!recentWorkouts.length && (
            <div style={styles.empty}>
              No workouts yet. <Link to="/workouts/new" style={{ color: 'var(--col-accent)' }}>Start your first →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  greeting: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '36px',
    letterSpacing: '0.01em',
    color: 'var(--col-text)',
    lineHeight: 1.1,
  },
  date: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--col-text-3)',
    marginTop: '6px',
    letterSpacing: '0.05em',
  },
  newWorkoutBtn: {
    padding: '12px 20px',
    background: 'var(--col-accent)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '0.08em',
    flexShrink: 0,
    transition: 'background 150ms',
  },
  tip: {
    background: 'rgba(232,33,43,0.06)',
    border: '1px solid rgba(232,33,43,0.2)',
    borderRadius: 'var(--radius)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  tipIcon: { fontSize: '16px' },
  tipLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-accent)',
    letterSpacing: '0.1em',
    fontWeight: 600,
    flexShrink: 0,
  },
  tipText: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--col-text-2)',
    fontStyle: 'italic',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '16px',
  },
  chartCard: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  pbCard: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '12px',
  },
  cardSubtitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.08em',
  },
  pbList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  pbRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  pbRank: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-text-3)',
    width: '16px',
    textAlign: 'center',
    flexShrink: 0,
  },
  pbExercise: {
    flex: 1,
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--col-text-2)',
  },
  pbValue: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '18px',
    color: 'var(--col-text)',
    letterSpacing: '0.02em',
  },
  pbUnit: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-text-3)',
    fontWeight: 400,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '0.1em',
    color: 'var(--col-text)',
  },
  seeAll: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-accent)',
    textDecoration: 'none',
    letterSpacing: '0.05em',
  },
  workoutList: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  workoutRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 20px',
    borderBottom: '1px solid var(--col-border)',
    transition: 'background 150ms',
  },
  workoutDate: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-text-3)',
    width: '52px',
    flexShrink: 0,
  },
  workoutName: {
    flex: 1,
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '14px',
    color: 'var(--col-text)',
  },
  workoutMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-text-3)',
  },
  dot: { color: 'var(--col-border-light)' },
  empty: {
    padding: '24px 20px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--col-text-3)',
  },
}
