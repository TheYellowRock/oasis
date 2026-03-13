'use client'

import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { submitLead } from '@/app/(website)/actions/submitLead'

type CategoryOption = {
  slug: string
  name: string
}

type Props = {
  categories: CategoryOption[]
}

export function ContactLeadForm({ categories }: Props) {
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const subject = searchParams.get('subject')?.trim() ?? ''
  const messageDefault = subject
    ? `I am interested in ${subject}. Please share availability and next steps.`
    : ''

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        const formElement = event.currentTarget
        const formData = new FormData(formElement)
        startTransition(async () => {
          const result = await submitLead(formData)
          setSuccess(result.success)
          setMessage(result.message)
          if (result.success) {
            formElement.reset()
          }
        })
      }}
    >
      <input type="hidden" name="subject" value={subject} />
      <input type="hidden" name="sourceMetadata" value={subject} />
      <input type="hidden" name="sourcePage" value="/contact" />
      <input type="hidden" name="formType" value="contact-form" />

      {subject ? (
        <div className="space-y-2">
          <label htmlFor="subjectDisplay" className="text-sm font-medium text-neutral-700">
            Subject
          </label>
          <input
            id="subjectDisplay"
            value={subject}
            readOnly
            className="h-12 w-full border border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-800 outline-none rounded-none"
          />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-neutral-700">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            className="h-12 w-full border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 rounded-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-12 w-full border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 rounded-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-neutral-700">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            required
            className="h-12 w-full border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 rounded-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium text-neutral-700">
            Company
          </label>
          <input
            id="company"
            name="company"
            className="h-12 w-full border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 rounded-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="interest" className="text-sm font-medium text-neutral-700">
          I&apos;m Interested In
        </label>
        <select
          id="interest"
          name="interest"
          className="h-12 w-full border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 rounded-none"
          defaultValue=""
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-neutral-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          defaultValue={messageDefault}
          className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900 rounded-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full border border-black bg-black text-sm font-semibold tracking-wide text-white transition-colors hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-70 rounded-none"
      >
        {pending ? 'SUBMITTING...' : 'SUBMIT INQUIRY'}
      </button>

      {message && (
        <p className={`text-sm ${success ? 'text-emerald-700' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
