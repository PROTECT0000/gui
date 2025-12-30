import { useState } from 'react'
import { useCursorPager } from '../common/useCursorPager'
import { listLogs } from './api'
import type { LogEntry, LogLevel } from './types'
import { FiList } from 'react-icons/fi'
import Section from '../common/Section'
import moment from 'moment'
import PaginationFooter from '../common/PaginationFooter'

// Use shared Section component

export default function LogsPage() {
  const [level, setLevel] = useState<LogLevel | 'all'>('all')
  const pager = useCursorPager<LogEntry>(async (cursor) => listLogs({ cursor, pageSize: 50, level: level === 'all' ? undefined : level }))

  return (
    <div className="p-4">
      <Section title={<><FiList className="text-[#B3B3B3]"/> Logs</>} action={
        <select value={level} onChange={(e)=>{ setLevel(e.target.value as any); pager.reset() }} className="bg-black text-[#B3B3B3] border border-[#2A2A2A] rounded-[6px] px-2 py-1 text-sm">
          <option value="all">All</option>
          <option value="alert">Alert</option>
          <option value="warning">Warning</option>
          <option value="notice">Notice</option>
          <option value="info">Info</option>
        </select>
      }>
        <ul className="divide-y divide-[#2A2A2A]">
          {pager.items.map((l) => (
            <li key={l.id} className="py-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-[#B3B3B3]">{moment(l.timestamp).isValid() ? moment(l.timestamp).format('YYYY-MM-DD HH:mm:ss') : '—'}</div>
                  <div className="text-sm">{l.message}</div>
                  {l.minerId && <div className="text-xs text-[#B3B3B3]">Miner: {l.minerId}</div>}
                </div>
                <span className="text-xs border border-[#3A3A3A] rounded-[6px] px-2 py-0.5 text-[#B3B3B3]">{l.level}</span>
              </div>
            </li>
          ))}
        </ul>
        <PaginationFooter loading={pager.loading} hasMore={pager.hasMore} error={pager.error} onLoadMore={()=>pager.loadMore()} />
      </Section>
    </div>
  )
}
