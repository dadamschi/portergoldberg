interface SectionHeaderProps {
  heading: string
  index?: number
  titleLarger?: boolean
}

export function SectionHeader({ heading, index = 0, titleLarger }: SectionHeaderProps) {
  const words = heading.split(' ')
  const label = words.slice(0, -1).join(' ')
  const title = words[words.length - 1]

  // Alignment based on index: odd sections (1,3,5) = left, even sections (2,4,6) = right
  const isEvenSection = (index + 1) % 2 === 0
  const alignmentClass = isEvenSection ? 'pg-newsletter-section-header--right' : ''

  // Size: use titleLarger if set, otherwise fall back to index-based alternation
  const isTitleLarger = titleLarger !== undefined ? titleLarger : !isEvenSection
  const labelClass = isTitleLarger ? 'pg-newsletter-section-header-label' : 'pg-newsletter-section-header-title'
  const titleClass = isTitleLarger ? 'pg-newsletter-section-header-title' : 'pg-newsletter-section-header-label'

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
