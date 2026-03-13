import Link from 'next/link'
import Image from 'next/image'
import { Building2, Dot, MapPin, Ruler } from 'lucide-react'
import type { Media, Unit } from '@/payload-types'

function getUnitImage(unit: Unit): Media | null {
  if (Array.isArray(unit.media)) {
    const firstMedia = unit.media.find((item): item is Media => typeof item === 'object' && item !== null)
    if (firstMedia) return firstMedia
  }

  if (unit.floorPlan && typeof unit.floorPlan === 'object') {
    return unit.floorPlan as Media
  }
  return null
}

const statusClasses: Record<Unit['status'], string> = {
  available: 'bg-emerald-50 text-emerald-800',
  'under-offer': 'bg-amber-50 text-amber-800',
  leased: 'bg-neutral-100 text-neutral-700',
}

const statusLabels: Record<Unit['status'], string> = {
  available: 'AVAILABLE',
  'under-offer': 'PENDING',
  leased: 'LEASED',
}

function formatUsdPerMonth(value: number) {
  return `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)}/mo`
}

const buildingLabels: Record<string, string> = {
  'building-a': 'Building A',
  'building-b': 'Building B',
  annex: 'Annex',
}

export function UnitCard({ unit }: { unit: Unit }) {
  const image = getUnitImage(unit)
  const typeLabel = typeof unit.type === 'object' ? unit.type.name : 'Unknown'
  const typeBadge = typeLabel.toUpperCase()
  const imageUrl = image?.url ?? image?.thumbnailURL ?? null
  const statusClass = statusClasses[unit.status] ?? 'bg-gray-700 text-white'
  const statusLabel = statusLabels[unit.status] ?? unit.status.toUpperCase()
  const buildingLabel = buildingLabels[unit.building] ?? unit.building
  const categorySlug = typeof unit.type === 'object' ? unit.type.slug : undefined
  const detailsHref = categorySlug ? `/spaces/${categorySlug}/${unit.id}` : '/spaces'

  return (
    <Link href={detailsHref} className="group block">
      <article className="overflow-hidden border bg-white shadow-sm transition-shadow hover:shadow-md rounded-none">
        <div className="relative aspect-4/3 w-full bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={image?.alt || `Unit ${unit.unitNumber}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-gray-200 to-gray-300 text-center">
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-gray-600">OASIS DISTRICT</p>
                <p className="mt-1 text-xs text-gray-500">Leasing Preview</p>
              </div>
            </div>
          )}
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${statusClass}`}
          >
            <Dot className="h-4 w-4" />
            {statusLabel}
          </span>
          <span className="absolute right-3 top-3 border border-white/40 bg-black/60 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
            {typeBadge}
          </span>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight group-hover:underline">Unit #{unit.unitNumber}</h3>
            <p className="text-base font-semibold">{formatUsdPerMonth(unit.price.amount)}</p>
          </div>

          <div className="space-y-2 text-sm text-neutral-600">
            <p className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-neutral-500" />
              <span>{unit.sqFt.toLocaleString()} SF</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-500" />
              <span>3355 Spring Mountain Rd - {buildingLabel}</span>
            </p>
            <p className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-neutral-500" />
              <span>{typeLabel}</span>
            </p>
          </div>
        </div>
      </article>
    </Link>
  )
}
