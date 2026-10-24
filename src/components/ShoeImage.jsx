// Placeholder "photo" of the shoe, drawn as SVG in the chosen colour.
const VIEWS = {
  side: 'Side view',
  top: 'Top view',
  back: 'Heel view',
  sole: 'Outsole',
}

export const VIEW_ORDER = ['side', 'top', 'back', 'sole']

export function viewLabel(view) {
  return VIEWS[view]
}

export default function ShoeImage({ view, color, trim, label }) {
  const upper = color.hex
  const trimColor = trim
  const dark = '#18191c'
  const lightShade = 'rgba(255,255,255,0.18)'

  let art
  if (view === 'side') {
    art = (
      <>
        <path d="M70 300 L530 300 C552 300 556 332 534 338 L82 338 C60 332 56 304 70 300Z" fill={dark} />
        <path d="M86 236 C104 160 196 124 292 152 L360 176 C420 188 468 202 520 232 C546 248 540 296 508 302 L92 302 C68 296 70 256 86 236Z" fill={upper} />
        <path d="M92 282 L512 282 L508 302 L92 302Z" fill={trimColor} opacity="0.9" />
        <path d="M126 218 C146 196 190 186 230 192" fill="none" stroke={lightShade} strokeWidth="10" strokeLinecap="round" />
        <g stroke={dark} strokeWidth="5" strokeLinecap="round" opacity="0.7">
          <path d="M268 160 L292 184" />
          <path d="M292 152 L318 176" />
          <path d="M318 148 L344 170" />
        </g>
        <path d="M96 236 C112 218 130 214 150 220 C136 240 120 262 98 270Z" fill={dark} opacity="0.85" />
      </>
    )
  } else if (view === 'top') {
    art = (
      <>
        <path d="M60 210 C60 128 150 96 250 100 C380 106 500 142 540 206 C500 268 380 306 250 310 C150 314 60 290 60 210Z" fill={upper} />
        <path d="M120 200 C200 180 300 180 400 200" fill="none" stroke={trimColor} strokeWidth="8" strokeLinecap="round" />
        <g stroke={dark} strokeWidth="5" strokeLinecap="round" opacity="0.6">
          <path d="M300 170 L330 190" /><path d="M330 166 L360 186" /><path d="M360 164 L390 184" />
        </g>
        <path d="M80 232 C120 280 200 296 260 298" fill="none" stroke={dark} strokeWidth="8" strokeLinecap="round" opacity="0.5" />
      </>
    )
  } else if (view === 'back') {
    art = (
      <>
        <path d="M230 40 C330 40 380 120 380 230 L380 330 C380 362 340 372 300 372 C260 372 220 362 220 330 L220 230 C220 120 230 40 230 40Z" fill={upper} />
        <path d="M262 46 L338 46 L340 96 L260 96Z" fill={trimColor} />
        <path d="M240 150 C250 120 350 120 360 150" fill="none" stroke={lightShade} strokeWidth="10" strokeLinecap="round" />
        <path d="M220 330 C220 340 380 340 380 330 L380 352 C380 364 220 364 220 352Z" fill={dark} />
      </>
    )
  } else {
    art = (
      <>
        <path d="M70 230 C70 150 160 120 300 124 C440 124 530 160 530 230 C530 300 440 336 300 336 C160 336 70 300 70 230Z" fill={dark} />
        <path d="M96 230 C96 170 170 146 300 150 C420 150 504 176 504 230 C504 286 420 312 300 312 C170 312 96 286 96 230Z" fill={upper} opacity="0.35" />
        <g fill={dark} opacity="0.85">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <rect x={120 + i * 46} y="170" width="22" height="16" rx="5" />
              <rect x={120 + i * 46} y="236" width="22" height="16" rx="5" />
              <rect x={140 + i * 46} y="206" width="22" height="16" rx="5" />
            </g>
          ))}
        </g>
        <path d="M100 230 C100 210 130 200 160 200" fill="none" stroke={trimColor} strokeWidth="6" strokeLinecap="round" />
      </>
    )
  }

  return (
    <svg
      viewBox="0 0 600 400"
      role="img"
      aria-label={label}
      className="shoe-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="600" height="400" fill="#eef0f2" />
      <ellipse cx="300" cy="352" rx="230" ry="16" fill="rgba(0,0,0,0.12)" />
      {art}
    </svg>
  )
}
