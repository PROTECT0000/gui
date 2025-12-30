export interface StatsOverview {
  miners: { total: number; online: number; offline: number }
  alerts: {
    open: number
    acknowledged: number
    resolved: number
    bySeverity: { critical: number; warning: number; info: number }
  }
}

export interface OnlinePoint {
  timestamp: string
  online: number
  total: number
}

export interface OnlineSeries {
  items: OnlinePoint[]
}

export interface AvgBodyTemp {
  averageBodyTempC: number | null
  sampleSize: number
  computedAt: string
}
