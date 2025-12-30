import http from '../../api/http'
import type { StatsOverview, OnlineSeries, AvgBodyTemp } from './types'

export async function getStats(): Promise<StatsOverview> {
  const { data } = await http.get<StatsOverview>('/stats')
  return data
}

export async function getOnlineSeries(params?: { from?: string; to?: string; bucket?: 'minute' | 'hour' }): Promise<OnlineSeries> {
  const { data } = await http.get<OnlineSeries>('/stats/online-series', { params })
  return data
}

export async function getAvgBodyTemp(params?: { status?: 'online' | 'offline' | 'all' }): Promise<AvgBodyTemp> {
  const { data } = await http.get<AvgBodyTemp>('/stats/avg-body-temp', { params })
  return data
}
