import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/auth.api'
import { getToken, setToken, removeToken } from '../utils/token'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken()
      if (token) {
        try {
          const res = await getMe()
          setUser(res.data)
        } catch (error) {
          removeToken()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = (token, userInfo) => {
    setToken(token)
    setUser(userInfo)
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
