import http from '../../api/http'

export async function triggerAlarm(payload: { durationSec?: number } = {}) {
  const { data } = await http.post<{ accepted: boolean; triggeredAt: string }>(
    '/alarm/trigger',
    Object.keys(payload).length ? payload : undefined
  )
  return data
}

