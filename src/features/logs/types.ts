export type LogLevel = 'alert' | 'warning' | 'notice' | 'info'

export interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  message: string
  minerId?: string | null
  context?: Record<string, unknown> | null
}

export interface LogEntryList {
  items: LogEntry[]
  nextCursor?: string | null
  hasMore: boolean
}

