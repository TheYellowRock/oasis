'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

type LeadSubmitResult = {
  success: boolean
  message: string
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

export async function submitLead(formData: FormData): Promise<LeadSubmitResult> {
  const fullName = getString(formData, 'fullName')
  const email = getString(formData, 'email')
  const phone = getString(formData, 'phone')
  const company = getString(formData, 'company')
  const interestValue = getString(formData, 'interest')
  const subject = getString(formData, 'subject')
  const sourcePage = getString(formData, 'sourcePage')
  const formType = getString(formData, 'formType')
  const message = getString(formData, 'message')
  const interest = allowedInterestValues.has(interestValue as (typeof allowedInterestValues extends Set<infer T> ? T : never))
    ? (interestValue as
        | 'office'
        | 'warehouse'
        | 'retail'
        | 'self-storage'
        | 'coworking'
        | 'restaurant'
        | 'residential')
    : undefined

  if (!fullName || !email) {
    return {
      success: false,
      message: 'Please complete full name and email.',
    }
  }

  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'leads',
      data: {
        fullName,
        email,
        phone: phone || undefined,
        company: company || undefined,
        interest: interest || undefined,
        message: message || undefined,
        sourcePage: sourcePage || undefined,
        formType: (formType as 'contact-form' | 'book-a-tour') || undefined,
      },
    })

    const notifyEmail = process.env.LEASING_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'hello@oasisdistrict.com'

    // If no email adapter is configured, Payload logs this to console.
    await payload.sendEmail({
      to: notifyEmail,
      subject: `New leasing lead: ${fullName}`,
      text: [
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Company: ${company || 'N/A'}`,
        `Interested In: ${interest || 'N/A'}`,
        `Subject: ${subject || 'N/A'}`,
        `Source Page: ${sourcePage || 'N/A'}`,
        `Form Type: ${formType || 'N/A'}`,
        '',
        'Message:',
        message || 'N/A',
      ].join('\n'),
    })

    return {
      success: true,
      message: 'Thanks! Our leasing team will contact you shortly.',
    }
  } catch (error) {
    console.error('Failed to submit lead:', error)
    return {
      success: false,
      message: 'Unable to submit right now. Please try again in a moment.',
    }
  }
}

export async function updateLeadStatus(id: number, status: 'new' | 'contacted' | 'closed') {
  const payload = await getPayload({ config })
  await payload.update({
    collection: 'leads',
    id,
    data: { status },
  })
  revalidatePath('/dashboard/leads')
}
