import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API_URL, getHeaders } from '../api'

const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('lifts_token')
    const userData = localStorage.getItem('lifts_user')

    if (token && userData) {
      const decoded = decodeToken(token)
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(JSON.parse(userData))
      } else {
        localStorage.removeItem('lifts_token')
        localStorage.removeItem('lifts_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    setLoading(true)

    try {
      // FIX 1: Point to your actual /login route
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) throw new Error('Invalid email or password.')

      const data = await res.json()
      
      // Spring Boot usually serializes 'jwtToken' to 'jwtToken' or 'token' depending on your DTO
      const token = data.jwtToken || data.token 
      
      // FIX 2: Catch the ID from Spring Boot!
      const safeUser = { 
        id: data.id, 
        email: data.email || email, 
        role: 'athlete', 
        name: data.firstName || email.split('@')[0] 
      }

      localStorage.setItem('lifts_token', token)
      localStorage.setItem('lifts_user', JSON.stringify(safeUser))

      setUser(safeUser)
      return safeUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // FIX 3: Send 'firstName' instead of 'name' to match your Java User model
        body: JSON.stringify({ firstName: name, email: email, password: password })
      })

      if (!res.ok) throw new Error('Registration failed. Email might be in use.')

      const data = await res.json()
      const token = data.jwtToken || data.token
      
      // Catch the ID here too!
      const newUser = { 
        id: data.id, 
        email: data.email || email, 
        name: data.firstName || name, 
        role: 'athlete' 
      }

      localStorage.setItem('lifts_token', token)
      localStorage.setItem('lifts_user', JSON.stringify(newUser))

      setUser(newUser)
      return newUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('lifts_token')
    localStorage.removeItem('lifts_user')
    setUser(null)
  }, [])

  const hasRole = useCallback((roles) => {
    if (!user) return false
    return typeof roles === 'string' ? user.role === roles : roles.includes(user.role)
  }, [user])

  const isAdmin = user?.role === 'admin'
  const isCoach = user?.role === 'coach' || user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, hasRole, isAdmin, isCoach, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}