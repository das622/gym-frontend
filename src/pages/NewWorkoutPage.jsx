import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWorkout } from '../context/WorkoutContext'

export default function NewWorkoutPage() {
  // NOTE: You will need an 'updateWorkout' function in your context!
  const { exercises, logWorkout, updateWorkout, createExercise } = useWorkout()
  const navigate = useNavigate()
  
  // THE NEW MAGIC: Are we cloning or editing?
  const location = useLocation()
  const cloneData = location.state?.cloneWorkout
  const editData = location.state?.editWorkout

  const isEditing = !!editData; // True if editData exists
  const initialData = editData || cloneData; // Both use the same pre-fill logic!

  const [name, setName] = useState(initialData ? initialData.name : '')
  const [notesText, setNotesText] = useState('')
  const [showPaste, setShowPaste] = useState(false)
  
  const [sets, setSets] = useState(() => {
    if (initialData && initialData.sets) {
      return initialData.sets.map(s => ({
        exercise: s.exercise?.name || s.exercise,
        weight: s.weight,
        reps: s.reps
      }))
    }
    return [{ exercise: '', weight: '', reps: '' }]
  })
  
  const [saving, setSaving] = useState(false)

  // ... (Keep addSet, removeSet, updateSet, handleParseNotes exactly as they are)

// ...
  // --- THE SMART COPY ADDER ---
  const addSet = () => {
    setSets(s => {
      const lastSet = s[s.length - 1];
      // If there's a previous set, copy its exact values. Otherwise, blank.
      if (lastSet) {
        return [...s, { ...lastSet }]; 
      }
      return [...s, { exercise: '', weight: '', reps: '' }];
    })
  }
  
  const removeSet = (i) => setSets(s => s.filter((_, idx) => idx !== i))
  const updateSet = (i, k, v) => setSets(s => s.map((row, idx) => idx === i ? { ...row, [k]: v } : row))

  const totalVolume = sets.reduce((acc, s) => {
    const w = parseFloat(s.weight) || 0
    const r = parseInt(s.reps) || 0
    return acc + (w * r)
  }, 0)

  // --- THE MAGIC NOTES PARSER ---
  const handleParseNotes = () => {
    if (!notesText.trim()) return;
    
    const lines = notesText.split('\n');
    const parsedSets = [];
    
    const regex = /([a-zA-Z\s\-]+)\s*(\d+(?:\.\d+)?)\s*(?:kg|lbs|lb)?\s*[xX\*]\s*(\d+)/i;

    lines.forEach(line => {
      const match = line.match(regex);
      if (match) {
        parsedSets.push({
          exercise: match[1].trim(), 
          weight: match[2],          
          reps: match[3],            
          // RPE completely removed here
        });
      }
    });

    if (parsedSets.length > 0) {
      setSets(prev => {
        const filtered = prev.filter(s => s.exercise || s.weight || s.reps);
        return [...filtered, ...parsedSets];
      });
      setNotesText(''); 
      setShowPaste(false); // Close the box after successful paste
    } else {
      alert("Format not recognized. Try: 'Bench Press 100 x 5'");
    }
  }

// --- THE SMART SAVER ---
  const handleSave = async () => {
    if (!name.trim()) return alert('Please name this session.')
    const validSets = sets.filter(s => s.exercise && s.weight && s.reps)
    if (!validSets.length) return alert('Add at least one complete set.')
    
    setSaving(true)

    const finalizedSets = [];
    for (let s of validSets) {
      let finalExId = s.exercise;
      let finalExName = s.exercise;

      const existingEx = exercises.find(e => 
        e.id === s.exercise || 
        e.name.toLowerCase() === s.exercise.toLowerCase()
      );

      if (existingEx) {
        finalExId = existingEx.id; 
        finalExName = existingEx.name;
      } else {
        const newDbEx = await createExercise(s.exercise);
        if (newDbEx) {
          finalExId = newDbEx.id;
          finalExName = newDbEx.name;
        }
      }

      finalizedSets.push({
        exercise: { id: finalExId, name: finalExName }, 
        weight: parseFloat(s.weight),
        reps: parseInt(s.reps)
      });
    }

    // --- NEW DYNAMIC SAVE LOGIC ---
    // 1. Package the data up into a "payload"
    const payload = {
      name: name.trim(),
      sets: finalizedSets,
      // If we are editing, smuggle the old date. Otherwise, leave it blank!
      date: isEditing ? editData.date : undefined
    };

    // 2. Decide where to send it based on our mode
    let success;
    if (isEditing) {
      // If editing, use the update function and pass the original ID
      success = await updateWorkout(editData.id, payload); 
    } else {
      // If cloning or brand new, log a new one
      success = await logWorkout(payload);
    }
    
    if (success) {
      navigate('/workouts');
    } else {
      setSaving(false);
    }
  }
  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>LOG SESSION</h1>
          <p style={styles.subtitle}>Record every set. Track every rep.</p>
        </div>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>SESSION INFO</div>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>SESSION NAME</label>
            <input type="text" placeholder="e.g. Upper A" value={name} onChange={e => setName(e.target.value)} style={styles.input} />
          </div>
          {/* Duration input completely removed */}
        </div>
      </div>

      {/* --- COLLAPSIBLE MAGIC PASTE BOX --- */}
      <div style={{...styles.card, background: 'var(--col-surface-2)', padding: showPaste ? '20px 24px' : '12px 24px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{...styles.cardTitle, marginBottom: 0}}>QUICK PASTE</div>
          <button 
            onClick={() => setShowPaste(!showPaste)} 
            style={{background: 'none', border: 'none', color: 'var(--col-text-3)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer'}}
          >
            {showPaste ? 'Hide ↑' : 'Show Text Box ↓'}
          </button>
        </div>
        
        {showPaste && (
          <div style={{marginTop: '16px'}}>
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--col-text-3)'}}>Format: Exercise 100 x 5</span>
            <textarea
              placeholder="Squat 140 x 5&#10;Squat 140 x 5&#10;Leg Press 220 x 10"
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
              style={styles.textarea}
            />
            <button onClick={handleParseNotes} style={styles.parseBtn}>Parse Text to Sets ↓</button>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={styles.cardTitle}>SETS</div>
          {totalVolume > 0 && <div style={styles.volumeBadge}>Total: {(totalVolume / 1000).toFixed(1)}k lbs</div>}
        </div>

        <div style={styles.setHeader}>
          <div style={styles.sh1}>EXERCISE</div>
          <div style={styles.sh2}>WEIGHT</div>
          <div style={styles.sh3}>REPS</div>
          <div style={styles.sh5} />
        </div>

        {sets.map((s, i) => (
          <div key={i} style={styles.setRow}>
            <div style={styles.sh1}>
              <input
                list="exercises-list"
                placeholder="Type or select..."
                value={s.exercise}
                onChange={e => updateSet(i, 'exercise', e.target.value)}
                style={styles.select}
              />
              <datalist id="exercises-list">
                {exercises.map(ex => <option key={ex.id} value={ex.name} />)}
              </datalist>
            </div>
            <div style={styles.sh2}>
              <input type="number" placeholder="100" value={s.weight} onChange={e => updateSet(i, 'weight', e.target.value)} style={styles.numInput} />
            </div>
            <div style={styles.sh3}>
              <input type="number" placeholder="5" value={s.reps} onChange={e => updateSet(i, 'reps', e.target.value)} style={styles.numInput} />
            </div>
            <div style={styles.sh5}>
              {sets.length > 1 && <button onClick={() => removeSet(i)} style={styles.removeBtn}>×</button>}
            </div>
          </div>
        ))}

        <button onClick={addSet} style={styles.addSetBtn}>+ ADD SET</button>
      </div>

      <div style={styles.actions}>
        <button onClick={handleSave} disabled={saving} style={{ ...styles.saveBtn, ...(saving ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}>
          {saving ? 'SAVING TO CLOUD...' : 'SAVE SESSION'}
        </button>
        <button onClick={() => navigate('/workouts')} style={styles.cancelBtn}>Cancel</button>
      </div>
    </div>
  )
}

const styles = {
  textarea: {
    width: '100%',
    height: '80px',
    padding: '12px 14px',
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--col-text)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    outline: 'none',
    resize: 'vertical',
    marginTop: '12px',
  },
  parseBtn: {
    marginTop: '12px',
    padding: '8px 16px',
    background: 'var(--col-surface-3)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--col-text-inv)',
    backgroundColor: '#f0f0f5', 
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '12px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
  root: {
    padding: '32px',
    maxWidth: '860px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    animation: 'fadeIn 0.4s ease both',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  backBtn: {
    padding: '8px 16px',
    background: 'var(--col-surface)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--col-text-2)',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
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
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minWidth: '200px',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.1em',
  },
  input: {
    padding: '10px 14px',
    background: 'var(--col-surface-2)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--col-text)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  },
  volumeBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--col-accent)',
    background: 'var(--col-accent-glow)',
    border: '1px solid rgba(232,33,43,0.25)',
    borderRadius: 'var(--radius-sm)',
    padding: '4px 10px',
    letterSpacing: '0.05em',
  },
  // WIDER COLUMNS: Gave the space from RPE to Weight and Reps
  setHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 160px 160px 40px',
    gap: '10px',
    padding: '8px 4px',
    marginBottom: '4px',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--col-text-3)',
    letterSpacing: '0.1em',
  },
  setRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 160px 160px 40px',
    gap: '10px',
    padding: '6px 0',
    alignItems: 'center',
    borderBottom: '1px solid var(--col-border)',
  },
  sh1: {}, sh2: {}, sh3: {}, sh5: {},
  select: {
    width: '100%',
    padding: '8px 10px',
    background: 'var(--col-surface-2)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--col-text)',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
  },
  numInput: {
    width: '100%',
    padding: '8px 10px',
    background: 'var(--col-surface-2)',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--col-text)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    outline: 'none',
    textAlign: 'right',
  },
  removeBtn: {
    width: '28px',
    height: '28px',
    background: 'none',
    border: '1px solid rgba(232,33,43,0.25)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--col-accent)',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSetBtn: {
    marginTop: '12px',
    padding: '10px',
    width: '100%',
    background: 'none',
    border: '1px dashed var(--col-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--col-text-3)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '13px',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'border-color 150ms, color 150ms',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  saveBtn: {
    padding: '14px 28px',
    background: 'var(--col-accent)',
    border: 'none',
    borderRadius: 'var(--radius)',
    color: '#fff',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '16px',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'background 150ms',
  },
  cancelBtn: {
    padding: '14px 20px',
    background: 'none',
    border: '1px solid var(--col-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--col-text-2)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
}