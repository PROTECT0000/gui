import { useState } from 'react'
import { getToken } from '../../api/http'
import { Navigate } from 'react-router'
import moment from 'moment'
import { login } from './api'

export default function LoginPage() {
  if (getToken()) return <Navigate to="/dashboard" replace />
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      const res = await login({ username, password })
      setInfo(`Session active until ${moment(res.expiresAt).isValid() ? moment(res.expiresAt).format('YYYY-MM-DD HH:mm:ss') : res.expiresAt}`)
      // Redirect to dashboard on success
      window.location.href = '/dashboard'
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <span className="block text-sm text-[#B3B3B3] mb-1">Username</span>
            <input
              className="w-full bg-black text-white placeholder-[#A0A0A0] border border-[#2A2A2A] rounded-[6px] px-3 py-2 focus:outline-none focus:border-[#3A3A3A]"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </label>
          <label className="block">
            <span className="block text-sm text-[#B3B3B3] mb-1">Password</span>
            <input
              className="w-full bg-black text-white placeholder-[#A0A0A0] border border-[#2A2A2A] rounded-[6px] px-3 py-2 focus:outline-none focus:border-[#3A3A3A]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#111111] hover:bg-[#161616] disabled:opacity-60 text-white border border-[#2A2A2A] rounded-[6px] px-3 py-2 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {error && (
          <div className="mt-3 text-sm text-red-400 border border-[#3A3A3A] rounded-[6px] px-3 py-2">
            {error}
          </div>
        )}
        {info && (
          <div className="mt-3 text-sm text-[#B3B3B3] border border-[#2A2A2A] rounded-[6px] px-3 py-2">
            {info}
          </div>
        )}
      </div>
    </div>
  )
}
