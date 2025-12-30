import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { FiMap, FiThermometer, FiWifi, FiSun, FiBattery } from 'react-icons/fi'
import Section from '../common/Section'
import DummyMap from './DummyMap'
import { getMapBackground, listMinerPositions } from './api'
import type { MinerPosition } from './types'

export default function MapPage() {
  const navigate = useNavigate()
  const [positions, setPositions] = useState<MinerPosition[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [centerKey, setCenterKey] = useState(0)
  const [backgroundUrl, setBackgroundUrl] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')
  const [focusId, setFocusId] = useState<string | null>(null)
  const onLocate = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const q = search.trim().toLowerCase()
    if (!q) return
    const found = positions.find(m => m.name.toLowerCase() === q || m.minerId.toLowerCase() === q) ||
                  positions.find(m => m.name.toLowerCase().includes(q))
    if (found && found.lastKnownLocation) {
      setFocusId(found.minerId)
    }
  }
  const zoomOut = () => setZoom(z => Math.max(0.6, Math.round((z - 0.2) * 10) / 10))
  const zoomIn = () => setZoom(z => Math.min(2.0, Math.round((z + 0.2) * 10) / 10))
  const recenter = () => setCenterKey(k => k + 1)
  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    listMinerPositions()
      .then((d) => { if (mounted){ setPositions(d.items); console.log(d.items); }})
      .catch((e: any) => { if (mounted) setError(e?.response?.data?.message || 'Failed to load positions') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    getMapBackground()
      .then((d) => { if (mounted && d?.url) { setBackgroundUrl(d.url) } })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  const action = (
    <div className="flex items-center gap-2">
      {loading && <span className="text-xs text-[#B3B3B3]">Loading…</span>}
      {error && <span className="text-xs text-red-400">{error}</span>}
      <form onSubmit={onLocate} className="hidden md:flex items-center gap-1">
        <input
          list="map-miners-list"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-black text-[#B3B3B3] border border-[#2A2A2A] rounded-[6px] px-2 py-1 text-xs w-[200px]"
          placeholder="Search miner…"
        />
        <datalist id="map-miners-list">
          {positions.map(m => (
            <option key={m.minerId} value={m.name} />
          ))}
        </datalist>
        <button type="submit" className="text-xs text-[#B3B3B3] hover:text-white border border-[#2A2A2A] rounded-[6px] px-2 py-1">Locate</button>
      </form>
      <div className="flex items-center gap-1">
        <button
          onClick={zoomOut}
          className="text-xs text-[#B3B3B3] hover:text-white border border-[#2A2A2A] rounded-[6px] px-2 py-1"
          title="Zoom out"
        >
          −
        </button>
        <div className="text-xs text-[#B3B3B3] min-w-[40px] text-center">{Math.round(zoom * 100)}%</div>
        <button
          onClick={zoomIn}
          className="text-xs text-[#B3B3B3] hover:text-white border border-[#2A2A2A] rounded-[6px] px-2 py-1"
          title="Zoom in"
        >
          +
        </button>
      </div>
      <button
        onClick={recenter}
        className="text-xs text-[#B3B3B3] hover:text-white border border-[#2A2A2A] rounded-[6px] px-2 py-1"
      >
        Recenter
      </button>
    </div>
  )

  const points = positions
    .filter(m => !!m.lastKnownLocation)
    .map(m => ({
      id: m.minerId,
      name: m.name,
      status: m.deviceStatus,
      lat: m.lastKnownLocation!.lat,
      lng: m.lastKnownLocation!.lng,
      data: m,
    }))

  return (
    <div className="p-4">
      <div className="h-[calc(100vh-4rem)]">
        <Section title={<><FiMap className="text-[#B3B3B3]"/> Map</>} action={action} fill>
          <div className="relative h-full">
            <DummyMap
              points={points}
              draggable
              finite
              zoom={zoom}
              centerKey={centerKey}
              backgroundImageUrl={backgroundUrl}
              showGrid
              gridSizePx={80}
              nameClassName="text-[13px] font-semibold"
              focusId={focusId}
              renderDetail={(p) => {
                const m = p.data as MinerPosition | undefined
                const temp = m?.lastBodyTemp != null ? `${m.lastBodyTemp.toFixed(1)}°C` : '—'
                const rssi = m?.lastSignalRssi != null ? `${m.lastSignalRssi} dBm` : '—'
                const hi = m?.lastHeatIndexC != null ? `${m.lastHeatIndexC.toFixed(1)}°C` : '—'
                const batt = m?.lastBatteryPct != null ? `${m.lastBatteryPct}%` : '—'
                const Item = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
                  <span className="inline-flex items-center gap-1 text-[#B3B3B3] font-semibold">
                    <span className="text-[#B3B3B3]" style={{ lineHeight: 0 }}>{icon}</span>
                    <span>{value}</span>
                  </span>
                )
                const Dot = () => <span className="mx-1 text-[#B3B3B3] opacity-50">·</span>
                return (
                  <div className="flex flex-wrap items-center">
                    <Item icon={<FiThermometer size={14} />} value={temp} />
                    <Dot />
                    <Item icon={<FiWifi size={14} />} value={rssi} />
                    <Dot />
                    <Item icon={<FiSun size={14} />} value={hi} />
                    <Dot />
                    <Item icon={<FiBattery size={14} />} value={batt} />
                  </div>
                )
              }}
              onSelect={(id) => navigate(`/miners/${encodeURIComponent(id)}`)}
              height="100%"
            />

            {/* Mobile search/locate overlay */}
            <div className="md:hidden absolute left-2 right-2 bottom-2 z-10">
              <form onSubmit={onLocate} className="flex items-center gap-2">
                <input
                  list="map-miners-list-mobile"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-black text-white border border-[#2A2A2A] rounded-[6px] px-3 py-2 text-sm"
                  placeholder="Search miner…"
                />
                <button
                  type="submit"
                  className="text-sm rounded-[6px] px-3 py-2"
                  style={{ backgroundColor: '#1DB954', color: '#000', border: '1px solid #1DB954' }}
                >
                  Locate
                </button>
              </form>
              <datalist id="map-miners-list-mobile">
                {positions.map(m => (
                  <option key={m.minerId} value={m.name} />
                ))}
              </datalist>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
