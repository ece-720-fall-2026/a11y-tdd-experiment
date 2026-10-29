import { useEffect } from 'react'

// Calls onDismiss when the shopper presses Escape or clicks outside ref.
export function useDismiss(ref, open, onDismiss) {
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onDismiss()
    }
    function onPointer(e) {
      if (ref.current && !ref.current.contains(e.target)) onDismiss()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [ref, open, onDismiss])
}
