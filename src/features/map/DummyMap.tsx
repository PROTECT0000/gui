type Point = {
  id: string
  name: string
  status: 'online' | 'offline'
  lat: number
  lng: number
  data?: any
}

import { useEffect, useRef, useState } from 'react'

export function DummyMap({
  points,
  selectedId,
  onSelect,
  height = 280,
  draggable = false,
  finite = false,
  panLimitPx,
  zoom = 1,
  centerKey,
  backgroundImageUrl,
  showGrid = true,
  gridSizePx = 40,
  renderDetail,
  nameClassName,
  focusId,
}: {
  points: Point[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  height?: number | string
  draggable?: boolean
  finite?: boolean
  panLimitPx?: number
  zoom?: number
  centerKey?: number
  backgroundImageUrl?: string | null
  showGrid?: boolean
  gridSizePx?: number
  renderDetail?: (point: Point) => React.ReactNode
  nameClassName?: string
  focusId?: string | null
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

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Recenter trigger
  useEffect(() => {
    setOffset({ x: 0, y: 0 })
  }, [centerKey])

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return
    if ('touches' in e) e.preventDefault()
    setDragging(true)
    const pt = 'touches' in e ? e.touches[0] : (e as React.MouseEvent)
    lastPos.current = { x: pt.clientX, y: pt.clientY }
  }
  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable || !dragging || !lastPos.current) return
    if ('touches' in e) e.preventDefault()
    const pt = 'touches' in e ? e.touches[0] : (e as React.MouseEvent)
    const dx = pt.clientX - lastPos.current.x
    const dy = pt.clientY - lastPos.current.y
    lastPos.current = { x: pt.clientX, y: pt.clientY }
    if (finite) {
      const w = containerRef.current?.clientWidth || 0
      const h = containerRef.current?.clientHeight || 0
      const worldScale = backgroundImageUrl ? 2 : 1
      const extraX = ((worldScale - 1) * w) / 2
      const extraY = ((worldScale - 1) * h) / 2
      const baseX = panLimitPx != null ? panLimitPx : (extraX > 0 ? extraX : w * 0.5)
      const baseY = panLimitPx != null ? panLimitPx : (extraY > 0 ? extraY : h * 0.5)
      const limX = baseX * Math.max(zoom, 1)
      const limY = baseY * Math.max(zoom, 1)
      setOffset((o) => ({
        x: Math.max(-limX, Math.min(limX, o.x + dx)),
        y: Math.max(-limY, Math.min(limY, o.y + dy)),
      }))
    } else {
      setOffset((o) => ({ x: o.x + dx, y: o.y + dy }))
    }
  }
  const endDrag = () => {
    if (!draggable) return
    setDragging(false)
    lastPos.current = null
  }

  const gridSize = gridSizePx
  const bgX = ((offset.x % gridSize) + gridSize) % gridSize
  const bgY = ((offset.y % gridSize) + gridSize) % gridSize
  const worldScale = backgroundImageUrl ? 2 : 1
  const gridLineColor = backgroundImageUrl ? 'rgba(255,255,255,0.10)' : '#0a0a0a'

  // Recenter to a particular point when focusId changes
  useEffect(() => {
    if (!focusId) return
    const target = points.find(p => p.id === focusId)
    if (!target) return
    const el = containerRef.current
    if (!el) return
    const w = el.clientWidth
    const h = el.clientHeight
    const { x, y } = toXY(target.lat, target.lng)
    const worldW = w * worldScale
    const worldH = h * worldScale
    const dxWorld = (x - 0.5) * worldW
    const dyWorld = (y - 0.5) * worldH
    const nx = -dxWorld / Math.max(zoom, 1e-6)
    const ny = -dyWorld / Math.max(zoom, 1e-6)
    if (finite) {
      const extraX = ((worldScale - 1) * w) / 2
      const extraY = ((worldScale - 1) * h) / 2
      const baseX = panLimitPx != null ? panLimitPx : (extraX > 0 ? extraX : w * 0.5)
      const baseY = panLimitPx != null ? panLimitPx : (extraY > 0 ? extraY : h * 0.5)
      const limX = baseX * Math.max(zoom, 1)
      const limY = baseY * Math.max(zoom, 1)
      setOffset({ x: Math.max(-limX, Math.min(limX, nx)), y: Math.max(-limY, Math.min(limY, ny)) })
    } else {
      setOffset({ x: nx, y: ny })
    }
  }, [focusId, zoom, worldScale, finite, panLimitPx, points])

  return (
    <div
      ref={containerRef}
      className="relative w-full border border-[#2A2A2A] rounded-[8px] bg-black select-none overflow-hidden"
      style={{ height, cursor: draggable ? (dragging ? 'grabbing' : 'grab') : 'default' }}
      onMouseDown={onDown as any}
      onMouseMove={onMove as any}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={onDown as any}
      onTouchMove={onMove as any}
      onTouchEnd={endDrag}
    >
      {showGrid && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundPosition: `${bgX}px ${bgY}px, ${bgX}px ${bgY}px`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      )}

      {/* Pan/drag world base (image) */}
      <div
        className="absolute"
        style={{
          width: `${worldScale * 100}%`,
          height: `${worldScale * 100}%`,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          zIndex: 1,
        }}
      >
        {backgroundImageUrl && (
          <img
            src={backgroundImageUrl}
            alt="Map background"
            className="absolute inset-0 w-full h-full"
            draggable={false}
            aria-hidden
            style={{ objectFit: 'cover', opacity: 0.9, userSelect: 'none', pointerEvents: 'none' }}
          />
        )}
      </div>

      {/* Pan/drag world markers (always above grid) */}
      <div
        className="absolute"
        style={{
          width: `${worldScale * 100}%`,
          height: `${worldScale * 100}%`,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          zIndex: 3,
        }}
      >
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
            {onSelect ? (
              <button
                onClick={() => onSelect?.(p.id)}
                className={`ml-2 px-1.5 py-0.5 ${nameClassName ? nameClassName : 'text-[11px]'} text-[#B3B3B3] hover:text-white hover:underline bg-black border border-[#2A2A2A] rounded-[6px] cursor-pointer`}
                style={{ lineHeight: 1 }}
                title={`View ${p.name}`}
              >
                {p.name}
              </button>
            ) : (
              <span
                className={`ml-2 px-1.5 py-0.5 ${nameClassName ? nameClassName : 'text-[11px]'} text-[#B3B3B3] bg-black border border-[#2A2A2A] rounded-[6px] select-none`}
                style={{ lineHeight: 1 }}
              >
                {p.name}
              </span>
            )}
            {renderDetail && (
              <div className="ml-2 mt-1 px-1.5 py-1 text-[12px] font-semibold text-[#B3B3B3] bg-black/70 border border-[#2A2A2A] rounded-[6px] select-none" style={{ lineHeight: 1.25 }}>
                {renderDetail(p)}
              </div>
            )}
            </div>
          )
        })}
      </div>

      {/* Legend stays anchored */}
      <div className="absolute left-2 bottom-2 text-xs text-[#B3B3B3] bg-black border border-[#2A2A2A] rounded-[6px] px-2 py-1" style={{ zIndex: 4 }}>
        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#1DB954' }} /> Online
        <span className="mx-2"/>
        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#A0A0A0' }} /> Offline
      </div>
    </div>
  )
}

export default DummyMap
