import { useState } from 'react'
import { useCursorPager } from '../common/useCursorPager'
import { listAlerts, acknowledgeAlert } from './api'
import type { Alert, AlertStatus } from './types'
import { FiAlertTriangle } from 'react-icons/fi'
import Section from '../common/Section'
import moment from 'moment'
import PaginationFooter from '../common/PaginationFooter'

// Use shared Section component

export default function AlertsPage() {
  const [status, setStatus] = useState<AlertStatus | 'all'>('open')
  const pager = useCursorPager<Alert>(async (cursor) => listAlerts({ cursor, pageSize: 50, status: status === 'all' ? undefined : status }))

  return (
    <div className="p-4">
      <Section title={<><FiAlertTriangle className="text-[#B3B3B3]"/> Alerts</>} action={
        <select value={status} onChange={(e)=>{ setStatus(e.target.value as any); pager.reset() }} className="bg-black text-[#B3B3B3] border border-[#2A2A2A] rounded-[6px] px-2 py-1 text-sm">
          <option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
          <option value="all">All</option>
        </select>
      }>
        <ul className="divide-y divide-[#2A2A2A]">
          {pager.items.map((a) => (
            <li key={a.id} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm">{a.type.replaceAll('_', ' ')}</div>
                  <div className="text-xs text-[#B3B3B3]">{a.message}</div>
                  <div className="text-xs text-[#B3B3B3]">{moment(a.createdAt).isValid() ? moment(a.createdAt).format('YYYY-MM-DD HH:mm:ss') : '—'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400 border border-[#3A3A3A] rounded-[6px] px-2 py-0.5">{a.severity}</span>
                  {a.status === 'open' && (
                    <button
                      onClick={async () => { await acknowledgeAlert(a.id); pager.reset() }}
                      className="text-xs text-[#B3B3B3] hover:text-white border border-[#2A2A2A] rounded-[6px] px-2 py-0.5"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <PaginationFooter loading={pager.loading} hasMore={pager.hasMore} error={pager.error} onLoadMore={()=>pager.loadMore()} />
      </Section>
    </div>
  )
}
