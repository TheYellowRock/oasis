'use client'

import { useMemo, useState, useTransition } from 'react'
import type { Lead } from '@/payload-types'
import { updateLeadStatus } from '@/actions/leads'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Props = {
  initialLeads: Lead[]
}

function formatInterest(value?: string | null) {
  if (!value) return '—'
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function statusLabel(status?: Lead['status']) {
  if (status === 'contacted') return 'Contacted'
  if (status === 'closed') return 'Closed'
  return 'New'
}

function formatMoveInDate(value?: string | null) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function LeadsClient({ initialLeads }: Props) {
  const [leads, setLeads] = useState(initialLeads)
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()
  const [statusMessage, setStatusMessage] = useState('')

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId),
    [leads, selectedLeadId],
  )

  function onStatusChange(nextStatus: Lead['status']) {
    if (!selectedLead || !nextStatus) return
    const prevStatus = selectedLead.status

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === selectedLead.id ? { ...lead, status: nextStatus } : lead,
      ),
    )
    setStatusMessage('')

    startTransition(async () => {
      try {
        await updateLeadStatus(selectedLead.id, nextStatus as 'new' | 'contacted' | 'closed')
        setStatusMessage('Status updated.')
      } catch {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === selectedLead.id ? { ...lead, status: prevStatus } : lead,
          ),
        )
        setStatusMessage('Unable to update status.')
      }
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Click a lead row to open details quickly.
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Source Metadata</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                  No leads submitted yet.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedLeadId(lead.id)
                    setStatusMessage('')
                  }}
                >
                  <TableCell className="font-medium">{lead.fullName}</TableCell>
                  <TableCell>{formatInterest(lead.interest)}</TableCell>
                  <TableCell className="max-w-[320px] truncate">{lead.sourceMetadata || '—'}</TableCell>
                  <TableCell>{formatDate(lead.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(selectedLead)}
        onOpenChange={(open) => {
          if (!open) setSelectedLeadId(null)
        }}
      >
        <DialogContent className="max-w-2xl rounded-none sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>

          {selectedLead ? (
            <div className="grid gap-4">
              <section className="rounded-none border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Contact Info</p>
                <p className="mt-2 text-sm">Name: {selectedLead.fullName}</p>
                <p className="mt-1 text-sm">Email: {selectedLead.email}</p>
                <p className="mt-1 text-sm">Phone: {selectedLead.phone || '—'}</p>
                <p className="mt-1 text-sm">Company: {selectedLead.company || '—'}</p>
              </section>

              <section className="rounded-none border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Inquiry Details</p>
                <p className="mt-2 text-sm font-medium">Source Metadata</p>
                <p className="mt-1 text-sm text-muted-foreground">{selectedLead.sourceMetadata || '—'}</p>
                <p className="mt-3 text-sm font-medium">Message</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{selectedLead.message || '—'}</p>
              </section>

              <section className="rounded-none border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Offer Profile (Step 2)</p>
                <div className="mt-2 grid gap-1 text-sm">
                  <p>Business Type: {selectedLead.businessType || '—'}</p>
                  <p>Square Footage Needed: {selectedLead.squareFootageNeeded?.toLocaleString() ?? '—'}</p>
                  <p>Budget Range: {selectedLead.budgetRange || '—'}</p>
                  <p>Desired Lease Term: {selectedLead.desiredLeaseTerm || '—'}</p>
                  <p>Decision Timeline: {selectedLead.decisionTimeline || '—'}</p>
                  <p>Desired Move-in Date: {formatMoveInDate(selectedLead.desiredMoveInDate)}</p>
                </div>
              </section>

              <section className="rounded-none border p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Lead Status</p>
                <div className="mt-2 flex items-center gap-3">
                  <select
                    className="h-10 rounded-none border px-3 text-sm"
                    value={selectedLead.status ?? 'new'}
                    onChange={(event) => onStatusChange(event.target.value as Lead['status'])}
                    disabled={pending}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <span className="text-sm text-muted-foreground">
                    Current: {statusLabel(selectedLead.status)}
                  </span>
                </div>
                {statusMessage ? (
                  <p className={`mt-2 text-sm ${statusMessage.includes('updated') ? 'text-emerald-700' : 'text-red-600'}`}>
                    {statusMessage}
                  </p>
                ) : null}
              </section>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
