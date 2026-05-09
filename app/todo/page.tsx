import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = {
  title: 'TODO',
  robots: {
    index: false,
    follow: false,
  },
}

export default function TodoPage() {
  const todoPath = path.join(process.cwd(), 'docs', 'TODO.md')
  const content = fs.readFileSync(todoPath, 'utf-8')

  // Parse markdown into sections
  const lines = content.split('\n')

  return (
    <main className="pg-todo-page">
      <div className="pg-todo-inner">
        {lines.map((line, i) => {
          if (line.startsWith('# ')) {
            return <h1 key={i} className="pg-todo-h1">{line.replace('# ', '')}</h1>
          }
          if (line.startsWith('## ')) {
            return <h2 key={i} className="pg-todo-h2">{line.replace('## ', '')}</h2>
          }
          if (line.startsWith('### ')) {
            return <h3 key={i} className="pg-todo-h3">{line.replace('### ', '')}</h3>
          }
          if (line.startsWith('- [x]')) {
            return (
              <div key={i} className="pg-todo-item pg-todo-item--done">
                <span className="pg-todo-checkbox">✓</span>
                <span>{line.replace('- [x]', '').trim()}</span>
              </div>
            )
          }
          if (line.startsWith('- [ ]')) {
            return (
              <div key={i} className="pg-todo-item">
                <span className="pg-todo-checkbox">○</span>
                <span>{line.replace('- [ ]', '').trim()}</span>
              </div>
            )
          }
          if (line.startsWith('  - ')) {
            return (
              <div key={i} className="pg-todo-sub-item">
                {line.replace('  - ', '').trim()}
              </div>
            )
          }
          if (line.trim() === '') {
            return null
          }
          return <p key={i} className="pg-todo-text">{line}</p>
        })}
      </div>
    </main>
  )
}
