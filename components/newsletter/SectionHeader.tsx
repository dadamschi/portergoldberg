interface SectionHeaderProps {
  heading: string
  index?: number
}

export function SectionHeader({ heading, index = 0 }: SectionHeaderProps) {
  const words = heading.split(' ')
  const label = words.slice(0, -1).join(' ')
  const title = words[words.length - 1]

  // 1-indexed: odd sections (1,3,5) = index 0,2,4; even sections (2,4,6) = index 1,3,5
  const isEvenSection = (index + 1) % 2 === 0 // true for sections 2, 4, 6...
  // Text position: odd sections = left, even sections = right
  const alignmentClass = isEvenSection ? 'pg-newsletter-section-header--right' : ''
  const labelClass = isEvenSection ? 'pg-newsletter-section-header-label' : 'pg-newsletter-section-header-title'
  const titleClass = isEvenSection ? 'pg-newsletter-section-header-title' : 'pg-newsletter-section-header-label'

  return (
    <div className={`pg-newsletter-section-header ${alignmentClass}`}>
      <div>
        {label && <span className={labelClass} style={{marginInlineEnd: '12px'}}>{label}</span>}
        <span className={titleClass}>{title}</span>
      </div>
      <div className="pg-newsletter-section-header-line" />
    </div>
  )
}
