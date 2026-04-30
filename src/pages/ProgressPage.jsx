import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useWorkout } from '../context/WorkoutContext'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--col-surface-2)', border: '1px solid var(--col-border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
      <div style={{ color: 'var(--col-text-2)', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: 'var(--col-accent)', fontWeight: 600 }}>{payload[0].value} lbs</div>
    </div>
  )
}

export default function ProgressPage() {
  const { workouts, exercises, getPersonalBests } = useWorkout()
  const [selectedEx, setSelectedEx] = useState('')
  const [timeframe, setTimeframe] = useState('ALL')
  const [showAllModal, setShowAllModal] = useState(false) // Controls our new popup

  const pbs = getPersonalBests()

  // 1. Dropdown List (Keeps ALL exercises you have data for)
  const exercisesWithData = useMemo(() => {
    const ids = new Set()
    workouts.forEach(w => w.sets?.forEach(s => {
      const exId = s.exercise?.id || s.exercise
      if (exId) ids.add(exId)
    }))
    return exercises.filter(ex => ids.has(ex.id))
  }, [workouts, exercises])

  useMemo(() => {
    if (!selectedEx && exercisesWithData.length > 0) {
      setSelectedEx(exercisesWithData[0].id)
    }
  }, [exercisesWithData])

  // 2. THE NEW BRAIN: Find the Top 6 Most Logged Exercises for the Dashboard Cards
  const topPRs = useMemo(() => {
    const frequency = {}
    // Count every set you've ever done
    workouts.forEach(w => {
      w.sets?.forEach(s => {
        const exId = String(s.exercise?.id || s.exercise)
        frequency[exId] = (frequency[exId] || 0) + 1
      })
    })

    // Sort the PRs by frequency count, highest to lowest, and take the top 6
    return Object.entries(pbs)
      .sort(([idA], [idB]) => (frequency[idB] || 0) - (frequency[idA] || 0))
      .slice(0, 6)
  }, [workouts, pbs])

  // 3. Chart Data
  const chartData = useMemo(() => {
    if (!selectedEx) return []
    const now = new Date()
    const cutoff = new Date()
    if (timeframe === 'WEEK') cutoff.setDate(now.getDate() - 7)
    if (timeframe === 'MONTH') cutoff.setMonth(now.getMonth() - 1)
    if (timeframe === 'YEAR') cutoff.setFullYear(now.getFullYear() - 1)

    return workouts
      .filter(w => {
        const dateMatch = timeframe === 'ALL' || new Date(w.date) >= cutoff
        const exMatch = w.sets?.some(s => String(s.exercise?.id || s.exercise) === String(selectedEx))
        return dateMatch && exMatch
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(w => {
        const exSets = w.sets.filter(s => String(s.exercise?.id || s.exercise) === String(selectedEx))
        const best = exSets.reduce((max, s) => {
          const e1rm = s.weight * (1 + s.reps / 30)
          return e1rm > max.e1rm ? { ...s, e1rm } : max
        }, { e1rm: 0, weight: 0 })

        return {
          date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: best.weight,
        }
      })
  }, [workouts, selectedEx, timeframe])

  const selectedExData = pbs[selectedEx]

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>PROGRESS</h1>
          <p style={styles.subtitle}>Evidence-based strength tracking & trend analysis</p>
        </div>
      </div>

      {/* TOP ZONE: The Highlight Reel */}
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <div style={styles.sectionTitle}>PERSONAL RECORDS</div>
          {Object.keys(pbs).length > 6 && (
            <button onClick={() => setShowAllModal(true)} style={styles.viewAllBtn}>
              View all records →
            </button>
          )}
        </div>
        
        <div style={styles.pbGrid}>
          {topPRs.map(([exId, pb]) => (
            <button
              key={exId}
              onClick={() => setSelectedEx(String(exId))}
              style={{
                ...styles.pbCard,
                borderColor: String(selectedEx) === String(exId) ? 'var(--col-accent)' : 'var(--col-border)',
                background: String(selectedEx) === String(exId) ? 'rgba(232,33,43,0.06)' : 'var(--col-surface)',
              }}
            >
              <div style={styles.pbCardName}>{pb.name}</div>
              <div style={styles.pbCardE1rm}>{pb.weight}<span style={styles.pbUnit}>lbs</span></div>
              <div style={styles.pbCardMeta}>{pb.weight}lbs × {pb.reps} · {pb.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM ZONE: The Graph */}
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div>
            <div style={styles.sectionTitle}>
              {exercises.find(e => String(e.id) === String(selectedEx))?.name || selectedEx} — STRENGTH CURVE
            </div>
            <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
               {['WEEK', 'MONTH', 'YEAR', 'ALL'].map(t => (
                 <button 
                  key={t}
                  onClick={() => setTimeframe(t)}
                  style={{
                    padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    background: timeframe === t ? 'var(--col-accent)' : 'var(--col-surface-2)',
                    color: timeframe === t ? '#000' : 'var(--col-text-3)', border: 'none'
                  }}
                 >
                   {t}
                 </button>
               ))}
            </div>
          </div>
          
          {/* THE MASTER DROPDOWN */}
          <select
            value={selectedEx}
            onChange={e => setSelectedEx(e.target.value)}
            style={styles.exSelect}
          >
            {exercisesWithData.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>

        {chartData.length > 0 ? (
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--col-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#5a5a70' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#5a5a70' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}lbs`} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--col-accent)"
                  strokeWidth={2.5}
                  connectNulls={true}
                  dot={{ fill: 'var(--col-accent)', r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={styles.chartEmpty}>
            No data for this timeframe. Log some sessions!
          </div>
        )}
      </div>

      {/* THE MODAL OVERLAY (Only shows when button is clicked) */}
      {showAllModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAllModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{fontFamily: 'var(--font-display)', fontSize: '20px'}}>ALL PERSONAL RECORDS</h2>
              <button onClick={() => setShowAllModal(false)} style={styles.modalClose}>×</button>
            </div>
            <div style={styles.modalGrid}>
              {Object.entries(pbs).map(([exId, pb]) => (
                <div key={exId} style={styles.modalItem}>
                  <div style={styles.pbCardName}>{pb.name}</div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px'}}>
                    <div style={styles.pbCardE1rm}>{pb.weight}<span style={styles.pbUnit}>lbs</span></div>
                    <div style={styles.pbCardMeta}>{pb.weight}lbs × {pb.reps}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  // ... Keep all your previous styles up here! Add these new ones below:
  root: { padding: '32px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', animation: 'fadeIn 0.4s ease both' },
  header: {},
  title: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '36px', color: 'var(--col-text)', letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 1 },
  subtitle: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--col-text-3)', marginTop: '6px', letterSpacing: '0.05em' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', color: 'var(--col-text)', marginBottom: '12px' },
  viewAllBtn: { background: 'none', border: 'none', color: 'var(--col-text-3)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', transition: 'color 0.2s' },
  pbGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' },
  pbCard: { background: 'var(--col-surface)', border: '1px solid', borderRadius: 'var(--radius-lg)', padding: '16px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 150ms, background 150ms', display: 'flex', flexDirection: 'column', gap: '6px' },
  pbCardName: { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--col-text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' },
  pbCardE1rm: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: 'var(--col-text)', letterSpacing: '0.01em', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '3px' },
  pbUnit: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--col-text-3)', fontWeight: 400 },
  pbCardMeta: { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--col-text-3)', letterSpacing: '0.03em' },
  chartCard: { background: 'var(--col-surface)', border: '1px solid var(--col-border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' },
  exSelect: { padding: '8px 12px', background: 'var(--col-surface-2)', border: '1px solid var(--col-border)', borderRadius: 'var(--radius)', color: 'var(--col-text)', fontFamily: 'var(--font-mono)', fontSize: '12px', outline: 'none', cursor: 'pointer', flexShrink: 0 },
  chartEmpty: { height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--col-text-3)' },
  
  // NEW MODAL STYLES
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { background: 'var(--col-surface)', border: '1px solid var(--col-border)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', padding: '24px', animation: 'fadeIn 0.2s ease-out' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--col-border)', paddingBottom: '12px' },
  modalClose: { background: 'none', border: 'none', color: 'var(--col-text-2)', fontSize: '24px', cursor: 'pointer', lineHeight: 1 },
  modalGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' },
  modalItem: { background: 'var(--col-surface-2)', border: '1px solid var(--col-border)', borderRadius: 'var(--radius)', padding: '16px' }
}