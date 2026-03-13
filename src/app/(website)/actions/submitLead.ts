'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export type SubmitLeadResult = {
  success: boolean
  message: string
  leadId?: number | string
}

const allowedInterestValues = new Set([
  'office',
  'warehouse',
  'retail',
  'self-storage',
  'coworking',
  'restaurant',
  'residential',
] as const)

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function getHubSpotToken() {
  return process.env.HUBSPOT_ACCESS_TOKEN?.trim()
}

function getHubSpotHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

async function findHubSpotContactIdByEmail(email: string, token: string): Promise<string | null> {
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: getHubSpotHeaders(token),
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: email,
            },
          ],
        },
      ],
      properties: ['email'],
      limit: 1,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HubSpot search failed (${response.status}): ${errorText}`)
  }

  const payload = (await response.json()) as {
    results?: Array<{ id: string }>
  }
  return payload.results?.[0]?.id ?? null
}

async function createHubSpotContact(args: {
  email: string
  fullName: string
  phone?: string
  sourceMetadata?: string
  token: string
}): Promise<string | null> {
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: getHubSpotHeaders(args.token),
    body: JSON.stringify({
      properties: {
        email: args.email,
        firstname: args.fullName,
        phone: args.phone || undefined,
        hs_content_membership_notes: args.sourceMetadata || undefined,
      },
    }),
  })

  if (response.ok) {
    const data = (await response.json()) as { id?: string }
    return data.id ?? null
  }

  // Contact may already exist. Search and continue.
  if (response.status === 409) {
    return findHubSpotContactIdByEmail(args.email, args.token)
  }

  const errorText = await response.text()
  throw new Error(`HubSpot create failed (${response.status}): ${errorText}`)
}

async function patchHubSpotContact(args: {
  contactId: string
  properties: Record<string, string | undefined>
  token: string
}) {
  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${args.contactId}`, {
    method: 'PATCH',
    headers: getHubSpotHeaders(args.token),
    body: JSON.stringify({
      properties: args.properties,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HubSpot patch failed (${response.status}): ${errorText}`)
  }
}

export async function submitLead(formData: FormData): Promise<SubmitLeadResult> {
  const fullName = getString(formData, 'fullName')
  const email = getString(formData, 'email')
  const phone = getString(formData, 'phone')
  const company = getString(formData, 'company')
  const interestRaw = getString(formData, 'interest')
  const message = getString(formData, 'message')
  const formType = getString(formData, 'formType')
  const sourcePageRaw = getString(formData, 'sourcePage')
  const sourceMetadataRaw = getString(formData, 'sourceMetadata')

  if (!fullName || !email) {
    return {
      success: false,
      message: 'Please provide your full name and email.',
    }
  }

  const hdrs = await headers()
  const referrer = hdrs.get('referer') || ''
  const sourcePage = sourcePageRaw || referrer || 'unknown'
  const sourceMetadata = sourceMetadataRaw || undefined
  const interest = allowedInterestValues.has(interestRaw as (typeof allowedInterestValues extends Set<infer T> ? T : never))
    ? (interestRaw as
        | 'office'
        | 'warehouse'
        | 'retail'
        | 'self-storage'
        | 'coworking'
        | 'restaurant'
        | 'residential')
    : undefined
  const normalizedFormType =
    formType === 'book-a-tour' || formType === 'contact-form' ? formType : 'contact-form'

  try {
    const payload = await getPayload({ config })

    const createdLead = await payload.create({
      collection: 'leads',
      data: {
        fullName,
        email,
        phone: phone || undefined,
        company: company || undefined,
        interest,
        message: message || undefined,
        sourcePage,
        sourceMetadata,
        formType: normalizedFormType,
        status: 'new',
      },
    })

    const notifyEmail = process.env.LEASING_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'hello@oasisdistrict.com'
    await payload.sendEmail({
      to: notifyEmail,
      subject: `New lead: ${fullName}`,
      text: [
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone || 'N/A'}`,
        `Company: ${company || 'N/A'}`,
        `Interest: ${interest || 'N/A'}`,
        `Form Type: ${normalizedFormType}`,
        `Source Page: ${sourcePage}`,
        `Source Metadata: ${sourceMetadata || 'N/A'}`,
        '',
        'Message:',
        message || 'N/A',
      ].join('\n'),
    })

    const hubspotToken = getHubSpotToken()
    if (hubspotToken) {
      try {
        await createHubSpotContact({
          email,
          fullName,
          phone: phone || undefined,
          sourceMetadata,
          token: hubspotToken,
        })
      } catch (hubspotError) {
        console.error('HubSpot create contact failed:', hubspotError)
      }
    }

    return {
      success: true,
      message: 'Thanks! Your submission was received. Our team will reach out shortly.',
      leadId: createdLead.id,
    }
  } catch (error) {
    console.error('submitLead failed:', error)
    return {
      success: false,
      message: 'Something went wrong while submitting. Please try again.',
    }
  }
}

