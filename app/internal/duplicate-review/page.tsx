import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export const metadata: Metadata = {
  title: 'Duplicate Contact Review',
  robots: 'noindex, nofollow',
}

type Contact = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  company: string
  contactType: string
  vendorCategory: string
}

type DuplicateGroup = {
  reason: string
  confidence: 'high' | 'medium' | 'low'
  contacts: Contact[]
}

function getDuplicates(): DuplicateGroup[] {
  try {
    const filePath = resolve(process.cwd(), 'scripts/data/duplicate-analysis.json')
    const raw = readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function ContactRow({ contact }: { contact: Contact }) {
  const name = [contact.firstName, contact.lastName].filter(Boolean).join(' ') || '(no name)'
  return (
    <tr>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e5e5' }}>{name}</td>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e5e5' }}>{contact.email || '-'}</td>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e5e5' }}>{contact.phone || '-'}</td>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e5e5' }}>{contact.company || '-'}</td>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e5e5' }}>{contact.contactType || '-'}</td>
    </tr>
  )
}

function DuplicateGroupCard({ group, index }: { group: DuplicateGroup; index: number }) {
  const confidenceColors = {
    high: { bg: '#fee2e2', border: '#ef4444', label: '🔴 HIGH' },
    medium: { bg: '#fef3c7', border: '#f59e0b', label: '🟡 MEDIUM' },
    low: { bg: '#d1fae5', border: '#10b981', label: '🟢 LOW' },
  }
  const style = confidenceColors[group.confidence]

  return (
    <div
      style={{
        marginBottom: '24px',
        border: `2px solid ${style.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: style.bg,
          padding: '12px 16px',
          borderBottom: `1px solid ${style.border}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>Group {index + 1}: {group.reason}</strong>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '4px',
              background: 'white',
            }}
          >
            {style.label}
          </span>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ background: '#f9fafb' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: '600' }}>Name</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: '600' }}>Phone</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: '600' }}>Company</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {group.contacts.map((contact) => (
            <ContactRow key={contact.id} contact={contact} />
          ))}
        </tbody>
      </table>
      <div style={{ padding: '16px', background: '#f9fafb', borderTop: '1px solid #e5e5e5' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Your Decision:
        </label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {['Keep All', 'Merge', 'Delete Duplicate', 'Needs Review'].map((option) => (
            <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input type="radio" name={`decision-${group.contacts[0]?.id}`} value={option} />
              {option}
            </label>
          ))}
        </div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Notes:</label>
        <textarea
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            minHeight: '60px',
            fontSize: '14px',
          }}
          placeholder="Add any notes about this group..."
        />
      </div>
    </div>
  )
}

export default function DuplicateReviewPage() {
  const duplicates = getDuplicates()
  const high = duplicates.filter((d) => d.confidence === 'high')
  const medium = duplicates.filter((d) => d.confidence === 'medium')
  const low = duplicates.filter((d) => d.confidence === 'low')

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>HubSpot Contact Duplicate Review</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        Please review each group and indicate your decision. When done, let us know and we&apos;ll process the changes.
      </p>

      <div
        style={{
          background: '#f3f4f6',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '32px',
        }}
      >
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Summary</h2>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{high.length}</span>
            <span style={{ marginLeft: '8px', color: '#666' }}>High confidence (same phone)</span>
          </div>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{medium.length}</span>
            <span style={{ marginLeft: '8px', color: '#666' }}>Medium confidence (similar names)</span>
          </div>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{low.length}</span>
            <span style={{ marginLeft: '8px', color: '#666' }}>Low confidence (possibly related)</span>
          </div>
        </div>
      </div>

      {high.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#ef4444' }}>
            🔴 High Confidence Duplicates
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            These contacts share the same phone number and are very likely the same person or a data entry error.
          </p>
          {high.map((group, i) => (
            <DuplicateGroupCard key={i} group={group} index={i} />
          ))}
        </section>
      )}

      {medium.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#f59e0b' }}>
            🟡 Medium Confidence Duplicates
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            These contacts have the same or similar names (including nicknames like Dave/David) but different emails.
          </p>
          {medium.map((group, i) => (
            <DuplicateGroupCard key={i} group={group} index={high.length + i} />
          ))}
        </section>
      )}

      {low.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#10b981' }}>
            🟢 Low Confidence - Possibly Related
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            These are likely family members, coworkers, or unrelated people who share a last name or similar email pattern.
          </p>
          {low.map((group, i) => (
            <DuplicateGroupCard key={i} group={group} index={high.length + medium.length + i} />
          ))}
        </section>
      )}

      {duplicates.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          No duplicate analysis found. Run the analysis script first.
        </p>
      )}
    </main>
  )
}
