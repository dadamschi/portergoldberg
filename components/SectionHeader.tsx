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
  console.log('indexx', index, 'iseven', isEvenSection)
  // Text position: odd sections = left, even sections = right
  const alignmentClass = isEvenSection ? 'pg-section-header--right' : ''
  const labelClass = isEvenSection ? 'pg-section-header-label' : 'pg-section-header-title'
  const titleClass = isEvenSection ? 'pg-section-header-title' : 'pg-section-header-label'

  return (
    <div className={`pg-section-header ${alignmentClass}`}>
      <div className="pg-section-header-text">
        {label && <span className={labelClass}>{label}</span>}
        <span className={titleClass}>{title}</span>
      </div>
      <div className="pg-section-header-line" />
    </div>
  )
}
