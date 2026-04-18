'use client'

import { useEffect, useRef, useState } from 'react'
import type { Stat } from '@/types'

function useCountUp(target: number, duration = 1200, trigger = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start = Math.min(start + step, target)
      setCount(Math.round(start))
      if (start >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, trigger])

  return count
}

function StatItem({ stat, animate }: { stat: Stat; animate: boolean }) {
  const raw = useCountUp(stat.value, 1200, animate)

  // Format the displayed value to match the display string pattern
  const formatted = stat.display
    .replace(/\d+/, String(raw))
    .replace(/0%$/, `${raw}%`)
    .replace(/^0\+$/, `${raw}+`)
    .replace(/^\$0M\+$/, `$${raw}M+`)

  return (
    <div className="pg-stat">
      <div className="pg-stat-value">{animate ? formatted : stat.display}</div>
      <div className="pg-stat-label">{stat.label}</div>
      <div className="pg-stat-desc">{stat.description}</div>
    </div>
  )
}

type StatsProps = {
  stats: Stat[]
}

export function Stats({ stats }: StatsProps) {
  const ref = useRef<HTMLElement>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="pg-stats" ref={ref}>
      {stats.map((stat) => (
        <StatItem key={stat.label} stat={stat} animate={animate} />
      ))}
    </section>
  )
}
