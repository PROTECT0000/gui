import http from '../../api/http'
import type { AlertList, AlertStatus } from './types'

export async function listAlerts(params: { cursor?: string; pageSize?: number; status?: AlertStatus; minerId?: string } = {}) {
  const { data } = await http.get<AlertList>('/alerts', { params })
  return data
}

export async function acknowledgeAlert(alertId: string) {
  const { data } = await http.post(`/alerts/${encodeURIComponent(alertId)}/acknowledge`)
  return data
}

