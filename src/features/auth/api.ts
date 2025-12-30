import http, { setToken } from '../../api/http'
import type { LoginRequest, LoginResponse } from './types'

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>('/auth/login', body)
  setToken(data.token)
  return data
}

export async function logout(): Promise<void> {
  await http.post('/auth/logout')
  setToken(null)
}

