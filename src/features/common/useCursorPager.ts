import { useCallback, useEffect, useRef, useState } from 'react'

export function useCursorPager<T>(fetchPage: (cursor?: string) => Promise<{ items: T[]; nextCursor?: string | null; hasMore: boolean }>) {
  const [items, setItems] = useState<T[]>([])
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const init = useRef(false)

  const loadMore = useCallback(async () => {
    if (loading || (!hasMore && init.current)) return
    setLoading(true)
    setError(null)
    try {
      const page = await fetchPage(cursor)
      setItems((prev) => [...prev, ...page.items])
      setCursor(page.nextCursor ?? undefined)
      setHasMore(page.hasMore)
      init.current = true
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to load'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [cursor, fetchPage, hasMore, loading])

  useEffect(() => {
    if (!init.current) {
      void loadMore()
    }
  }, [loadMore])

  return { items, hasMore, loadMore, loading, error, reset: () => { setItems([]); setCursor(undefined); setHasMore(true); init.current = false } }
}

