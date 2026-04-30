export default function ProgramsPage() {
  const PROGRAMS = [
    {
      name: "Standard PPL",
      weeks: 12,
      days: 6,
      level: 'Intermediate',
      focus: 'Hypertrophy + Strength',
      desc: "The classic Push/Pull/Legs program. Built on periodization and progressive overload.",
      color: '#e8212b',
    },
    {
      name: 'Upper/Lower Split',
      weeks: 16,
      days: 4,
      level: 'Advanced',
      focus: 'Powerlifting',
      desc: 'Periodized upper/lower split designed around heavy compounds. Incorporates RPE-based autoregulation.',
      color: '#ff6b35',
    }
  ]
// ... rest remains the same

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h1 style={styles.title}>PROGRAMS</h1>
        <p style={styles.subtitle}>Evidence-based training programs by Jeff Nippard</p>
      </div>

      <div style={styles.grid}>
        {PROGRAMS.map(p => (
          <div key={p.name} style={{ ...styles.card, borderTopColor: p.color }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ ...styles.level, color: p.color, borderColor: p.color + '44', background: p.color + '12' }}>{p.level}</div>
              <div style={styles.focus}>{p.focus}</div>
            </div>
            <div style={styles.cardName}>{p.name}</div>
            <div style={styles.cardDesc}>{p.desc}</div>
            <div style={styles.cardMeta}>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>DURATION</span>
                <span style={styles.metaVal}>{p.weeks} weeks</span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>FREQUENCY</span>
                <span style={styles.metaVal}>{p.days}x / week</span>
              </div>
            </div>
            <button style={{ ...styles.startBtn, background: p.color }}>
              START PROGRAM
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  root: {
    padding: '32px',
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    animation: 'fadeIn 0.4s ease both',
  },
  header: {},
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderTop: '3px solid',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  level: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.1em',
    border: '1px solid',
    borderRadius: 'var(--radius-sm)',
    padding: '3px 8px',
    fontWeight: 500,
  },
  focus: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.08em',
  },
  cardName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '22px',
    color: 'var(--col-text)',
    letterSpacing: '0.02em',
    lineHeight: 1.1,
  },
  cardDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--col-text-2)',
    lineHeight: 1.6,
    flex: 1,
  },
  cardMeta: {
    display: 'flex',
    gap: '24px',
    paddingTop: '12px',
    borderTop: '1px solid var(--col-border)',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  metaLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.1em',
  },
  metaVal: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '16px',
    color: 'var(--col-text)',
    letterSpacing: '0.02em',
  },
  startBtn: {
    padding: '12px',
    border: 'none',
    borderRadius: 'var(--radius)',
    color: '#fff',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'opacity 150ms',
  },
}
