export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userId?: string
  name?: string
  expiresAt: string // RFC 3339
}

