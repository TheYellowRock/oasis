import { getPayload } from 'payload'
import type { Where } from 'payload'
import { redirect } from 'next/navigation'
import config from '@payload-config'
import { LeasingFiltersBar } from '@/components/LeasingFiltersBar'
import { PostSearchCTA } from '@/components/PostSearchCTA'
import { UnitCard } from '@/components/UnitCard'
import type { Unit } from '@/payload-types'

type SearchParams = Record<string, string | string[] | undefined>

type Props = {
  searchParams: Promise<SearchParams>
}

const validStatuses = new Set(['available', 'under-offer', 'leased'])
const validSorts = new Set(['-createdAt', 'price.amount'])
const typeRedirectMap: Record<string, string> = {
  office: 'office',
  warehouse: 'warehouse',
  retail: 'retail',
  'self-storage': 'self-storage',
  storage: 'self-storage',
  restaurant: 'restaurant',
  coworking: 'coworking',
  residential: 'residential',
}
const leasingHeroImage =
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2200&q=80'

function parseRange(value: string | undefined): { min?: number; max?: number } {
  if (!value) return {}
  const [rawMin, rawMax] = value.split('-')
  const min = Number(rawMin)
  const max = Number(rawMax)
  return {
    min: Number.isFinite(min) ? min : undefined,
    max: Number.isFinite(max) ? max : undefined,
  }
}

function getParam(params: SearchParams, key: string): string | undefined {
  const value = params[key]
  if (Array.isArray(value)) return value[0]
  return value
}

function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export default async function LeasingPage({ searchParams }: Props) {
  const resolvedParams = await searchParams

  const typeSlug = getParam(resolvedParams, 'type')?.toLowerCase()
  const mappedType = typeSlug ? typeRedirectMap[typeSlug] : undefined
  if (mappedType) {
    const redirectParams = new URLSearchParams()
    for (const [key, value] of Object.entries(resolvedParams)) {
      if (key === 'type' || value === undefined) continue
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== undefined) redirectParams.append(key, item)
        }
      } else {
        redirectParams.set(key, value)
      }
    }

    const query = redirectParams.toString()
    redirect(query ? `/spaces/${mappedType}?${query}` : `/spaces/${mappedType}`)
  }

  const payload = await getPayload({ config })

  const query = getParam(resolvedParams, 'q')?.trim()
  const status = getParam(resolvedParams, 'status')
  const minSqFt = toNumber(getParam(resolvedParams, 'minSqFt'))
  const maxSqFt = toNumber(getParam(resolvedParams, 'maxSqFt'))
  const minPrice = toNumber(getParam(resolvedParams, 'minPrice'))
  const maxPrice = toNumber(getParam(resolvedParams, 'maxPrice'))
  const sqFtRange = parseRange(getParam(resolvedParams, 'sqFt'))
  const priceRange = parseRange(getParam(resolvedParams, 'price'))
  const building = getParam(resolvedParams, 'building')
  const amenity = getParam(resolvedParams, 'amenity')?.trim()
  const sortParam = getParam(resolvedParams, 'sort')
  const sort = validSorts.has(sortParam ?? '') ? sortParam : '-createdAt'

  const and: Where[] = []

  if (query) {
    const matchingCategories = await payload.find({
      collection: 'categories',
      depth: 0,
      limit: 20,
      where: {
        or: [{ name: { contains: query } }, { slug: { contains: query.toLowerCase() } }],
      },
    })
    const categoryIds = matchingCategories.docs.map((category) => category.id)

    and.push({
      or: [
        { unitNumber: { contains: query } },
        { building: { contains: query.toLowerCase() } },
        { 'features.feature': { contains: query } },
        ...(categoryIds.length > 0 ? [{ type: { in: categoryIds } }] : []),
      ],
    })
  }

  if (status && validStatuses.has(status)) {
    and.push({ status: { equals: status } })
  }

  if (minSqFt !== undefined) {
    and.push({ sqFt: { greater_than_equal: minSqFt } })
  }

  if (maxSqFt !== undefined) {
    and.push({ sqFt: { less_than_equal: maxSqFt } })
  }

  if (minPrice !== undefined) {
    and.push({ 'price.amount': { greater_than_equal: minPrice } })
  }

  if (maxPrice !== undefined) {
    and.push({ 'price.amount': { less_than_equal: maxPrice } })
  }

  if (sqFtRange.min !== undefined) {
    and.push({ sqFt: { greater_than_equal: sqFtRange.min } })
  }

  if (sqFtRange.max !== undefined) {
    and.push({ sqFt: { less_than_equal: sqFtRange.max } })
  }

  if (priceRange.min !== undefined) {
    and.push({ 'price.amount': { greater_than_equal: priceRange.min } })
  }

  if (priceRange.max !== undefined) {
    and.push({ 'price.amount': { less_than_equal: priceRange.max } })
  }

  if (building) {
    and.push({ building: { equals: building } })
  }

  if (amenity) {
    and.push({ 'features.feature': { contains: amenity } })
  }

  const unitsResult = await payload.find({
    collection: 'units',
    depth: 1,
    sort,
    limit: 100,
    where: and.length > 0 ? { and } : undefined,
  })

  const units = unitsResult.docs as Unit[]

  return (
    <div className="sharp-edges">
      <section className="relative overflow-visible bg-[#111111] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${leasingHeroImage})` }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-7xl px-4 pb-30 pt-44 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D48B28]">
            Available Spaces
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
            Find Your Perfect Space
          </h1>
          <p className="mt-5 max-w-3xl text-base text-white/80 sm:text-lg">
            Explore our inventory of premium retail, office, warehouse, and commercial spaces in the
            heart of Las Vegas.
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <LeasingFiltersBar availableCount={units.length} typeSelectionMode="dedicated-route" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6 lg:px-8">
        {units.length === 0 ? (
          <div className="border border-dashed p-12 text-center text-gray-500">
            No units match your current filters.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {units.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </div>

      <PostSearchCTA segment="all" />
    </div>
  )
}
