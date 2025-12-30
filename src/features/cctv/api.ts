import http from '../../api/http'
import type { CameraList, CameraStatus } from './types'

export async function listCctvs(params: { cursor?: string; pageSize?: number; status?: CameraStatus } = {}) {
  const { data } = await http.get<CameraList>('/cctvs', { params })
  return data
}

