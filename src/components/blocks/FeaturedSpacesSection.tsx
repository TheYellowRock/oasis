import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { FeaturedSpacesBlock, Unit } from '@/payload-types'

export function FeaturedSpacesSection({
  block,
  units,
}: {
  block: FeaturedSpacesBlock
  units: Unit[]
}) {
  function getUnitImage(unit: Unit) {
    if (Array.isArray(unit.media)) {
      const media = unit.media.find((item) => typeof item === 'object' && item !== null)
      if (media && 'url' in media) return media
    }

    if (unit.floorPlan && typeof unit.floorPlan === 'object') return unit.floorPlan
    return null
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <section className="bg-[#f3f3f3] px-6 py-20 pt-30">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#35c4b5]">
              Available Now
            </p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight text-gray-900 sm:text-5xl">
              Featured Spaces
            </h2>
          </div>

          <Link
            href={block.viewAllHref}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-900 hover:text-black"
          >
            {block.viewAllText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {units.map((unit) => {
            const image = getUnitImage(unit)
            const typeName = typeof unit.type === 'object' ? unit.type.name : 'Space'
            const categorySlug = typeof unit.type === 'object' ? unit.type.slug : undefined
            const detailsHref = categorySlug ? `/spaces/${categorySlug}/${unit.id}` : '/spaces'

            return (
              <article
                key={unit.id}
                className="overflow-hidden border border-gray-200 bg-white shadow-sm rounded-none"
              >
                <div className="relative">
                  {image?.url ? (
                    <img
                      src={image.url}
                      alt={image.alt || unit.unitNumber}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="h-44 bg-linear-to-br from-gray-200 to-gray-300" />
                  )}
                  <span className="absolute left-3 top-3 border border-white/50 bg-black/65 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white rounded-none">
                    {typeName.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1 p-4">
                  <h3 className="text-lg font-semibold text-gray-900">Unit #{unit.unitNumber}</h3>
                  <p className="text-sm text-gray-600">{unit.sqFt.toLocaleString()} SQ FT</p>
                  <p className="pt-1 text-lg font-semibold text-gray-900">
                    {formatCurrency(unit.price.amount)}/mo
                  </p>
                  <div className="pt-3">
                    <Link
                      href={detailsHref}
                      className="inline-flex border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-neutral-900 hover:bg-neutral-100 rounded-none"
                    >
                      VIEW LISTING
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={block.bottomButtonHref}
            className="inline-flex bg-black px-7 py-3 text-sm font-semibold tracking-wide text-white hover:bg-black/90 rounded-none"
          >
            {block.bottomButtonLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
