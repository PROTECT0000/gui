import http from '../../api/http'
import type { TelemetryList, MinerSeriesResponse } from './types'

export async function listTelemetry(minerId: string, params: { cursor?: string; pageSize?: number; from?: string; to?: string } = {}) {
  const { data } = await http.get<TelemetryList>(`/miners/${encodeURIComponent(minerId)}/telemetry`, { params })
  return data
}

export async function getMinerSeries(minerId: string, params: { from: string; to: string; bucket?: 'minute' | 'hour' }) {
  const { data } = await http.get<MinerSeriesResponse>(`/miners/${encodeURIComponent(minerId)}/telemetry/series`, { params })
  return data
}
