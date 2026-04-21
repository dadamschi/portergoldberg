type IconProps = {
  size?: number
}

export function FacebookIcon({ size = 56 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <rect width="24" height="24" rx="4" fill="#1877F2" />
      <path
        d="M16.5 12.5h-2.5v8h-3v-8H9v-2.5h2v-1.8c0-2 1.2-3.2 3-3.2.9 0 1.7.1 1.7.1v2h-1c-1 0-1.2.5-1.2 1.1v1.8h2.2l-.2 2.5z"
        fill="#fff"
      />
    </svg>
  )
}

export function InstagramIcon({ size = 56 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <defs>
        <linearGradient id="ig-gradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="75%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="4" fill="url(#ig-gradient)" />
      <rect
        x="5.5"
        y="5.5"
        width="13"
        height="13"
        rx="3.5"
        stroke="#fff"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="12" r="3.2" stroke="#fff" strokeWidth="1.5" fill="none" />
      <circle cx="16.2" cy="7.8" r="1" fill="#fff" />
    </svg>
  )
}

export const SOCIAL_URLS = {
  facebook: 'https://www.facebook.com/portergoldbergresidential/',
  instagram: 'https://www.instagram.com/portergoldbergchicago/',
}

type SocialLinksProps = {
  size?: number
  className?: string
  linkClassName?: string
}

export function SocialLinks({ size = 56, className = '', linkClassName = '' }: SocialLinksProps) {
  return (
    <div className={`pg-social-links ${className}`.trim()}>
      <a
        href={SOCIAL_URLS.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className={linkClassName}
      >
        <FacebookIcon size={size} />
      </a>
      <a
        href={SOCIAL_URLS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className={linkClassName}
      >
        <InstagramIcon size={size} />
      </a>
    </div>
  )
}
