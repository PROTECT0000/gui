import { useCallback, useEffect, useRef, useState } from 'react'

export interface CursorPage<T> {
  items: T[]
  nextCursor?: string | null
  hasMore: boolean
}

export function useCursorPageNav<T>(fetchPage: (cursor?: string) => Promise<CursorPage<T>>) {
  const [pages, setPages] = useState<Array<CursorPage<T>>>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const init = useRef(false)

  const loadNextInternal = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const cursor = pages.length === 0 ? undefined : pages[pages.length - 1].nextCursor ?? undefined
      const page = await fetchPage(cursor)
      setPages((prev) => [...prev, page])
      if (!init.current) {
        setPageIndex(0)
        init.current = true
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to load'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [fetchPage, pages])

  const ensurePage = useCallback(async (index: number) => {
    if (index < pages.length) return
    // load sequentially until we have the requested index or no more
    while (pages.length <= index) {
      const last = pages[pages.length - 1]
      if (pages.length > 0 && last && !last.hasMore) break
      await loadNextInternal()
      const updatedLast = pages[pages.length - 1]
      if (updatedLast && !updatedLast.hasMore) break
    }
  }, [loadNextInternal, pages])

  const goTo = useCallback(async (index: number) => {
    if (index < 0) return
    await ensurePage(index)
    if (index < pages.length) setPageIndex(index)
  }, [ensurePage, pages.length])

  const next = useCallback(async () => {
    await goTo(pageIndex + 1)
  }, [goTo, pageIndex])

  const prev = useCallback(async () => {
    goTo(pageIndex - 1)
  }, [goTo, pageIndex])

  const reset = useCallback(() => {
    setPages([])
    setPageIndex(0)
    setLoading(false)
    setError(null)
    init.current = false
  }, [])

  useEffect(() => {
    if (!init.current) {
      void loadNextInternal()
    }
  }, [loadNextInternal])

  const current = pages[pageIndex]?.items ?? []
  const hasMore = pages.length > 0 ? pages[pages.length - 1].hasMore : true
  const currentNextCursor = pages[pageIndex]?.nextCursor
  const currentHasMore = pages[pageIndex]?.hasMore ?? true

  return {
    items: current,
    pageIndex,
    pagesLoaded: pages.length,
    hasMore,
    currentNextCursor,
    currentHasMore,
    loading,
    error,
    goTo,
    next,
    prev,
    reset,
  }
}
