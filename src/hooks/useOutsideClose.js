import { useEffect } from 'react'

// Calls onClose when a pointer goes down outside ref's element while active.
export function useOutsideClose(ref, active, onClose) {
  useEffect(() => {
    if (!active) return
    function handlePointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) onClose()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [ref, active, onClose])
}
