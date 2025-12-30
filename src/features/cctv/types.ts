export type CameraStatus = 'online' | 'offline'

export interface Camera {
  id: string
  name: string
  location?: string | null
  status: CameraStatus
}

export interface CameraList {
  items: Camera[]
  nextCursor?: string | null
  hasMore: boolean
}

