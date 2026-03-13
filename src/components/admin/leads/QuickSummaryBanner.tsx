'use client'

import { useFormFields } from '@payloadcms/ui'

export default function QuickSummaryBanner() {
  const values = useFormFields(([fields]) => ({
    fullName: String(fields?.fullName?.value ?? ''),
    sourceMetadata: String(fields?.sourceMetadata?.value ?? ''),
    interest: String(fields?.interest?.value ?? ''),
  }))

  const hasMetadata = values.sourceMetadata.trim().length > 0
  const interestLabel =
    values.interest.trim().length > 0
      ? values.interest
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ')
      : 'Not detected'

  return (
    <div
      style={{
        marginBottom: '1rem',
        border: '1px solid #1f2937',
        background: '#111111',
        color: '#ffffff',
        padding: '0.875rem 1rem',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#35c4b5' }}>
        Quick Summary
      </p>
      <p style={{ margin: '0.45rem 0 0', fontSize: '0.95rem', fontWeight: 600 }}>
        {values.fullName || 'Lead'} - {interestLabel}
      </p>
      <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: '#d1d5db' }}>
        {hasMetadata ? values.sourceMetadata : 'No source metadata provided.'}
      </p>
    </div>
  )
}
