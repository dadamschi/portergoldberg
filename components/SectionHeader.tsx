interface SectionHeaderProps {
  heading: string
  index?: number
}

export function SectionHeader({ heading, index = 0 }: SectionHeaderProps) {
  const words = heading.split(' ')
  const label = words.slice(0, -1).join(' ')
  const title = words[words.length - 1]
  const isOdd = index % 2 === 1

  // Swap font sizes on even index: label becomes large, title becomes small
  const labelClass = isOdd ? 'pg-section-header-label' : 'pg-section-header-title'
  const titleClass = isOdd ? 'pg-section-header-title' : 'pg-section-header-label'

  return (
    <div className="pg-section-header">
      <div className="pg-section-header-text">
        {label && <span className={labelClass}>{label}</span>}
        <span className={titleClass}>{title}</span>
      </div>
      <div className="pg-section-header-line" />
    </div>
  )
}
