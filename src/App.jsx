import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { WorkoutProvider } from './context/WorkoutContext'
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute'
import AppLayout from './components/AppLayout'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import WorkoutsPage from './pages/WorkoutsPage'
import NewWorkoutPage from './pages/NewWorkoutPage'
import ProgressPage from './pages/ProgressPage'
import ProgramsPage from './pages/ProgramsPage'
import AdminPage from './pages/AdminPage'
import CoachPage from './pages/CoachPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkoutProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <GuestRoute><LoginPage /></GuestRoute>
            } />
            <Route path="/register" element={
              <GuestRoute><RegisterPage /></GuestRoute>
            } />

            {/* Protected app routes */}
            <Route element={
              <ProtectedRoute><AppLayout /></ProtectedRoute>
            }>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/workouts" element={<WorkoutsPage />} />
              <Route path="/workouts/new" element={<NewWorkoutPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/programs" element={<ProgramsPage />} />

              {/* Coach-only */}
              <Route path="/coach" element={
                <ProtectedRoute requiredRole={['admin', 'coach']}>
                  <CoachPage />
                </ProtectedRoute>
              } />

              {/* Admin-only */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              } />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </WorkoutProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
