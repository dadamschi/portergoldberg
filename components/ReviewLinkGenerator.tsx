'use client'

import { useState } from 'react'

type Contact = {
  id: string
  firstname: string
  lastname: string
  email: string
  contact_type: string
}

type Deal = {
  id: string
  dealname: string
  dealstage: string
  amount: string
  contacts: Contact[]
}

export default function ReviewLinkGenerator() {
  const [searchTerm, setSearchTerm] = useState('')
  const [deals, setDeals] = useState<Deal[]>([])
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [error, setError] = useState('')

  async function handleSearchDeals() {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError('')
    setDeals([])
    setSelectedDeal(null)
    setSelectedContactIds(new Set())
    setGeneratedLink('')

    try {
      const response = await fetch('/api/search-deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm: searchTerm.trim() }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setDeals(data.deals || [])

      if (data.deals.length === 0) {
        setError('No deals found')
      }
    } catch (err) {
      setError('Failed to search deals')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function selectDeal(deal: Deal) {
    setSelectedDeal(deal)
    setSelectedContactIds(new Set())
    setGeneratedLink('')
  }

  function toggleContact(id: string) {
    const newSelected = new Set(selectedContactIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedContactIds(newSelected)
  }

  async function handleGenerateLink() {
    if (selectedContactIds.size === 0) {
      setError('Please select at least one contact')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedLink('')

    try {
      const response = await fetch('/api/generate-review-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactIds: Array.from(selectedContactIds),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate link')
      }

      const data = await response.json()
      setGeneratedLink(data.reviewLink)
    } catch (err) {
      setError('Failed to generate review link')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(generatedLink)
    alert('Link copied to clipboard!')
  }

  return (
    <div>
      {/* Step 1: Search for deals */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>1. Search for Property/Deal</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchDeals()}
            placeholder="Search by property address or deal name..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleSearchDeals}
            disabled={loading || !searchTerm.trim()}
            style={{
              padding: '8px 24px',
              backgroundColor: 'var(--pg-navy)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !searchTerm.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: loading || !searchTerm.trim() ? 0.5 : 1,
            }}
          >
            {loading ? 'Searching...' : 'Search Deals'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          marginBottom: '16px',
          color: '#c00',
        }}>
          {error}
        </div>
      )}

      {/* Step 2: Select a deal */}
      {deals.length > 0 && !selectedDeal && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>
            2. Select Deal ({deals.length} found)
          </h2>
          <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
            {deals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => selectDeal(deal)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                  {deal.dealname}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                  Amount: ${parseInt(deal.amount || '0').toLocaleString()}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {deal.contacts.length} contact{deal.contacts.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Select contacts from the deal */}
      {selectedDeal && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px' }}>
              3. Select Clients from {selectedDeal.dealname}
            </h2>
            <button
              onClick={() => {
                setSelectedDeal(null)
                setSelectedContactIds(new Set())
                setGeneratedLink('')
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ddd',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              ← Back to Deals
            </button>
          </div>

          {selectedDeal.contacts.length === 0 ? (
            <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              No contacts found for this deal
            </div>
          ) : (
            <>
              <div style={{ border: '1px solid #ddd', borderRadius: '4px', marginBottom: '16px' }}>
                {selectedDeal.contacts.map((contact) => {
                  const name = `${contact.firstname || ''} ${contact.lastname || ''}`.trim()
                  const isSelected = selectedContactIds.has(contact.id)
                  const isAgent = contact.contact_type?.toLowerCase().includes('agent') ||
                                  contact.contact_type?.toLowerCase().includes('broker') ||
                                  contact.contact_type?.toLowerCase().includes('referral')

                  return (
                    <div
                      key={contact.id}
                      onClick={() => toggleContact(contact.id)}
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#e3f2fd' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleContact(contact.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                          {name}
                          {isAgent && (
                            <span style={{
                              marginLeft: '8px',
                              padding: '2px 8px',
                              backgroundColor: '#ffa500',
                              color: 'white',
                              fontSize: '11px',
                              borderRadius: '3px',
                            }}>
                              AGENT
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {contact.email || 'No email'}
                          {contact.contact_type && ` • ${contact.contact_type}`}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {selectedContactIds.size > 0 && (
                <button
                  onClick={handleGenerateLink}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--pg-sage)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  Generate Link for {selectedContactIds.size} Contact{selectedContactIds.size !== 1 ? 's' : ''}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Step 4: Copy generated link */}
      {generatedLink && (
        <div style={{
          padding: '16px',
          backgroundColor: '#e8f5e9',
          border: '1px solid #4caf50',
          borderRadius: '4px',
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#2e7d32' }}>
            ✓ Review Link Generated
          </h3>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            <input
              type="text"
              value={generatedLink}
              readOnly
              onClick={(e) => e.currentTarget.select()}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '13px',
                fontFamily: 'monospace',
              }}
            />
            <button
              onClick={copyToClipboard}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--pg-navy)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
