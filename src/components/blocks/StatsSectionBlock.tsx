import Link from 'next/link'
import { Check } from 'lucide-react'
import type { StatsSectionBlock as StatsSectionBlockType } from '@/payload-types'

export function StatsSectionBlock({ block }: { block: StatsSectionBlockType }) {
  const primary =
    block.primaryImage && typeof block.primaryImage === 'object' ? block.primaryImage : null

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl shadow-xl">
        <div className="grid lg:grid-cols-2">
          <div className="min-h-125 overflow-hidden">
            {primary?.url ? (
              <img
                src={primary.url}
                alt={primary.alt || 'Cowork lounge'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full min-h-125 bg-linear-to-br from-gray-300 to-gray-500" />
            )}
          </div>

          <div className="bg-[#111111] p-8 text-white sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#35c4b5]">
              The Cowork Lounge
            </p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
              Work Smarter, Not Harder
            </h2>
            <p className="mt-5 text-base text-white/80">{block.description}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {block.stats?.map((stat, index) => (
                <div
                  key={stat.id ?? index}
                  className="flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-2 rounded-none"
                >
                  <Check className="h-4 w-4 text-[#35c4b5]" />
                  <p className="text-sm text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/explore/cowork-lounge"
                className="inline-flex border border-white bg-white px-5 py-3 text-xs font-semibold tracking-wide text-black hover:bg-neutral-100 rounded-none"
              >
                EXPLORE COWORKING
              </Link>
              <Link
                href="/leasing/book-a-tour"
                className="inline-flex border border-white/60 bg-transparent px-5 py-3 text-xs font-semibold tracking-wide text-white hover:bg-white/10 rounded-none"
              >
                SCHEDULE A TOUR
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
