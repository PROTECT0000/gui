export interface TelemetryPoint {
  id?: string
  minerId: string
  timestamp: string
  bodyTemp: number
  heatIndexC?: number | null
}

export interface TelemetryList {
  items: TelemetryPoint[]
  nextCursor?: string | null
  hasMore: boolean
}

export interface MinerSeriesPoint {
  timestamp: string
  bodyTemp: number
  heatIndexC?: number | null
}

export interface MinerSeriesResponse {
  items: MinerSeriesPoint[]
}
