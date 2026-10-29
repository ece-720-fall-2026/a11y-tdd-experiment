import { useState } from 'react'

export default function WishlistButton() {
  const [saved, setSaved] = useState(false)

  return (
    <button
      type="button"
      className={saved ? 'wishlist-button is-saved' : 'wishlist-button'}
      aria-pressed={saved}
      onClick={() => setSaved((value) => !value)}
    >
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="22" height="22">
        <path
          d="M12 20.3 4.6 13.1C2.6 11.2 2.5 8 4.4 6.1a4.6 4.6 0 0 1 6.5 0L12 7.2l1.1-1.1a4.6 4.6 0 0 1 6.5 0c1.9 1.9 1.8 5.1-.2 7L12 20.3Z"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <span>Wishlist</span>
    </button>
  )
}
