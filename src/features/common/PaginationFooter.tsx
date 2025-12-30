import React from 'react'

export default function PaginationFooter({
  loading,
  hasMore,
  error,
  onLoadMore,
  right,
}: {
  loading: boolean
  hasMore: boolean
  error?: string | null
  onLoadMore: () => void
  right?: React.ReactNode
}) {
  return (
    <div className="mt-3 flex items-center gap-3">
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button
        disabled={!hasMore || loading}
        onClick={onLoadMore}
        className="border border-[#2A2A2A] rounded-[6px] px-3 py-1 text-sm text-[#B3B3B3] hover:text-white disabled:opacity-60"
      >
        {loading ? 'Loading…' : hasMore ? 'Load more' : 'No more'}
      </button>
      {right}
    </div>
  )}

