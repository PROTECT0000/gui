import React from 'react'
import { FiGrid } from 'react-icons/fi'

export function StatusPill({ status }: { status: 'online' | 'offline' }) {
  const color = status === 'online' ? '#1DB954' : '#A0A0A0'
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] border border-[#2A2A2A] text-xs" style={{ color }}>
      {status}
    </span>
  )
}

export function ZonePill({ zone, withIcon = false }: { zone?: 'red' | 'green' | 'gray' | null; withIcon?: boolean }) {
  const map: Record<string, string> = { red: '#E74C3C', green: '#1DB954', gray: '#B3B3B3' }
  const label = zone ? `${zone} zone` : '—'
  const color = zone ? map[zone] : '#B3B3B3'
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] border border-[#2A2A2A] text-xs" style={{ color }}>
      {withIcon && <FiGrid />}
      {label}
    </span>
  )
}

