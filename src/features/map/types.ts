export interface MinerPosition {
  minerId: string
  name: string
  deviceStatus: 'online' | 'offline'
  lastKnownLocation?: { lat: number; lng: number; altitudeM?: number | null } | null
  lastBodyTemp?: number | null
  lastHeatIndexC?: number | null
  lastSignalRssi?: number | null
  lastBatteryPct?: number | null
}

export interface MinerPositionList {
  items: MinerPosition[]
}

export interface MapBackground {
  url: string
}
