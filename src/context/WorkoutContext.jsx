import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { API_URL, getHeaders } from '../api'

const WorkoutContext = createContext(null)

export function WorkoutProvider({ children }) {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [exercises, setExercises] = useState([])

  // 1. FETCH FROM YOUR SPRING BOOT DATABASE
  useEffect(() => {
    if (user && user.id) {
      fetch(`${API_URL}/users/${user.id}/workouts`, { headers: getHeaders() })
        .then(res => res.json())
        .then(data => setWorkouts(Array.isArray(data) ? data : []))
        .catch(err => console.error("Failed to load workouts:", err))

      fetch(`${API_URL}/exercises?userId=${user.id}`, { headers: getHeaders() })
        .then(res => res.json())
        .then(data => setExercises(Array.isArray(data) ? data : []))
        .catch(err => console.error("Failed to load exercises:", err))
    } else {
      setWorkouts([])
      setExercises([])
    }
  }, [user])

  // 2. SAVE WORKOUT
  const logWorkout = async (workoutData) => {
    if (!user || !user.id) return false;
    try {
      const shellRes = await fetch(`${API_URL}/users/${user.id}/workouts`, {
        method: 'POST',
        headers: getHeaders(), 
        body: JSON.stringify({ name: workoutData.name })

      });

      if (!shellRes.ok) throw new Error("Failed to create workout shell");
      const newWorkout = await shellRes.json();

      for (let s of workoutData.sets) {
        await fetch(`${API_URL}/workouts/${newWorkout.id}/sets`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            reps: s.reps,
            weight: s.weight,
            exercise: s.exercise 
          })
        });
      }

      const refreshRes = await fetch(`${API_URL}/users/${user.id}/workouts`, { headers: getHeaders() });
      if (refreshRes.ok) setWorkouts(await refreshRes.json());
      
      return true;
    } catch (err) {
      console.error("Failed to save workout", err);
      alert("Network error: Could not save to cloud.");
      return false;
    }
  }

  // 3. DELETE WORKOUT
  const deleteWorkout = async (id) => {
    try {
      const res = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      if (res.ok) {
        setWorkouts(workouts.filter(w => w.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete workout", err)
    }
  }

 // 4. UPDATE WORKOUT (The Proper, Production-Ready Way!)
  const updateWorkout = async (oldId, workoutData) => {
    if (!user || !user.id) return false;
    try {
      // Send a single, clean PUT request to our newly upgraded Java endpoint
      const res = await fetch(`${API_URL}/users/${user.id}/workouts/${oldId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          name: workoutData.name,
          sets: workoutData.sets // Send the new array of sets directly!
        })
      });

      if (!res.ok) throw new Error("Failed to update workout");

      // Refresh the dashboard data quietly in the background
      const refreshRes = await fetch(`${API_URL}/users/${user.id}/workouts`, { headers: getHeaders() });
      if (refreshRes.ok) setWorkouts(await refreshRes.json());

      return true;

    } catch (err) {
      console.error("Failed to update workout", err);
      alert("Network error: Could not update in cloud.");
      return false;
    }
  }

  // 5. CREATE CUSTOM EXERCISE
  const createExercise = async (name) => {
    if (!user || !user.id) return null;
    try {
      const res = await fetch(`${API_URL}/exercises?userId=${user.id}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: name, category: 'custom' }) 
      })
      if (res.ok) {
        const newEx = await res.json()
        setExercises(prev => [...prev, newEx]) 
        return newEx
      }
    } catch (err) {
      console.error("Failed to create custom exercise", err)
    }
    return null;
  }

  // --- HELPER FUNCTIONS ---
  const unit = 'lbs';

  const displayWeight = (rawWeight) => {
    if (!rawWeight) return 0;
    return rawWeight; 
  }

  const getExercise = (id) => exercises.find(e => e.id === id || e.name === id)

  const getPersonalBests = () => {
    const pbs = {}
    workouts.forEach(w => {
      w.sets?.forEach(s => {
        const e1rm = s.weight * (1 + s.reps / 30)
        const exId = s.exercise?.id || s.exercise
        const exName = s.exercise?.name || s.exercise 
        
        if (!pbs[exId] || e1rm > pbs[exId].e1rm) {
          pbs[exId] = { 
            name: exName, 
            weight: s.weight, 
            reps: s.reps, 
            e1rm: Math.round(e1rm), 
            date: w.date 
          }
        }
      })
    })
    return pbs
  }

  const getVolumeByWeek = () => {
    const byDate = {}
    workouts.forEach(w => {
      if(!w.date) return;
      const week = w.date.slice(0, 7)
      byDate[week] = (byDate[week] || 0) + (w.totalVolume || 0)
    })
    return Object.entries(byDate).map(([week, volume]) => ({ week, volume })).slice(-12)
  }

  const getStreak = () => workouts.length ? 1 : 0

  return (
    <WorkoutContext.Provider value={{ 
      workouts, 
      exercises, 
      unit,          
      displayWeight, 
      createExercise,
      logWorkout, 
      deleteWorkout, 
      updateWorkout, // <--- Added to the exporter here!
      getExercise, 
      getPersonalBests, 
      getVolumeByWeek, 
      getStreak 
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext)
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider')
  return ctx
}