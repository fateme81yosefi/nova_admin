type LogoMarkProps = {
  size?: number
}

export function LogoMark({ size = 36 }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="#F26A1B" />
      <path
        d="M10.5 13.5h15l-1.35 12a2 2 0 0 1-2 1.8h-8.3a2 2 0 0 1-2-1.8l-1.35-12z"
        fill="#101C33"
      />
      <path
        d="M14.2 13.5v-1a3.8 3.8 0 0 1 7.6 0v1"
        fill="none"
        stroke="#101C33"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
