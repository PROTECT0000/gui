import { useState, useEffect } from 'react'
import { useCursorPager } from '../common/useCursorPager'
import { listMiners, createMiner } from './api'
import type { Miner } from './types'
import { FiUsers, FiUser, FiCpu, FiMapPin, FiActivity, FiClock, FiSun, FiThermometer, FiBattery, FiGrid, FiWifi, FiTrendingUp } from 'react-icons/fi'
import { Link } from 'react-router'
import moment from 'moment'

import Section from '../common/Section'
import TableHeaderCell from '../common/TableHeaderCell'
import { StatusPill, ZonePill } from '../common/Pills'
import Modal from '../common/Modal'

function formatDate(s?: string | null) {
  if (!s) return '—'
  const m = moment(s)
  return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '—'
}

export default function MinersPage() {
  const [status, setStatus] = useState<'all' | 'online' | 'offline'>('all')
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const pager = useCursorPager<Miner>(async (cursor) => listMiners({ cursor, pageSize: 20, status: status === 'all' ? undefined : status, q: debouncedQ || undefined }))
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim()), 300)
    return () => clearTimeout(id)
  }, [q])
  useEffect(() => {
    pager.reset()
  }, [status, debouncedQ])
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [form, setForm] = useState({ minerId: '', name: '', deviceSerial: '', team: '' })
  const canSave = form.minerId.trim() && form.name.trim() && form.deviceSerial.trim()
  const onSave = async () => {
    if (!canSave) return
    setSaving(true)
    setErr(null)
    try {
      await createMiner({ minerId: form.minerId.trim(), name: form.name.trim(), deviceSerial: form.deviceSerial.trim(), team: form.team.trim() || null })
      setOpen(false)
      setForm({ minerId: '', name: '', deviceSerial: '', team: '' })
      pager.reset()
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Failed to create miner')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4">
      <Section title={<><FiUsers className="text-[#B3B3B3]"/> Miners</>} action={
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <input
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              placeholder="Search miners…"
              className="bg-black text-[#B3B3B3] border border-[#2A2A2A] rounded-[6px] px-2 py-1 text-sm w-[220px]"
            />
          </div>
          <select value={status} onChange={(e)=>{ setStatus(e.target.value as any); pager.reset() }} className="bg-black text-[#B3B3B3] border border-[#2A2A2A] rounded-[6px] px-2 py-1 text-sm">
            <option value="all">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          <button onClick={()=>setOpen(true)} className="text-xs text-[#B3B3B3] hover:text-white border border-[#2A2A2A] rounded-[6px] px-2 py-1">Add miner</button>
        </div>
      }>
        {/* Mobile search row */}
        <div className="md:hidden mb-3">
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Search miners…"
            className="w-full bg-black text-[#B3B3B3] border border-[#2A2A2A] rounded-[6px] px-2 py-2 text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="text-[#B3B3B3]">
              <tr className="border-b border-[#2A2A2A]">
                <TableHeaderCell icon={<FiUser />}>Miner</TableHeaderCell>
                <TableHeaderCell icon={<FiCpu />}>Device</TableHeaderCell>
                <TableHeaderCell icon={<FiUsers />}>Team</TableHeaderCell>
                <TableHeaderCell icon={<FiSun />}>Heat Index</TableHeaderCell>
                <TableHeaderCell icon={<FiThermometer />}>Temp</TableHeaderCell>
                <TableHeaderCell icon={<FiBattery />}>Battery</TableHeaderCell>
                <TableHeaderCell icon={<FiWifi />}>RSSI</TableHeaderCell>
                <TableHeaderCell icon={<FiMapPin />}>Position</TableHeaderCell>
                <TableHeaderCell icon={<FiTrendingUp />}>Altitude</TableHeaderCell>
                <TableHeaderCell icon={<FiGrid />}>Zone</TableHeaderCell>
                <TableHeaderCell icon={<FiActivity />}>Status</TableHeaderCell>
                <TableHeaderCell icon={<FiClock />}>Last seen</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {pager.items.map((m) => (
                <tr key={m.minerId} className="border-b border-[#2A2A2A]">
                  <td className="py-2 px-2 whitespace-nowrap"><Link to={`/miners/${encodeURIComponent(m.minerId)}`} className="hover:underline text-white">{m.name}</Link></td>
                  <td className="py-2 px-2 text-[#B3B3B3] whitespace-nowrap">{m.deviceSerial}</td>
                  <td className="py-2 px-2 text-[#B3B3B3] whitespace-nowrap">{m.team || '—'}</td>
                  <td className="py-2 px-2 text-[#B3B3B3] whitespace-nowrap">{m.lastHeatIndexC != null ? `${m.lastHeatIndexC.toFixed(1)}°C` : '—'}</td>
                  <td className="py-2 px-2 text-[#B3B3B3] whitespace-nowrap">{m.lastBodyTemp != null ? `${m.lastBodyTemp.toFixed(1)}°C` : '—'}</td>
                  <td className="py-2 px-2 text-[#B3B3B3] whitespace-nowrap">{m.lastBatteryPct != null ? `${m.lastBatteryPct}%` : '—'}</td>
                  <td className="py-2 px-2 text-[#B3B3B3] whitespace-nowrap">{m.lastSignalRssi != null ? `${m.lastSignalRssi} dBm` : '—'}</td>
                  <td className="py-2 px-2 text-[#B3B3B3] whitespace-nowrap">{m.lastKnownLocation ? `${m.lastKnownLocation.lat.toFixed(3)}, ${m.lastKnownLocation.lng.toFixed(3)}` : '—'}</td>
                  <td className="py-2 px-2 text-[#B3B3B3] whitespace-nowrap">{m.lastKnownLocation?.altitudeM != null ? `${m.lastKnownLocation.altitudeM} m` : '—'}</td>
                  <td className="py-2 px-2 whitespace-nowrap"><ZonePill zone={m.zone ?? null} withIcon /></td>
                  <td className="py-2 px-2 whitespace-nowrap"><StatusPill status={m.deviceStatus} /></td>
                  <td className="py-2 px-2 text-[#B3B3B3] whitespace-nowrap">{formatDate(m.lastSeen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-3">
          {pager.error && <div className="text-red-400 text-sm">{pager.error}</div>}
          <button disabled={!pager.hasMore || pager.loading} onClick={()=>pager.loadMore()} className="border border-[#2A2A2A] rounded-[6px] px-3 py-1 text-sm text-[#B3B3B3] hover:text-white disabled:opacity-60">
            {pager.loading ? 'Loading…' : pager.hasMore ? 'Load more' : 'No more'}
          </button>
        </div>
      </Section>
      <Modal
        open={open}
        onClose={() => !saving && setOpen(false)}
        title={<span>Add miner</span>}
        footer={
          <>
            {err && <span className="text-xs text-red-400 mr-auto">{err}</span>}
            <button onClick={()=>setOpen(false)} disabled={saving} className="text-xs border border-[#2A2A2A] rounded-[6px] px-3 py-1 text-[#B3B3B3] hover:text-white disabled:opacity-60">Cancel</button>
            <button onClick={onSave} disabled={!canSave || saving} className="text-xs border border-[#3A3A3A] rounded-[6px] px-3 py-1" style={{ color: '#FFFFFF' }}>{saving ? 'Saving…' : 'Save'}</button>
          </>
        }
      >
        <div className="space-y-2">
          <div>
            <div className="text-xs text-[#B3B3B3] mb-1">Miner ID</div>
            <input value={form.minerId} onChange={(e)=>setForm(f=>({ ...f, minerId: e.target.value }))} className="w-full bg-black text-white border border-[#2A2A2A] rounded-[6px] px-2 py-1 text-sm" placeholder="mnr-001" />
          </div>
          <div>
            <div className="text-xs text-[#B3B3B3] mb-1">Name</div>
            <input value={form.name} onChange={(e)=>setForm(f=>({ ...f, name: e.target.value }))} className="w-full bg-black text-white border border-[#2A2A2A] rounded-[6px] px-2 py-1 text-sm" placeholder="Alice Carter" />
          </div>
          <div>
            <div className="text-xs text-[#B3B3B3] mb-1">Device Serial</div>
            <input value={form.deviceSerial} onChange={(e)=>setForm(f=>({ ...f, deviceSerial: e.target.value }))} className="w-full bg-black text-white border border-[#2A2A2A] rounded-[6px] px-2 py-1 text-sm" placeholder="DEV-XXXXXX" />
          </div>
          <div>
            <div className="text-xs text-[#B3B3B3] mb-1">Team (optional)</div>
            <input value={form.team} onChange={(e)=>setForm(f=>({ ...f, team: e.target.value }))} className="w-full bg-black text-white border border-[#2A2A2A] rounded-[6px] px-2 py-1 text-sm" placeholder="North Shift" />
          </div>
          {!canSave && <div className="text-[11px] text-[#B3B3B3]">Miner ID, Name, and Device Serial are required.</div>}
        </div>
      </Modal>
    </div>
  )
}
