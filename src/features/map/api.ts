import http from '../../api/http'
import type { MinerPositionList } from './types'
import type { MapBackground } from './types'

export async function listMinerPositions() {
  const { data } = await http.get<MinerPositionList>('/miners/positions')
  return data
}

export async function getMapBackground() {
  const { data } = await http.get<MapBackground>('/map/background')
  return data
}
