import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkout } from '../context/WorkoutContext'

export default function WorkoutsPage() {
  const { workouts, exercises, deleteWorkout } = useWorkout()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [confirm, setConfirm] = useState(null)
  
  // THE NEW STATE: Tracks which cards are currently expanded
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getExName = (id) => exercises.find(e => e.id === id)?.name || id

  const filtered = workouts
    .filter(w => w.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date))

  const handleDelete = (id) => {
    deleteWorkout(id)
    setConfirm(null)
  }

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>WORKOUT LOG</h1>
          <p style={styles.subtitle}>All {workouts.length} sessions · science-based tracking</p>
        </div>
        <Link to="/workouts/new" style={styles.newBtn}>+ LOG WORKOUT</Link>
      </div>

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search sessions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      <div style={styles.list}>
        {filtered.map(w => {
          // Check if this specific card is expanded
          const isExpanded = expanded[w.id]
          // If expanded, show all. If not, only show the first 3.
          const displaySets = isExpanded ? w.sets : w.sets.slice(0, 3)

          return (
            <div key={w.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <div style={styles.cardDate}>
                    {new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={styles.cardName}>{w.name}</div>
                </div>
                <div style={styles.cardMeta}>
                  <div style={styles.metaPill}>{w.sets.length} sets</div>
                </div>
              </div>

              {/* THE EXPANDABLE SECTION */}
              <div 
                style={styles.setsPreview} 
                onClick={() => toggleExpand(w.id)} // Click anywhere in this box to toggle
              >
                {displaySets.map((s, i) => (
                  <div key={i} style={styles.setRow}>
                    <span style={styles.exName}>{s.exercise?.name || s.exercise}</span>
                    <span style={styles.setSpec}>
                      {s.weight}lbs × {s.reps}
                    </span>
                  </div>
                ))}
                
                {/* Dynamic Expand/Collapse text */}
                {!isExpanded && w.sets.length > 3 && (
                  <div style={styles.expandText}>
                    +{w.sets.length - 3} more sets ↓
                  </div>
                )}
                {isExpanded && w.sets.length > 3 && (
                  <div style={styles.expandText}>
                    Hide extra sets ↑
                  </div>
                )}
              </div>

              {/* PHASE 2 & 3 PREP: New Action Buttons */}
              <div style={styles.cardActions}>
                <div style={styles.actionGroup}>
                  <button
                  onClick={() => navigate('/workouts/new', { state: { cloneWorkout: w } })}
                  style={styles.secondaryBtn} 
                  >Perform Again</button>
                  <button 
                  onClick={() => navigate('/workouts/new', { state: { editWorkout: w } })}
                  style={styles.secondaryBtn}
                  >Edit</button>
                </div>
                <button
                  onClick={() => setConfirm(w.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>

              {confirm === w.id && (
                <div style={styles.confirmBanner}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--col-text-2)' }}>
                    Delete this session?
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleDelete(w.id)} style={styles.confirmYes}>Yes, delete</button>
                    <button onClick={() => setConfirm(null)} style={styles.confirmNo}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {!filtered.length && (
          <div style={styles.empty}>
            {search ? `No sessions matching "${search}"` : 'No sessions yet.'}
            {!search && (
              <Link to="/workouts/new" style={{ color: 'var(--col-accent)', marginLeft: '6px' }}>
                Log your first →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  root: {
    padding: '32px',
    maxWidth: '900px',
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
  newBtn: {
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
  },
  toolbar: {},
  search: {
    width: '100%',
    maxWidth: '360px',
    padding: '10px 14px',
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--col-text)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    outline: 'none',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  cardDate: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.05em',
  },
  cardName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '20px',
    color: 'var(--col-text)',
    marginTop: '2px',
    letterSpacing: '0.02em',
  },
  cardMeta: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  metaPill: {
    padding: '4px 10px',
    background: 'var(--col-surface-2)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--col-text-2)',
    letterSpacing: '0.03em',
  },
  setsPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingTop: '8px',
    borderTop: '1px solid var(--col-border)',
    cursor: 'pointer', // Makes it clear you can click it
    transition: 'background 150ms', // Smooth hover effect
    borderRadius: 'var(--radius-sm)',
  },
  setRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '0 4px',
  },
  exName: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--col-text-2)',
  },
  setSpec: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--col-text)',
    fontVariantNumeric: 'tabular-nums',
  },
  expandText: {
    fontFamily: 'var(--font-mono)', 
    fontSize: '11px', 
    color: 'var(--col-text-3)', 
    marginTop: '4px',
    padding: '4px',
    textAlign: 'center',
    background: 'var(--col-surface-2)',
    borderRadius: 'var(--radius-sm)',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between', // Pushes Delete to the right, others to the left
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid var(--col-border)',
  },
  actionGroup: {
    display: 'flex',
    gap: '12px',
  },
  secondaryBtn: {
    padding: '5px 12px',
    background: 'var(--col-surface-2)',
    border: '1px solid var(--col-border-light)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--col-text-2)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'all 150ms',
  },
  deleteBtn: {
    padding: '5px 12px',
    background: 'none',
    border: '1px solid rgba(232,33,43,0.25)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--col-accent)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'background 150ms',
  },
  confirmBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(232,33,43,0.08)',
    border: '1px solid rgba(232,33,43,0.2)',
    borderRadius: 'var(--radius)',
    gap: '12px',
  },
  confirmYes: {
    padding: '6px 14px',
    background: 'var(--col-accent)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
  confirmNo: {
    padding: '6px 14px',
    background: 'var(--col-surface-2)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--col-text-2)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
  empty: {
    padding: '40px 24px',
    textAlign: 'center',
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-lg)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--col-text-3)',
  },
}