export async function enrichLead(formData: FormData): Promise<SubmitLeadResult> {
  const leadIdValue = getString(formData, 'leadId')
  const companyName = getString(formData, 'companyName')
  const squareFootageNeededRaw = getString(formData, 'squareFootageNeeded')
  const desiredMoveInDate = getString(formData, 'desiredMoveInDate')
  const businessType = getString(formData, 'businessType')
  const budgetRange = getString(formData, 'budgetRange')
  const desiredLeaseTerm = getString(formData, 'desiredLeaseTerm')
  const decisionTimeline = getString(formData, 'decisionTimeline')
  const sourceMetadata = getString(formData, 'sourceMetadata')

  if (!leadIdValue) {
    return {
      success: false,
      message: 'Lead not found. Please submit the form again.',
    }
  }

  const squareFootageNeeded = Number(squareFootageNeededRaw)
  const hasSquareFootage = squareFootageNeededRaw.length > 0 && Number.isFinite(squareFootageNeeded)

  if (squareFootageNeededRaw.length > 0 && !hasSquareFootage) {
    return {
      success: false,
      message: 'Square footage must be a valid number.',
    }
  }

  try {
    const payload = await getPayload({ config })
    const leadId = /^\d+$/.test(leadIdValue) ? Number(leadIdValue) : leadIdValue

    await payload.update({
      collection: 'leads',
      id: leadId,
      data: {
        company: companyName || undefined,
        squareFootageNeeded: hasSquareFootage ? squareFootageNeeded : undefined,
        desiredMoveInDate: desiredMoveInDate || undefined,
        businessType: businessType || undefined,
        budgetRange: budgetRange || undefined,
        desiredLeaseTerm: desiredLeaseTerm || undefined,
        decisionTimeline: decisionTimeline || undefined,
        sourceMetadata: sourceMetadata || undefined,
      },
    })

    const updatedLead = await payload.findByID({
      collection: 'leads',
      id: leadId,
      depth: 0,
    })
    const leadEmail = typeof updatedLead.email === 'string' ? updatedLead.email.trim() : ''
    const hubspotToken = getHubSpotToken()

    if (leadEmail && hubspotToken) {
      try {
        const hubspotContactId = await findHubSpotContactIdByEmail(leadEmail, hubspotToken)
        if (hubspotContactId) {
          await patchHubSpotContact({
            contactId: hubspotContactId,
            token: hubspotToken,
            properties: {
              company: companyName || undefined,
              square_footage_needed: hasSquareFootage ? String(squareFootageNeeded) : undefined,
              discount_eligible: 'true',
            },
          })
        }
      } catch (hubspotError) {
        console.error('HubSpot enrich contact failed:', hubspotError)
      }
    }

    return {
      success: true,
      message: 'Great! Your profile is complete and your discount request is submitted.',
      leadId,
    }
  } catch (error) {
    console.error('enrichLead failed:', error)
    return {
      success: false,
      message: 'Unable to update your profile right now. Please try again.',
    }
  }
}
