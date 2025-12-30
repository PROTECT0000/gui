import http from '../../api/http'
import type { MinerList, Miner, MinerCreate } from './types'

export async function listMiners(params: { cursor?: string; pageSize?: number; status?: 'online' | 'offline' } = {}) {
  const { data } = await http.get<MinerList>('/miners', { params })
  return data
}

export async function getMiner(minerId: string): Promise<Miner> {
  const { data } = await http.get<Miner>(`/miners/${encodeURIComponent(minerId)}`)
  return data
}

export async function createMiner(payload: MinerCreate): Promise<Miner> {
  const { data } = await http.post<Miner>('/miners', payload)
  return data
}
