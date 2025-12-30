import { } from 'react'
import { useCursorPager } from '../common/useCursorPager'
import { listCctvs } from './api'
import type { Camera } from './types'
import { FiVideo } from 'react-icons/fi'
import Section from '../common/Section'
import { StatusPill } from '../common/Pills'

// Use shared Section component

export default function CctvsPage() {
  const pager = useCursorPager<Camera>(async (cursor) => listCctvs({ cursor, pageSize: 30 }))

  return (
    <div className="p-4 space-y-4">
      <Section title={<><FiVideo className="text-[#B3B3B3]"/> CCTVs</>}>
        <div className="text-xs text-[#B3B3B3] border border-[#2A2A2A] rounded-[6px] p-3 mb-3">
          TODO: Video player UI. This placeholder shows camera tiles; integrate real player (no stream yet).
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pager.items.map((c) => (
            <div key={c.id} className="border border-[#2A2A2A] rounded-[8px] bg-black overflow-hidden">
              <div className="relative" style={{ paddingTop: '56.25%' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-sm text-[#B3B3B3]">TODO: Video Player</div>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-[#2A2A2A]">
                <div>
                  <div className="text-sm text-white">{c.name}</div>
                  <div className="text-xs text-[#B3B3B3]">{c.location || '—'}</div>
                </div>
                <StatusPill status={c.status} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          {pager.error && <div className="text-red-400 text-sm">{pager.error}</div>}
          <button disabled={!pager.hasMore || pager.loading} onClick={()=>pager.loadMore()} className="border border-[#2A2A2A] rounded-[6px] px-3 py-1 text-sm text-[#B3B3B3] hover:text-white disabled:opacity-60">
            {pager.loading ? 'Loading…' : pager.hasMore ? 'Load more' : 'No more'}
          </button>
        </div>
      </Section>
    </div>
  )
}
