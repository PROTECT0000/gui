export interface Miner {
  minerId: string
  name: string
  deviceSerial: string
  team?: string | null
  lastSeen?: string | null
  deviceStatus: 'online' | 'offline'
  lastKnownLocation?: { lat: number; lng: number; altitudeM?: number | null } | null
  lastBodyTemp?: number | null
  lastHeatIndexC?: number | null
  lastSignalRssi?: number | null
  zone?: 'red' | 'green' | 'gray' | null
  lastBatteryPct?: number | null
}

export interface MinerList {
  items: Miner[]
  nextCursor?: string | null
  hasMore: boolean
}

export interface MinerCreate {
  minerId: string
  name: string
  deviceSerial: string
  team?: string | null
}

export interface MinerProfileImage {
  url: string
}
