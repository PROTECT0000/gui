type Point = {
  id: string
  name: string
  status: 'online' | 'offline'
  lat: number
  lng: number
}

export function DummyMap({
  points,
  selectedId,
  onSelect,
  height = 280,
}: {
  points: Point[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  height?: number | string
}) {
  const hasPoints = points.length > 0
  const lats = hasPoints ? points.map(p => p.lat) : [0]
  const lngs = hasPoints ? points.map(p => p.lng) : [0]
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const spanLat = maxLat - minLat
  const spanLng = maxLng - minLng
  const padLat = Math.max(spanLat * 0.1, 0.0005)
  const padLng = Math.max(spanLng * 0.1, 0.0005)
  const baseMinLat = minLat - padLat
  const baseMaxLat = maxLat + padLat
  const baseMinLng = minLng - padLng
  const baseMaxLng = maxLng + padLng
  // Expand the fitted bounds by a factor to zoom out (default 2x)
  const factor = 2
  const centerLat = (baseMinLat + baseMaxLat) / 2
  const centerLng = (baseMinLng + baseMaxLng) / 2
  const halfLat = ((baseMaxLat - baseMinLat) / 2) * factor
  const halfLng = ((baseMaxLng - baseMinLng) / 2) * factor
  const fitMinLat = centerLat - halfLat
  const fitMaxLat = centerLat + halfLat
  const fitMinLng = centerLng - halfLng
  const fitMaxLng = centerLng + halfLng

  const toXY = (lat: number, lng: number) => {
    // If all points identical (or single point), center it
    if (spanLat < 1e-9 && spanLng < 1e-9) {
      return { x: 0.5, y: 0.5 }
    }
    const x = (lng - fitMinLng) / Math.max(fitMaxLng - fitMinLng, 1e-9)
    const y = (fitMaxLat - lat) / Math.max(fitMaxLat - fitMinLat, 1e-9)
    return { x, y }
  }

  return (
    <div className="relative w-full border border-[#2A2A2A] rounded-[8px] bg-black" style={{ height }}>
      {/* Grid */}
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 0' }} />

      {/* Markers */}
      {points.map((p) => {
        const { x, y } = toXY(p.lat, p.lng)
        const left = `${Math.max(0, Math.min(1, x)) * 100}%`
        const top = `${Math.max(0, Math.min(1, y)) * 100}%`
        const isSelected = p.id === selectedId
        const color = p.status === 'online' ? '#1DB954' : '#A0A0A0'
        const size = isSelected ? 10 : 8
        return (
          <div
            key={p.id}
            className="absolute"
            style={{ left, top, transform: 'translate(-50%, -50%)' }}
            title={`${p.name} (${p.lat.toFixed(4)}, ${p.lng.toFixed(4)})`}
          >
            <div className="relative inline-block" style={{ width: size, height: size }}>
              <span
                className="map-ripple"
                style={{ width: size * 2, height: size * 2, borderColor: color, zIndex: 1 }}
              />
              <span
                className="map-ripple delayed"
                style={{ width: size * 2, height: size * 2, borderColor: color, zIndex: 1 }}
              />
              <button
                onClick={() => onSelect?.(p.id)}
                className="rounded-full border align-middle"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: size,
                  height: size,
                  backgroundColor: color,
                  borderColor: '#2A2A2A',
                  boxShadow: 'none',
                  zIndex: 2,
                }}
              />
            </div>
            <span
              className="ml-2 px-1.5 py-0.5 text-[11px] text-[#B3B3B3] bg-black border border-[#2A2A2A] rounded-[6px] select-none"
              style={{ lineHeight: 1 }}
            >
              {p.name}
            </span>
          </div>
        )
      })}

      <div className="absolute left-2 bottom-2 text-xs text-[#B3B3B3] bg-black border border-[#2A2A2A] rounded-[6px] px-2 py-1">
        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#1DB954' }} /> Online
        <span className="mx-2"/>
        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#A0A0A0' }} /> Offline
      </div>
    </div>
  )
}

export default DummyMap
