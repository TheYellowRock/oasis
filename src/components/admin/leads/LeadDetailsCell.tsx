'use client'

import { useMemo, useState } from 'react'
import { Drawer, DrawerToggler } from '@payloadcms/ui'

type LeadRow = {
  id: number | string
  fullName?: string
  email?: string
  phone?: string
  company?: string
  businessType?: string
  squareFootageNeeded?: number
  budgetRange?: string
  desiredLeaseTerm?: string
  decisionTimeline?: string
  desiredMoveInDate?: string
  message?: string
  sourceMetadata?: string
  status?: 'new' | 'contacted' | 'closed'
}

type Props = {
  cellData?: string
  rowData?: LeadRow
}

export default function LeadDetailsCell({ cellData, rowData }: Props) {
  const [status, setStatus] = useState<LeadRow['status']>(rowData?.status ?? 'new')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const drawerSlug = useMemo(() => `lead-details-${rowData?.id ?? 'unknown'}`, [rowData?.id])
  const name = cellData || rowData?.fullName || 'Unknown Lead'

  async function saveStatus() {
    if (!rowData?.id) return
    setSaving(true)
    setSaveMessage('')
    try {
      const response = await fetch(`/api/leads/${rowData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status,
        }),
      })

      if (!response.ok) {
        setSaveMessage('Unable to update status.')
        return
      }
      setSaveMessage('Status saved.')
    } catch {
      setSaveMessage('Unable to update status.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <DrawerToggler
        slug={drawerSlug}
        className="text-left text-sm font-medium text-black underline-offset-2 hover:underline"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
      >
        {name}
      </DrawerToggler>

      <Drawer slug={drawerSlug} title={`Lead Details - ${name}`} gutter>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <section style={{ border: '1px solid #e5e7eb', padding: '0.875rem' }}>
            <p style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f766e' }}>
              Contact Details
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Email: {rowData?.email || '—'}</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>Phone: {rowData?.phone || '—'}</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>Company: {rowData?.company || '—'}</p>
          </section>

          <section style={{ border: '1px solid #e5e7eb', padding: '0.875rem' }}>
            <p style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f766e' }}>
              Inquiry Payload
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', fontWeight: 600 }}>Source Metadata</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.86rem', color: '#374151' }}>
              {rowData?.sourceMetadata || '—'}
            </p>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.9rem', fontWeight: 600 }}>Message</p>
            <p style={{ margin: '0.35rem 0 0', whiteSpace: 'pre-wrap', fontSize: '0.86rem', color: '#374151' }}>
              {rowData?.message || '—'}
            </p>
          </section>

          <section style={{ border: '1px solid #e5e7eb', padding: '0.875rem' }}>
            <p style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f766e' }}>
              Offer Profile (Step 2)
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Business Type: {rowData?.businessType || '—'}</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
              Square Footage Needed: {rowData?.squareFootageNeeded?.toLocaleString() || '—'}
            </p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>Budget Range: {rowData?.budgetRange || '—'}</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>Desired Lease Term: {rowData?.desiredLeaseTerm || '—'}</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>Decision Timeline: {rowData?.decisionTimeline || '—'}</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>Desired Move-in Date: {rowData?.desiredMoveInDate || '—'}</p>
          </section>

          <section style={{ border: '1px solid #e5e7eb', padding: '0.875rem' }}>
            <p style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f766e' }}>
              Lead Status
            </p>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as LeadRow['status'])}
                style={{
                  border: '1px solid #d1d5db',
                  padding: '0.45rem 0.5rem',
                  fontSize: '0.85rem',
                  minWidth: '180px',
                }}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
              <button
                type="button"
                onClick={saveStatus}
                disabled={saving}
                style={{
                  border: '1px solid #111111',
                  background: '#111111',
                  color: '#ffffff',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
            {saveMessage ? (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: saveMessage.includes('saved') ? '#065f46' : '#b91c1c' }}>
                {saveMessage}
              </p>
            ) : null}
          </section>
        </div>
      </Drawer>
    </div>
  )
}
