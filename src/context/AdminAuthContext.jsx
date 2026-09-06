import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { fetchCurrentAdmin, loginAdmin, logoutAdmin, ApiError } from '../lib/api.js'

const AdminAuthContext = createContext(null)

// 'checking' | 'authenticated' | 'anonymous'
export function AdminAuthProvider({ children }) {
  const [status, setStatus] = useState('checking')
  const [username, setUsername] = useState(null)

  const checkSession = useCallback(async () => {
    try {
      const data = await fetchCurrentAdmin()
      setUsername(data.username)
      setStatus('authenticated')
      return true
    } catch {
      setUsername(null)
      setStatus('anonymous')
      return false
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = useCallback(async (user, pass) => {
    // Throws ApiError on failure — caller renders the message.
    const data = await loginAdmin(user, pass)
    setUsername(data.username)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutAdmin()
    } catch {
      // Even if the network call fails, drop the local session state.
    }
    setUsername(null)
    setStatus('anonymous')
  }, [])

  return (
    <AdminAuthContext.Provider value={{ status, username, login, logout, refresh: checkSession }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

export { ApiError }
