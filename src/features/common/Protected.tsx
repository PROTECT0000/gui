import { Navigate, useLocation } from 'react-router'
import { getToken } from '../../api/http'
import { ReactNode } from 'react'

export function Protected({ children }: { children: ReactNode }) {
  const token = getToken()
  const loc = useLocation()
  if (!token) return <Navigate to="/" replace state={{ from: loc }} />
  return <>{children}</>
}

