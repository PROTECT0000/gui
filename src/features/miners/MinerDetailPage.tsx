import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { getMiner } from './api'
import type { Miner } from './types'
import moment from 'moment'
import { ConfirmDialog } from '../common/Modal'
import { FiPhone, FiAlertTriangle } from 'react-icons/fi'
import DummyMap from '../map/DummyMap'
import { getMinerSeries } from '../telemetry/api'
import type { MinerSeriesPoint } from '../telemetry/types'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip } from 'recharts'
import Section from '../common/Section'
import { StatusPill, ZonePill } from '../common/Pills'

// Use shared Section component

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-[#2A2A2A] py-2">
      <div className="text-xs text-[#B3B3B3]">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  )
}

export default function MinerDetailPage() {
  const { minerId } = useParams()
  const [miner, setMiner] = useState<Miner | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [series, setSeries] = useState<MinerSeriesPoint[] | null>(null)
  const [telemetryError, setTelemetryError] = useState<string | null>(null)
  const [telemetryLoading, setTelemetryLoading] = useState<boolean>(false)
  const [callOpen, setCallOpen] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const onCall = () => setCallOpen(true)
  const onEmergency = () => setEmergencyOpen(true)

  useEffect(() => {
    let mounted = true
    if (!minerId) return
    setLoading(true)
    setError(null)
    getMiner(minerId)
      .then((d) => { if (mounted) setMiner(d) })
      .catch((e) => { if (mounted) setError(e?.response?.data?.message || 'Failed to load miner') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [minerId])

  useEffect(() => {
    let mounted = true
    if (!minerId) return
    const to = new Date()
    const from = new Date(Date.now() - 6 * 60 * 60 * 1000)
    setTelemetryLoading(true)
    setTelemetryError(null)
    getMinerSeries(minerId, { from: from.toISOString(), to: to.toISOString(), bucket: 'hour' })
      .then((d) => { if (mounted) setSeries(d.items) })
      .catch((e) => { if (mounted) setTelemetryError(e?.response?.data?.message || 'Failed to load telemetry') })
      .finally(() => { if (mounted) setTelemetryLoading(false) })
    return () => { mounted = false }
  }, [minerId])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[#B3B3B3]">
          <Link to="/miners" className="text-[#B3B3B3] hover:text-white">← Back to Miners</Link>
        </div>
      </div>

      <Section
        title={<span>Miner Details</span>}
        action={
          <div className="flex items-center gap-2">
            <button onClick={onCall} className="text-xs text-[#B3B3B3] hover:text-white border border-[#2A2A2A] rounded-[6px] px-3 py-1 inline-flex items-center gap-1">
              <FiPhone className="text-[#B3B3B3]" />
              <span>Call miner</span>
            </button>
            <button onClick={onEmergency} className="text-xs text-[#E74C3C] hover:text-white border border-[#3A3A3A] rounded-[6px] px-3 py-1 inline-flex items-center gap-1">
              <FiAlertTriangle />
              <span>Mark as Emergency</span>
            </button>
          </div>
        }
      >
        {loading && <div className="text-xs text-[#B3B3B3]">Loading…</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
        {miner && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <Field label="ID" value={miner.minerId} />
              <Field label="Name" value={miner.name} />
              <Field label="Device" value={miner.deviceSerial} />
              <Field label="Team" value={miner.team || '—'} />
              <Field label="Status" value={<StatusPill status={miner.deviceStatus} />} />
              <Field label="Last seen" value={miner.lastSeen ? moment(miner.lastSeen).format('YYYY-MM-DD HH:mm:ss') : '—'} />
              <Field label="Heat index" value={miner.lastHeatIndexC != null ? `${miner.lastHeatIndexC.toFixed(1)}°C` : '—'} />
              <Field label="Body temp" value={miner.lastBodyTemp != null ? `${miner.lastBodyTemp.toFixed(1)}°C` : '—'} />
              <Field label="Battery" value={miner.lastBatteryPct != null ? `${miner.lastBatteryPct}%` : '—'} />
              <Field label="Signal RSSI" value={miner.lastSignalRssi != null ? `${miner.lastSignalRssi} dBm` : '—'} />
              <Field label="Zone" value={<ZonePill zone={miner.zone ?? null} withIcon />} />
              <Field label="Position" value={miner.lastKnownLocation ? `${miner.lastKnownLocation.lat.toFixed(3)}, ${miner.lastKnownLocation.lng.toFixed(3)}` : '—'} />
              <Field label="Altitude" value={miner.lastKnownLocation?.altitudeM != null ? `${miner.lastKnownLocation.altitudeM} m` : '—'} />
            </div>
            <div>
              <div className="text-xs text-[#B3B3B3] mb-2">Last known location</div>
              <div className="h-64">
                {miner.lastKnownLocation ? (
                  <DummyMap
                    points={[{ id: miner.minerId, name: miner.name, status: miner.deviceStatus, lat: miner.lastKnownLocation.lat, lng: miner.lastKnownLocation.lng }]}
                    height="100%"
                  />
                ) : (
                  <div className="h-full border border-[#2A2A2A] rounded-[8px] flex items-center justify-center text-xs text-[#B3B3B3]">No location</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Section>
      <Section title={<span>Historical (last 6 hours)</span>}>
        {telemetryLoading && <div className="text-xs text-[#B3B3B3]">Loading…</div>}
        {telemetryError && <div className="text-sm text-red-400">{telemetryError}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#2A2A2A] rounded-[8px] p-3">
            <div className="text-sm text-[#B3B3B3] mb-2">Heat index</div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={(series || []).map(p => ({ t: moment(p.timestamp).format('HH:mm'), hi: p.heatIndexC }))}>
                  <CartesianGrid stroke="#0a0a0a" strokeDasharray="3 3" />
                  <XAxis dataKey="t" tick={{ fill: '#B3B3B3', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} tickLine={{ stroke: '#2A2A2A' }} />
                  <YAxis allowDecimals tick={{ fill: '#B3B3B3', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} tickLine={{ stroke: '#2A2A2A' }} />
                  <RTooltip contentStyle={{ background: '#000', border: '1px solid #2A2A2A', color: '#fff', borderRadius: 6 }} labelStyle={{ color: '#B3B3B3' }} itemStyle={{ color: '#FFFFFF' }} formatter={(value: any) => [`${value}°C`, 'Heat index']} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
                  <Area type="monotone" dataKey="hi" stroke="#7F8C8D" fill="rgba(127,140,141,0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="border border-[#2A2A2A] rounded-[8px] p-3">
            <div className="text-sm text-[#B3B3B3] mb-2">Body temperature</div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={(series || []).map(p => ({ t: moment(p.timestamp).format('HH:mm'), temp: p.bodyTemp }))}>
                  <CartesianGrid stroke="#0a0a0a" strokeDasharray="3 3" />
                  <XAxis dataKey="t" tick={{ fill: '#B3B3B3', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} tickLine={{ stroke: '#2A2A2A' }} />
                  <YAxis allowDecimals tick={{ fill: '#B3B3B3', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} tickLine={{ stroke: '#2A2A2A' }} />
                  <RTooltip contentStyle={{ background: '#000', border: '1px solid #2A2A2A', color: '#fff', borderRadius: 6 }} labelStyle={{ color: '#B3B3B3' }} itemStyle={{ color: '#FFFFFF' }} formatter={(value: any) => [`${value}°C`, 'Temp']} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
                  <Area type="monotone" dataKey="temp" stroke="#E67E22" fill="rgba(230,126,34,0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Section>
      <ConfirmDialog
        open={callOpen}
        onClose={() => setCallOpen(false)}
        title={<span>Initiate call</span>}
        message={<span>Call {miner?.name || 'miner'} at their registered number?</span>}
        confirmLabel="Call"
        onConfirm={() => setCallOpen(false)}
      />
      <ConfirmDialog
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        title={<span className="inline-flex items-center gap-2"><FiAlertTriangle /> Confirm emergency</span>}
        message={<span>This will mark the miner as an emergency. Proceed?</span>}
        confirmLabel="Confirm"
        onConfirm={() => setEmergencyOpen(false)}
      />
    </div>
  )
}
