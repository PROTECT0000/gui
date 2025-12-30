import http from '../../api/http'
import type { LogEntryList, LogLevel } from './types'

export async function listLogs(params: { cursor?: string; pageSize?: number; level?: LogLevel; minerId?: string; from?: string; to?: string } = {}) {
  const { data } = await http.get<LogEntryList>('/logs', { params })
  return data
}

