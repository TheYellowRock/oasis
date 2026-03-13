import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Unit } from '@/payload-types'
import { ArrowLeft, Building2, Check, CircleDollarSign, MapPin, Ruler, ScrollText } from 'lucide-react'
import { UnitSidebarLeadForm } from '@/components/UnitSidebarLeadForm'

type Props = {
  params: Promise<{ category: string; id: string }>
}

const statusTheme: Record<Unit['status'], string> = {
  available: 'border-emerald-700/50 bg-emerald-600 text-white',
  'under-offer': 'border-amber-700/50 bg-amber-500 text-black',
  leased: 'border-neutral-600/50 bg-neutral-700 text-white',
}

const statusLabel: Record<Unit['status'], string> = {
  available: 'AVAILABLE',
  'under-offer': 'PENDING',
  leased: 'LEASED',
}

function getUnitImages(unit: Unit): Media[] {
  const fromGallery = Array.isArray(unit.media)
    ? unit.media.filter((item): item is Media => typeof item === 'object' && item !== null)
    : []

  if (fromGallery.length > 0) return fromGallery
  if (unit.floorPlan && typeof unit.floorPlan === 'object') return [unit.floorPlan]
  return []
}

function formatUsd(value: number | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatLeaseType(value: Unit['leaseType'] | undefined) {
  if (!value) return 'N/A'
  if (value === 'nnn') return 'NNN'
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatBuilding(value: Unit['building'] | undefined) {
  if (!value) return 'N/A'
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default async function SpaceUnitDetailPage({ params }: Props) {
  const { category, id } = await params
  const unitId = Number(id)
  if (!Number.isFinite(unitId)) return notFound()

  const payload = await getPayload({ config })

  let unit: Unit
  try {
    unit = (await payload.findByID({
      collection: 'units',
      id: unitId,
      depth: 2,
    })) as Unit
  } catch {
    return notFound()
  }

  if (!unit) return notFound()

  const categorySlug = typeof unit.type === 'object' ? unit.type.slug : null
  if (categorySlug && categorySlug !== category) {
    redirect(`/spaces/${categorySlug}/${unit.id}`)
  }

  const categoryName = typeof unit.type === 'object' ? unit.type.name : 'Space'
  const images = getUnitImages(unit)
  const featured = images[0]
  const monthlyRate = formatUsd(unit.price?.amount)
  const sourcePagePath = `/spaces/${category}/${unit.id}`
  const sourceMetadata = `unit-id:${unit.id}`

  return (
    <div className="sharp-edges mx-auto max-w-7xl px-4 pb-12 pt-36 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href={categorySlug ? `/spaces/${categorySlug}` : '/spaces'}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Spaces
        </Link>
      </div>

      <section className="relative overflow-hidden border border-neutral-200 bg-white rounded-none">
        <div className="relative aspect-16/7 w-full bg-neutral-200">
          {featured?.url ? (
            <Image
              src={featured.url}
              alt={featured.alt || `Unit ${unit.unitNumber}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-neutral-200 to-neutral-300" />
          )}

          <span
            className={`absolute left-4 top-4 border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${statusTheme[unit.status] ?? 'bg-neutral-700 text-white'} rounded-none`}
          >
            {statusLabel[unit.status] ?? unit.status.toUpperCase()}
          </span>
        </div>
      </section>

      <section className="mt-10 grid gap-10 lg:grid-cols-10">
        <div className="space-y-8 lg:col-span-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#35c4b5]">
              {categoryName.toUpperCase()} SPACE
            </p>
            <h1 className="mt-2 font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl">Premium Unit</h1>
            <p className="mt-2 text-sm text-neutral-600">Unit #{unit.unitNumber}</p>
          </div>

          <div className="grid border border-neutral-200 bg-[#f5f5f5] text-sm sm:grid-cols-2 xl:grid-cols-4">
            <div className="border-b border-neutral-200 p-4 sm:border-r xl:border-b-0">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-neutral-500">
                <Ruler className="h-4 w-4" />
                Size
              </p>
              <p className="mt-1 font-semibold text-neutral-900">{unit.sqFt?.toLocaleString() ?? 'N/A'} SF</p>
            </div>

            <div className="border-b border-neutral-200 p-4 xl:border-b-0 xl:border-r">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-neutral-500">
                <CircleDollarSign className="h-4 w-4" />
                Price
              </p>
              <p className="mt-1 font-semibold text-neutral-900">{monthlyRate}/mo</p>
            </div>

            <div className="border-b border-neutral-200 p-4 sm:border-r sm:border-b-0">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-neutral-500">
                <MapPin className="h-4 w-4" />
                Address
              </p>
              <p className="mt-1 font-semibold text-neutral-900">3355 Spring Mountain Rd - {formatBuilding(unit.building)}</p>
            </div>

            <div className="p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-neutral-500">
                <ScrollText className="h-4 w-4" />
                Lease Type
              </p>
              <p className="mt-1 font-semibold text-neutral-900">{formatLeaseType(unit.leaseType)}</p>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none">
            {unit.description ? (
              <RichText data={unit.description} />
            ) : (
              <>
                <h3>Description</h3>
                <p>
                  This space is designed for brands that value visibility, operational efficiency, and premium location.
                  Contact our leasing team for detailed fit-out information and lease terms.
                </p>
              </>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Amenities</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {(unit.features && unit.features.length > 0
                ? unit.features.map((feature) => feature.feature)
                : ['High-Speed Internet', '24/7 Secure Access', 'HVAC Ready', 'Flexible Buildout']
              ).map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 rounded-none"
                >
                  <Check className="mt-0.5 h-4 w-4 text-[#35c4b5]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="border border-neutral-900 bg-[#111111] p-5 text-white rounded-none">
              <p className="text-xs uppercase tracking-[0.14em] text-white/70">Monthly Rate</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{monthlyRate}</p>

              <div className="mt-4 border-t border-white/20 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Book a Tour</p>
                <UnitSidebarLeadForm
                  sourcePage={sourcePagePath}
                  sourceMetadata={sourceMetadata}
                  interest={categorySlug ?? undefined}
                />
              </div>
            </div>

            <div className="border border-neutral-200 bg-white p-4 rounded-none">
              <p className="text-sm font-semibold text-neutral-900">Need Help?</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-neutral-700">
                <Building2 className="h-4 w-4 text-[#35c4b5]" />
                (702) 555-1234
              </p>
              <p className="mt-1 text-xs text-neutral-500">Mon - Fri, 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
