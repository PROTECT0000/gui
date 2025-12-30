export type AlertStatus = 'open' | 'acknowledged' | 'resolved'
export type AlertSeverity = 'critical' | 'warning' | 'info'

export interface Alert {
  id: string
  minerId: string
  type: 'fall' | 'abnormal_heart_rate' | 'device_offline' | 'high_temperature' | string
  severity: AlertSeverity
  status: AlertStatus
  message: string
  createdAt: string
  acknowledgedAt?: string | null
}

export interface AlertList {
  items: Alert[]
  nextCursor?: string | null
  hasMore: boolean
}

