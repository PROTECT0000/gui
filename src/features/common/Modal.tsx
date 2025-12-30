import React, { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer }: {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-[92%] max-w-sm border border-[#2A2A2A] rounded-[8px] bg-black p-4">
        <div className="text-sm font-semibold text-white mb-2">{title}</div>
        <div className="text-sm text-[#B3B3B3]">{children}</div>
        {footer && <div className="mt-4 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, onClose, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, loading = false }: {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  message: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  loading?: boolean
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div>{message}</div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="text-xs border border-[#2A2A2A] rounded-[6px] px-3 py-1 text-[#B3B3B3] hover:text-white disabled:opacity-60"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="text-xs border border-[#3A3A3A] rounded-[6px] px-3 py-1"
          style={{ color: '#E74C3C' }}
        >
          {loading ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

