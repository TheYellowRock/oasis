'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export function NotificationBanner() {
  const [open, setOpen] = useState(true)

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="bg-oasis-gold relative z-60 overflow-hidden text-black"
        >
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-2 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em]">
              Now Leasing -{' '}
              <Link href="/leasing/book-a-tour" className="underline underline-offset-2">
                Schedule a Tour
              </Link>
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 p-1 hover:opacity-70"
              aria-label="Close notification banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
