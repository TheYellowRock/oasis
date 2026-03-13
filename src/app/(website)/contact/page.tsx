import Link from 'next/link'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ContactLeadForm } from '@/components/ContactLeadForm'

export default async function ContactPage() {
  const payload = await getPayload({ config })
  const categories = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 50,
    sort: 'name',
  })

  const categoryOptions = categories.docs.map((category) => ({
    slug: category.slug,
    name: category.name,
  }))

  return (
    <div className="sharp-edges bg-white">
      <section className="bg-[#111111] text-white">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-44 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#35c4b5]">Get In Touch</p>
          <h1 className="mt-5 font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
            Let&apos;s Start a Conversation
          </h1>
          <p className="mt-5 max-w-3xl text-base text-white/80 sm:text-lg">
            Whether you&apos;re interested in leasing, have a question, or want to schedule a tour, our team is here
            to help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div className="space-y-8">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Contact Information</h2>

            <div className="space-y-4 text-sm text-neutral-700">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-[#35c4b5]" />
                <span>
                  3355 Spring Mountain Rd
                  <br />
                  Las Vegas, NV 89102
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#35c4b5]" />
                <a href="tel:+17025551234" className="hover:text-neutral-900">
                  (702) 555-1234
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#35c4b5]" />
                <a href="mailto:hello@oasisdistrict.com" className="hover:text-neutral-900">
                  hello@oasisdistrict.com
                </a>
              </p>
              <p className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 text-[#35c4b5]" />
                <span>
                  Mon - Fri: 9:00 AM - 6:00 PM
                  <br />
                  Sat: 10:00 AM - 3:00 PM
                </span>
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden border border-neutral-300 rounded-none">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&w=1200&q=80"
              alt="Map preview"
              className="h-64 w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link
                href="https://maps.google.com/?q=3355+Spring+Mountain+Rd,+Las+Vegas,+NV"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white bg-white px-5 py-3 text-xs font-semibold tracking-wide text-black transition-colors hover:bg-neutral-100 rounded-none"
              >
                VIEW ON MAP
              </Link>
            </div>
          </div>
        </div>

        <div className="border border-neutral-200 bg-[#F9F9F9] p-6 sm:p-8 rounded-none">
          <h3 className="text-2xl font-semibold tracking-tight text-neutral-900">Send Us a Message</h3>
          <p className="mt-2 text-sm text-neutral-600">Tell us what you need and our leasing team will follow up.</p>
          <div className="mt-6">
            <ContactLeadForm categories={categoryOptions} />
          </div>
        </div>
      </section>

      <section className="bg-[#111111] py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-3xl font-serif leading-tight">Ready to Schedule a Tour?</p>
            <p className="mt-2 text-white/80">See our spaces in person and meet our leasing team.</p>
          </div>
          <a
            href="tel:+17025551234"
            className="inline-flex items-center border border-white bg-white px-6 py-3 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-neutral-100 rounded-none"
          >
            CALL NOW: (702) 555-1234
          </a>
        </div>
      </section>
    </div>
  )
}
