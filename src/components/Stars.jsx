// Star rating exposed to assistive technology as a single labelled image.
export default function Stars({ value }) {
  const filled = Math.round(value)
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      <span aria-hidden="true">
        {'★'.repeat(filled)}
        {'☆'.repeat(5 - filled)}
      </span>
    </span>
  )
}
