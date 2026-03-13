'use client'

import { useRef, useState, useTransition } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { enrichLead, submitLead } from '@/app/(website)/actions/submitLead'

type Props = {
  sourcePage: string
  sourceMetadata: string
  interest?: string
}

export function UnitSidebarLeadForm({ sourcePage, sourceMetadata, interest }: Props) {
  const stepOneFormRef = useRef<HTMLFormElement>(null)
  const stepTwoFormRef = useRef<HTMLFormElement>(null)
  const [pending, startTransition] = useTransition()
  const [enrichPending, startEnrichTransition] = useTransition()
  const [responseMessage, setResponseMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leadId, setLeadId] = useState<number | string | null>(null)
  const [enrichResponseMessage, setEnrichResponseMessage] = useState('')
  const [enrichSuccess, setEnrichSuccess] = useState(false)

  const clearBothFormsAndState = () => {
    stepOneFormRef.current?.reset()
    stepTwoFormRef.current?.reset()
    setIsModalOpen(false)
    setIsSubmitted(false)
    setLeadId(null)
    setResponseMessage('')
    setSuccess(false)
    setEnrichResponseMessage('')
    setEnrichSuccess(false)
  }

  return (
    <>
      <form
        ref={stepOneFormRef}
        className="mt-3 space-y-2"
        onSubmit={(event) => {
          event.preventDefault()
          const formElement = event.currentTarget
          const formData = new FormData(formElement)

          startTransition(async () => {
            const result = await submitLead(formData)
            setSuccess(result.success)
            setResponseMessage(result.message)

            if (result.success) {
              setIsSubmitted(true)
              setLeadId(result.leadId ?? null)
              setIsModalOpen(Boolean(result.leadId))
            }
          })
        }}
      >
        <input type="hidden" name="formType" value="book-a-tour" />
        <input type="hidden" name="sourcePage" value={sourcePage} />
        <input type="hidden" name="sourceMetadata" value={sourceMetadata} />
        <input type="hidden" name="interest" value={interest ?? ''} />

        <input
          name="fullName"
          required
          placeholder="Full Name"
          className="h-10 w-full border border-white/25 bg-white/10 px-3 text-xs text-white placeholder:text-white/55 outline-none focus:border-white/60 rounded-none"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="h-10 w-full border border-white/25 bg-white/10 px-3 text-xs text-white placeholder:text-white/55 outline-none focus:border-white/60 rounded-none"
        />
        <input
          name="phone"
          placeholder="Phone"
          className="h-10 w-full border border-white/25 bg-white/10 px-3 text-xs text-white placeholder:text-white/55 outline-none focus:border-white/60 rounded-none"
        />
        <textarea
          name="message"
          rows={3}
          placeholder="Tell us your preferred tour time."
          className="w-full border border-white/25 bg-white/10 px-3 py-2 text-xs text-white placeholder:text-white/55 outline-none focus:border-white/60 rounded-none"
        />

        <button
          type="submit"
          disabled={pending}
          className="w-full border border-white bg-white px-4 py-2 text-xs font-semibold tracking-wide text-black hover:bg-neutral-100 disabled:opacity-70 rounded-none"
        >
          {pending ? 'SUBMITTING...' : 'INQUIRE & UNLOCK OFFERS'}
        </button>

        {responseMessage ? (
          <p className={`text-[11px] ${success ? 'text-emerald-300' : 'text-rose-300'}`}>{responseMessage}</p>
        ) : null}

        {isSubmitted && success ? <p className="text-[11px] text-white/70">Step 1 complete. Continue to unlock your discount.</p> : null}
      </form>

      <AnimatePresence>
        {isModalOpen && leadId !== null ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!enrichPending) clearBothFormsAndState()
            }}
          >
            <motion.div
              className="w-full max-w-md border border-white/15 bg-[#121212] p-6 text-white rounded-none"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold tracking-tight">Want a 10% Rent Reduction?</h3>
                <button
                  type="button"
                  className="border border-white/30 px-2 py-1 text-[10px] font-semibold tracking-wide text-white/80 hover:text-white rounded-none"
                  onClick={() => {
                    if (!enrichPending) clearBothFormsAndState()
                  }}
                >
                  CLOSE
                </button>
              </div>
              <p className="mt-2 text-sm text-white/75">
                Complete your profile to unlock a 10% discount on your first year&apos;s lease and priority scheduling.
              </p>

              <form
                ref={stepTwoFormRef}
                className="mt-5 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  formData.set('leadId', String(leadId))
                  formData.set('sourceMetadata', sourceMetadata)

                  startEnrichTransition(async () => {
                    const result = await enrichLead(formData)
                    setEnrichSuccess(result.success)
                    setEnrichResponseMessage(result.message)
                    if (result.success) {
                      clearBothFormsAndState()
                    }
                  })
                }}
              >
                <input
                  name="companyName"
                  placeholder="Company Name"
                  className="h-10 w-full border border-white/25 bg-white/10 px-3 text-xs text-white placeholder:text-white/55 outline-none focus:border-white/60 rounded-none"
                />
                <input
                  name="businessType"
                  placeholder="Business Type (e.g., Retail, Medical, Logistics)"
                  className="h-10 w-full border border-white/25 bg-white/10 px-3 text-xs text-white placeholder:text-white/55 outline-none focus:border-white/60 rounded-none"
                />
                <input
                  name="squareFootageNeeded"
                  type="number"
                  min={1}
                  placeholder="Square Footage Needed"
                  className="h-10 w-full border border-white/25 bg-white/10 px-3 text-xs text-white placeholder:text-white/55 outline-none focus:border-white/60 rounded-none"
                />
                <select
                  name="budgetRange"
                  defaultValue=""
                  className="h-10 w-full border border-white/25 bg-white/10 px-3 text-xs text-white outline-none focus:border-white/60 rounded-none"
                >
                  <option value="" className="bg-neutral-900">
                    Monthly Budget Range
                  </option>
                  <option value="under-3000" className="bg-neutral-900">
                    Under $3,000 / mo
                  </option>
                  <option value="3000-8000" className="bg-neutral-900">
                    $3,000 - $8,000 / mo
                  </option>
                  <option value="8000-15000" className="bg-neutral-900">
                    $8,000 - $15,000 / mo
                  </option>
                  <option value="15000-plus" className="bg-neutral-900">
                    $15,000+ / mo
                  </option>
                </select>
                <input
                  name="desiredMoveInDate"
                  type="date"
                  className="h-10 w-full border border-white/25 bg-white/10 px-3 text-xs text-white outline-none focus:border-white/60 rounded-none"
                />
                <select
                  name="desiredLeaseTerm"
                  defaultValue=""
                  className="h-10 w-full border border-white/25 bg-white/10 px-3 text-xs text-white outline-none focus:border-white/60 rounded-none"
                >
                  <option value="" className="bg-neutral-900">
                    Desired Lease Term
                  </option>
                  <option value="12-months" className="bg-neutral-900">
                    12 Months
                  </option>
                  <option value="24-months" className="bg-neutral-900">
                    24 Months
                  </option>
                  <option value="36-months-plus" className="bg-neutral-900">
                    36+ Months
                  </option>
                  <option value="flexible" className="bg-neutral-900">
                    Flexible
                  </option>
                </select>
                <select
                  name="decisionTimeline"
                  defaultValue=""
                  className="h-10 w-full border border-white/25 bg-white/10 px-3 text-xs text-white outline-none focus:border-white/60 rounded-none"
                >
                  <option value="" className="bg-neutral-900">
                    Decision Timeline
                  </option>
                  <option value="within-30-days" className="bg-neutral-900">
                    Within 30 days
                  </option>
                  <option value="1-3-months" className="bg-neutral-900">
                    1 - 3 months
                  </option>
                  <option value="3-6-months" className="bg-neutral-900">
                    3 - 6 months
                  </option>
                  <option value="researching" className="bg-neutral-900">
                    Researching options
                  </option>
                </select>

                <button
                  type="submit"
                  disabled={enrichPending}
                  className="w-full border border-white bg-white px-4 py-2 text-xs font-semibold tracking-wide text-black hover:bg-neutral-100 disabled:opacity-70 rounded-none"
                >
                  {enrichPending ? 'SAVING...' : 'CLAIM MY DISCOUNT'}
                </button>
              </form>

              {enrichResponseMessage ? (
                <p className={`mt-3 text-[11px] ${enrichSuccess ? 'text-emerald-300' : 'text-rose-300'}`}>{enrichResponseMessage}</p>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
