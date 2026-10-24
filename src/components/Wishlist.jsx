export default function Wishlist({ saved, onToggle, name }) {
  return (
    <button
      type="button"
      className={`wishlist-btn${saved ? ' is-saved' : ''}`}
      aria-pressed={saved}
      onClick={onToggle}
    >
      <span aria-hidden="true">{saved ? '♥' : '♡'}</span>
      {saved ? `Saved ${name} to wishlist` : 'Save to wishlist'}
    </button>
  )
}
