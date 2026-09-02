'use client'

import { useState, useEffect } from 'react'
import { HUBSPOT_CLIENT_ID } from '@/lib/constants'

type HubSpotList = {
  listId: string
  name: string
  processingType: string
  processingStatus?: string
  objectTypeId?: string
  createdAt?: string
  updatedAt?: string
  listSize?: string
}

type HubSpotContact = {
  id: string
  email: string
  firstname: string
  lastname: string
  tier: string
  interested_property: string
}

type EmailTemplate = {
  _id: string
  title: string
  subject: string
  htmlContent: string
}

export function BulkEmailSender() {
  const [lists, setLists] = useState<HubSpotList[]>([])
  const [selectedListId, setSelectedListId] = useState<string>('')
  const [contacts, setContacts] = useState<HubSpotContact[]>([])
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set())
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)
  const [isLoadingLists, setIsLoadingLists] = useState(true)
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Template form state
  const [templateTitle, setTemplateTitle] = useState('')
  const [templateSubject, setTemplateSubject] = useState('')
  const [templateHtmlContent, setTemplateHtmlContent] = useState('')

  // Test email state
  const [testEmailRecipient, setTestEmailRecipient] = useState('info@portergoldberg.com')
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testEmailMessage, setTestEmailMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Template save message
  const [templateSaveMessage, setTemplateSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Bulk send state
  const [isSendingBulk, setIsSendingBulk] = useState(false)
  const [bulkSendMessage, setBulkSendMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Fetch lists and templates on mount
  useEffect(() => {
    fetchLists()
    fetchTemplates()
  }, [])

  // Fetch contacts when list is selected
  useEffect(() => {
    if (selectedListId) {
      fetchContacts(selectedListId)
    } else {
      setContacts([])
    }
    // Clear selections when changing lists
    setSelectedContactIds(new Set())
  }, [selectedListId])

  const fetchLists = async () => {
    setIsLoadingLists(true)
    setError(null)

    try {
      const res = await fetch('/api/hubspot/lists')

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to fetch lists')
      }

      const data = await res.json()
      setLists(data.lists || [])
    } catch (err) {
      console.error('Error fetching HubSpot lists:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch lists')
    } finally {
      setIsLoadingLists(false)
    }
  }

  const fetchContacts = async (listId: string) => {
    setIsLoadingContacts(true)
    setError(null)

    try {
      const res = await fetch(`/api/hubspot/lists/${listId}/contacts`)

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to fetch contacts')
      }

      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (err) {
      console.error('Error fetching contacts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts')
      setContacts([])
    } finally {
      setIsLoadingContacts(false)
    }
  }

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true)
    setError(null)

    try {
      const res = await fetch('/api/email-templates')

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to fetch templates')
      }

      const data = await res.json()
      setTemplates(data.templates || [])
    } catch (err) {
      console.error('Error fetching email templates:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch templates')
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  const handleCreateTemplate = () => {
    setIsEditingTemplate(true)
    setSelectedTemplateId('')
    setTemplateTitle('')
    setTemplateSubject('')
    setTemplateHtmlContent('')
    setTemplateSaveMessage(null)
  }

  const handleEditTemplate = (template: EmailTemplate) => {
    setIsEditingTemplate(true)
    setSelectedTemplateId(template._id)
    setTemplateTitle(template.title)
    setTemplateSubject(template.subject)
    setTemplateHtmlContent(template.htmlContent)
    setTemplateSaveMessage(null)
  }

  const handleSaveTemplate = async () => {
    setTemplateSaveMessage(null)

    try {
      if (!templateTitle || !templateSubject || !templateHtmlContent) {
        setTemplateSaveMessage({ type: 'error', text: 'All template fields are required' })
        return
      }

      const body = {
        title: templateTitle,
        subject: templateSubject,
        htmlContent: templateHtmlContent,
      }

      let updatedTemplate: EmailTemplate

      if (selectedTemplateId) {
        // Update existing template
        const res = await fetch(`/api/email-templates/${selectedTemplateId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to update template')
        }

        const data = await res.json()
        updatedTemplate = data.template

        // Update template in local state
        setTemplates(prev => prev.map(t => t._id === selectedTemplateId ? updatedTemplate : t))
        setTemplateSaveMessage({ type: 'success', text: 'Template updated successfully!' })
      } else {
        // Create new template
        const res = await fetch('/api/email-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to create template')
        }

        const data = await res.json()
        updatedTemplate = data.template

        // Add new template to local state
        setTemplates(prev => [...prev, updatedTemplate])
        setSelectedTemplateId(updatedTemplate._id)
        setTemplateSaveMessage({ type: 'success', text: 'Template created successfully!' })
      }
    } catch (err) {
      console.error('Error saving template:', err)
      setTemplateSaveMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save template'
      })
    }
  }

  const handleCancelEdit = () => {
    setIsEditingTemplate(false)
    setSelectedTemplateId('')
    setTemplateTitle('')
    setTemplateSubject('')
    setTemplateHtmlContent('')
  }

  const toggleContact = (contactId: string) => {
    setSelectedContactIds(prev => {
      const next = new Set(prev)
      if (next.has(contactId)) {
        next.delete(contactId)
      } else {
        next.add(contactId)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedContactIds.size === contacts.length) {
      // Deselect all
      setSelectedContactIds(new Set())
    } else {
      // Select all
      setSelectedContactIds(new Set(contacts.map(c => c.id)))
    }
  }

  const sendTestEmail = async () => {
    if (!selectedTemplateId) {
      setTestEmailMessage({ type: 'error', text: 'Please select a template first' })
      return
    }

    setIsSendingTest(true)
    setTestEmailMessage(null)

    try {
      const res = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          recipientEmail: testEmailRecipient,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send test email')
      }

      setTestEmailMessage({
        type: 'success',
        text: `Test email sent to ${testEmailRecipient}!`,
      })
    } catch (err) {
      console.error('Error sending test email:', err)
      setTestEmailMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to send test email',
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  const sendBulkEmail = async () => {
    if (!selectedTemplateId) {
      setBulkSendMessage({ type: 'error', text: 'Please select a template first' })
      return
    }

    if (selectedContactIds.size === 0) {
      setBulkSendMessage({ type: 'error', text: 'Please select at least one contact' })
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to send this email to ${selectedContactIds.size} contact(s)?\n\nThis action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setIsSendingBulk(true)
    setBulkSendMessage(null)

    try {
      const selectedContacts = contacts.filter(c => selectedContactIds.has(c.id))

      const res = await fetch('/api/send-bulk-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          contacts: selectedContacts,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send bulk email')
      }

      setBulkSendMessage({
        type: 'success',
        text: `Successfully sent ${data.successCount} email(s)${data.failureCount > 0 ? `, ${data.failureCount} failed` : ''}!`,
      })
    } catch (err) {
      console.error('Error sending bulk email:', err)
      setBulkSendMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to send bulk email',
      })
    } finally {
      setIsSendingBulk(false)
    }
  }

  const selectedList = lists.find(l => l.listId === selectedListId)
  const allSelected = contacts.length > 0 && selectedContactIds.size === contacts.length
  const selectedContacts = contacts.filter(c => selectedContactIds.has(c.id))

  return (
    <div className="bulk-email-sender">
      <div className="selection-row">
        <div className="bulk-email-controls">
          <h2>Contact List</h2>
          <div className="form-field">
            <label htmlFor="list-select">
              Select HubSpot Contact List:
            </label>

            {isLoadingLists ? (
              <div className="loading-message">
                <p>Loading lists from HubSpot...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={fetchLists}
                  className="pg-contact-submit"
                >
                  Retry
                </button>
              </div>
            ) : (
              <select
                id="list-select"
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
                className="pg-contact-input"
              >
                <option value="">-- Select a List --</option>
                {lists.map((list) => (
                  <option key={list.listId} value={list.listId}>
                    {list.name} ({list.listSize || '0'} contacts)
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedList && (
        <div className="contacts-section">
          <div className="contacts-header">
            <h2>Contacts from: {selectedList.name}</h2>
            {isLoadingContacts ? (
              <p className="loading-message">Loading contacts...</p>
            ) : (
              <p className="contacts-count">
                {contacts.length} contacts loaded
                {selectedContactIds.size > 0 && (
                  <span className="selected-count">
                    {' '}• {selectedContactIds.size} selected
                  </span>
                )}
              </p>
            )}
          </div>

          {!isLoadingContacts && contacts.length > 0 && (
            <div className="contacts-table-wrapper">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        aria-label="Select all contacts"
                      />
                    </th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Tier</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={selectedContactIds.has(contact.id)}
                          onChange={() => toggleContact(contact.id)}
                          aria-label={`Select ${contact.firstname} ${contact.lastname}`}
                        />
                      </td>
                      <td>{contact.firstname || '-'}</td>
                      <td>{contact.lastname || '-'}</td>
                      <td>{contact.email}</td>
                      <td>{contact.tier || '-'}</td>
                      <td>
                        <a
                          href={`https://app.hubspot.com/contacts/${HUBSPOT_CLIENT_ID}/record/0-1/${contact.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="edit-link"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoadingContacts && contacts.length === 0 && (
            <p className="empty-message">No contacts found in this list.</p>
          )}

          {/* Bulk Send Button */}
          {selectedContactIds.size > 0 && selectedTemplateId && (
            <div className="bulk-send-section">
              <button
                type="button"
                onClick={sendBulkEmail}
                disabled={isSendingBulk}
                className="pg-contact-submit bulk-send-button"
              >
                {isSendingBulk ? 'Sending...' : `Send Email to ${selectedContactIds.size} Selected Contact(s)`}
              </button>

              {bulkSendMessage && (
                <div className={`bulk-send-message ${bulkSendMessage.type}`}>
                  {bulkSendMessage.text}
                </div>
              )}
            </div>
          )}
        </div>
      )}

          {!isLoadingLists && lists.length === 0 && !error && (
            <p className="empty-message">
              No lists found in HubSpot.
            </p>
          )}
        </div>

        {/* Email Template Section */}
        <div className="template-section">
        <h2>Email Template</h2>

        {!isEditingTemplate ? (
          <div className="template-selector">
            <div className="form-field">
              <label htmlFor="template-select">Select or Create Template:</label>
              {isLoadingTemplates ? (
                <p className="loading-message">Loading templates...</p>
              ) : (
                <>
                  <select
                    id="template-select"
                    value={selectedTemplateId}
                    onChange={(e) => {
                      const template = templates.find(t => t._id === e.target.value)
                      if (template) {
                        setSelectedTemplateId(template._id)
                        setTemplateTitle(template.title)
                        setTemplateSubject(template.subject)
                        setTemplateHtmlContent(template.htmlContent)
                      } else {
                        setSelectedTemplateId('')
                      }
                    }}
                    className="pg-contact-input"
                  >
                    <option value="">-- Select a Template --</option>
                    {templates.map((template) => (
                      <option key={template._id} value={template._id}>
                        {template.title}
                      </option>
                    ))}
                  </select>

                  <div className="template-actions">
                    <button
                      type="button"
                      onClick={handleCreateTemplate}
                      className="pg-contact-submit"
                    >
                      Create New Template
                    </button>
                    {selectedTemplateId && (
                      <button
                        type="button"
                        onClick={() => handleEditTemplate(templates.find(t => t._id === selectedTemplateId)!)}
                        className="pg-contact-submit"
                      >
                        Edit Template
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {selectedTemplateId && (
              <div className="template-preview">
                <h3>Customize Email</h3>

                <div className="form-field">
                  <label htmlFor="email-subject">Email Subject:</label>
                  <input
                    id="email-subject"
                    type="text"
                    value={templateSubject}
                    onChange={(e) => setTemplateSubject(e.target.value)}
                    className="pg-contact-input"
                    placeholder="Email subject line"
                  />
                </div>

                <div className="preview-field">
                  <strong>Available Fields:</strong> {'{{firstname}}, {{lastname}}, {{email}}, {{tier}}, {{interested_property}}'}
                  <br />
                  <span className="help-text">
                    Use defaults: {'{{firstname|There}}'} - if firstname is empty, it will use &quot;There&quot;
                  </span>
                </div>

                <div className="preview-field">
                  <strong>HTML Content:</strong>
                  <pre>{templateHtmlContent}</pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="template-editor">
            <div className="form-field">
              <label htmlFor="template-title">Template Name:</label>
              <input
                id="template-title"
                type="text"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                className="pg-contact-input"
                placeholder="My Email Template"
              />
            </div>

            <div className="form-field">
              <label htmlFor="template-subject">Email Subject:</label>
              <input
                id="template-subject"
                type="text"
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                className="pg-contact-input"
                placeholder="Hello {{firstname}}!"
              />
            </div>

            <div className="form-field">
              <label htmlFor="template-html">Email Content:</label>
              <div className="help-text">
                Use mustache syntax: {'{{firstname}}, {{lastname}}, {{email}}, {{tier}}, {{interested_property}}'}<br />
                Add defaults with: {'{{firstname|There}}'} - uses &quot;There&quot; if firstname is empty<br />
                <strong>Line breaks:</strong> Press Enter for new lines - they&apos;ll be preserved in the email. Or use full HTML if you prefer.
              </div>
              <textarea
                id="template-html"
                value={templateHtmlContent}
                onChange={(e) => setTemplateHtmlContent(e.target.value)}
                className="pg-contact-input template-textarea"
                placeholder="<p>Hello {{firstname}} {{lastname}},</p>"
                rows={15}
              />
            </div>

            <div className="template-actions">
              <button
                type="button"
                onClick={handleSaveTemplate}
                className="pg-contact-submit"
              >
                Save Template
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="pg-contact-submit secondary"
              >
                Cancel
              </button>
            </div>

            {templateSaveMessage && (
              <div className={`template-save-message ${templateSaveMessage.type}`}>
                {templateSaveMessage.text}
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      {/* Test Email Section */}
      {selectedTemplateId && (
        <div className="test-email-section">
          <h2>Send Test Email</h2>
          <p className="test-email-description">
            Send a test email with sample data to verify your template. Test data: John Doe, test@example.com, Gold tier, 123 Main St, Chicago, IL
            <br />
            <em>Note: To test defaults, temporarily remove a field from your template (e.g., use {'{{firstname|There}}'} and the test will show &quot;John&quot;)</em>
          </p>

          <div className="test-email-controls">
            <div className="form-field">
              <label htmlFor="test-recipient">Send to:</label>
              <select
                id="test-recipient"
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                className="pg-contact-input"
              >
                <option value="info@portergoldberg.com">info@portergoldberg.com</option>
                <option value="dadams.chi@gmail.com">dadams.chi@gmail.com</option>
              </select>
            </div>

            <button
              type="button"
              onClick={sendTestEmail}
              disabled={isSendingTest}
              className="pg-contact-submit"
            >
              {isSendingTest ? 'Sending...' : 'Send Test Email'}
            </button>
          </div>

          {testEmailMessage && (
            <div className={`test-email-message ${testEmailMessage.type}`}>
              {testEmailMessage.text}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .bulk-email-sender {
          max-width: 100vw;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
        }

        .selection-row {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          max-width: 100%;
          overflow-x: auto;
        }

        .bulk-email-controls {
          flex: 0 0 calc(50% - 10px);
          background: #f9f9f9;
          padding: 30px;
          border-radius: 8px;
          box-sizing: border-box;
          min-width: 0;
        }

        .bulk-email-controls h2 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #2C3E35;
        }

        .form-field {
          margin-bottom: 20px;
        }

        .form-field label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2C3E35;
        }

        .loading-message,
        .error-message,
        .empty-message {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .error-message {
          color: #dc3545;
        }

        .error-message button {
          margin-top: 15px;
        }

        .list-details {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 30px;
        }

        .list-details h2 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #2C3E35;
        }

        .list-info {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 600;
          color: #555;
          min-width: 130px;
        }

        .value {
          flex: 1;
          text-align: right;
          color: #333;
        }

        .value code {
          background: #f5f5f5;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 13px;
          color: #2C3E35;
        }

        .contacts-section {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 30px;
          margin-top: 30px;
        }

        .contacts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #2C3E35;
        }

        .contacts-header h2 {
          margin: 0;
          color: #2C3E35;
        }

        .contacts-count {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .selected-count {
          color: #2C3E35;
          font-weight: 600;
        }

        .contacts-table-wrapper {
          overflow-x: auto;
          overflow-y: auto;
          max-height: 900px;
        }

        .contacts-table {
          width: 100%;
          font-size: 14px;
          border-collapse: collapse;
        }

        .contacts-table th {
          text-align: left;
          padding: 12px;
          background: #f5f5f5;
          border-bottom: 2px solid #ddd;
          font-weight: 600;
          color: #2C3E35;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .contacts-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        .contacts-table tr:hover {
          background: #f9f9f9;
        }

        .checkbox-cell {
          width: 40px;
          text-align: center;
        }

        .checkbox-cell input[type="checkbox"] {
          cursor: pointer;
          width: 16px;
          height: 16px;
        }

        .template-section {
          flex: 0 0 calc(50% - 10px);
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 30px;
          box-sizing: border-box;
          min-width: 0;
        }

        .template-section h2 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #2C3E35;
        }

        .template-section h3 {
          color: #2C3E35;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        .template-selector,
        .template-editor {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .template-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .template-actions button.secondary {
          background: #666;
        }

        .template-actions button.secondary:hover {
          background: #555;
        }

        .template-preview {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .preview-field {
          margin-bottom: 15px;
        }

        .preview-field strong {
          display: block;
          margin-bottom: 5px;
          color: #2C3E35;
        }

        .preview-field pre {
          background: white;
          padding: 15px;
          border-radius: 4px;
          border: 1px solid #ddd;
          overflow-x: auto;
          overflow-y: auto;
          max-height: 300px;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
          word-break: break-word;
        }

        .template-textarea {
          font-family: monospace;
          font-size: 13px;
          line-height: 1.5;
        }

        .help-text {
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
          font-style: italic;
        }

        .test-email-section {
          background: #f0f8ff;
          border: 2px solid #4a90e2;
          border-radius: 8px;
          padding: 30px;
          margin-top: 30px;
        }

        .test-email-section h2 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #2C3E35;
        }

        .test-email-description {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .test-email-controls {
          display: flex;
          gap: 20px;
          align-items: flex-end;
        }

        .test-email-controls .form-field {
          flex: 1;
          margin-bottom: 0;
        }

        .test-email-controls button {
          flex-shrink: 0;
        }

        .test-email-message {
          margin-top: 15px;
          padding: 12px 20px;
          border-radius: 4px;
          font-size: 14px;
        }

        .test-email-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .test-email-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .template-save-message {
          margin-top: 15px;
          padding: 12px 20px;
          border-radius: 4px;
          font-size: 14px;
        }

        .template-save-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .template-save-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .bulk-send-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #2C3E35;
          text-align: center;
        }

        .bulk-send-button {
          font-size: 16px;
          font-weight: 600;
          padding: 15px 30px;
          background: #2C3E35;
          color: white;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .bulk-send-button:hover:not(:disabled) {
          background: #1a2420;
        }

        .bulk-send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .bulk-send-message {
          margin-top: 15px;
          padding: 12px 20px;
          border-radius: 4px;
          font-size: 14px;
          display: inline-block;
        }

        .bulk-send-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .bulk-send-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>
    </div>
  )
}
