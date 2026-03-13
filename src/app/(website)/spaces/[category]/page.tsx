import { getPayload } from 'payload'
import type { Metadata } from 'next'
import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  Check,
  Lock,
  MapPin,
  Package,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  Users,
  Wifi,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Where } from 'payload'
import config from '@payload-config'
import { LeasingFiltersBar } from '@/components/LeasingFiltersBar'
import { PostSearchCTA } from '@/components/PostSearchCTA'
import { UnitCard } from '@/components/UnitCard'
import type { Unit } from '@/payload-types'

type SearchParams = Record<string, string | string[] | undefined>

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<SearchParams>
}

const validSorts = new Set(['-createdAt', 'price.amount'])
const validStatuses = new Set(['available', 'under-offer', 'leased'])
const defaultHeroImage =
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2200&q=80'

const heroCategoryIconMap: Record<string, LucideIcon> = {
  office: Building2,
  warehouse: Package,
  retail: ShoppingBag,
  'self-storage': Lock,
}

const quickSpecIconMap: Record<string, LucideIcon> = {
  'building-2': Building2,
  package: Package,
  'shopping-bag': ShoppingBag,
  lock: Lock,
  wifi: Wifi,
  shield: Shield,
  users: Users,
  truck: Truck,
  zap: Zap,
  'map-pin': MapPin,
  star: Star,
  check: Check,
}

type QuickSpec = {
  icon: string
  title: string
  subtitle: string
}

const categoryMarketingFallbacks: Record<
  string,
  {
    heroTitle: string
    heroSubheadline: string
    quickSpecs: QuickSpec[]
  }
> = {
  office: {
    heroTitle: 'Professional Office Space for Lease',
    heroSubheadline:
      'Flexible office suites built for productivity, client confidence, and long-term growth in Las Vegas.',
    quickSpecs: [
      {
        icon: 'building-2',
        title: 'Private Suites',
        subtitle: 'Move-in ready layouts for teams of all sizes.',
      },
      {
        icon: 'wifi',
        title: 'Fiber Internet',
        subtitle: 'High-speed connectivity for modern operations.',
      },
      {
        icon: 'shield',
        title: 'Secure Access',
        subtitle: 'Controlled entry for staff and clients.',
      },
      {
        icon: 'users',
        title: 'Meeting Rooms',
        subtitle: 'Professional shared spaces for collaboration.',
      },
    ],
  },
  warehouse: {
    heroTitle: 'Industrial Warehouse Space That Scales',
    heroSubheadline:
      'Optimize logistics and fulfillment with high-capacity warehouse inventory in a strategic Las Vegas location.',
    quickSpecs: [
      {
        icon: 'package',
        title: 'High Ceilings',
        subtitle: 'Vertical capacity for efficient storage design.',
      },
      {
        icon: 'truck',
        title: 'Loading Docks',
        subtitle: 'Smooth inbound and outbound operations.',
      },
      {
        icon: 'zap',
        title: '3-Phase Power',
        subtitle: 'Infrastructure for heavy equipment and machinery.',
      },
      { icon: 'shield', title: '24/7 Security', subtitle: 'Monitored access for peace of mind.' },
    ],
  },
  retail: {
    heroTitle: 'Retail Space Built for Visibility',
    heroSubheadline:
      'Capture attention with premium storefront opportunities in one of Las Vegas' +
      "'" +
      's active commercial corridors.',
    quickSpecs: [
      {
        icon: 'users',
        title: 'High Foot Traffic',
        subtitle: 'Consistent exposure to daily visitors.',
      },
      {
        icon: 'map-pin',
        title: 'Street Visibility',
        subtitle: 'Positioned for discovery and repeat visits.',
      },
      {
        icon: 'star',
        title: 'Signage Rights',
        subtitle: 'Prominent branding opportunities available.',
      },
      {
        icon: 'shopping-bag',
        title: 'Modern Storefronts',
        subtitle: 'Clean, contemporary spaces ready for merchandising.',
      },
    ],
  },
  'self-storage': {
    heroTitle: 'Secure Self Storage With Flexible Access',
    heroSubheadline:
      'Protect inventory, equipment, and personal items with clean, secure storage solutions in Las Vegas.',
    quickSpecs: [
      {
        icon: 'lock',
        title: 'Secure Units',
        subtitle: 'Controlled and monitored storage environment.',
      },
      { icon: 'check', title: 'Flexible Terms', subtitle: 'Lease options to match your timeline.' },
      {
        icon: 'truck',
        title: 'Easy Loading',
        subtitle: 'Convenient access for vehicles and moving teams.',
      },
      {
        icon: 'shield',
        title: 'Safe Facility',
        subtitle: 'Designed for reliability and peace of mind.',
      },
    ],
  },
}

function getParam(params: SearchParams, key: string): string | undefined {
  const value = params[key]
  if (Array.isArray(value)) return value[0]
  return value
}

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

function humanizeCategory(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: Omit<Props, 'searchParams'>): Promise<Metadata> {
  const { category } = await params
  const payload = await getPayload({ config })

  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: category } },
    limit: 1,
    depth: 0,
  })

  const categoryDoc = categoryResult.docs[0]
  if (!categoryDoc) {
    return {
      title: 'Spaces | Oasis District',
      description: 'Browse available commercial spaces at Oasis District in Las Vegas.',
    }
  }

  const readableName = categoryDoc.name || humanizeCategory(category)
  const marketing = categoryDoc.marketingContent

  return {
    title: `Premium ${readableName} Spaces in Las Vegas | Oasis District`,
    description:
      marketing?.heroSubheadline ??
      categoryDoc.heroDescription ??
      categoryDoc.description ??
      `Explore premium ${readableName.toLowerCase()} spaces at Oasis District in Las Vegas.`,
  }
}

export default async function CategorySpacesPage({ params, searchParams }: Props) {
  const { category } = await params
  const resolvedParams = await searchParams
  const payload = await getPayload({ config })

  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: category } },
    depth: 1,
    limit: 1,
  })

  const categoryDoc = categoryResult.docs[0]
  if (!categoryDoc) {
    notFound()
  }

  const query = getParam(resolvedParams, 'q')?.trim()
  const status = getParam(resolvedParams, 'status')
  const sortParam = getParam(resolvedParams, 'sort')
  const sort = validSorts.has(sortParam ?? '') ? sortParam : '-createdAt'
  const sqFtRange = parseRange(getParam(resolvedParams, 'sqFt'))
  const priceRange = parseRange(getParam(resolvedParams, 'price'))
  const building = getParam(resolvedParams, 'building')
  const amenity = getParam(resolvedParams, 'amenity')?.trim()

  const and: Where[] = [{ type: { equals: categoryDoc.id } }]

  if (query) {
    and.push({
      or: [
        { unitNumber: { contains: query } },
        { building: { contains: query.toLowerCase() } },
        { 'features.feature': { contains: query } },
      ],
    })
  }

  if (status && validStatuses.has(status)) {
    and.push({ status: { equals: status } })
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
    where: { and },
  })

  const units = unitsResult.docs as Unit[]
  const marketingFallback = categoryMarketingFallbacks[categoryDoc.slug] ?? {
    heroTitle: `Premium ${categoryDoc.name} Spaces`,
    heroSubheadline: `Explore available ${categoryDoc.name.toLowerCase()} spaces in the heart of Las Vegas.`,
    quickSpecs: [
      {
        icon: 'building-2',
        title: 'Prime Location',
        subtitle: 'Strategically positioned in central Las Vegas.',
      },
      {
        icon: 'shield',
        title: 'Secure Access',
        subtitle: 'Professional-grade entry and monitoring.',
      },
      {
        icon: 'check',
        title: 'Flexible Terms',
        subtitle: 'Leasing options designed around business needs.',
      },
      {
        icon: 'users',
        title: 'Business Ready',
        subtitle: 'Move-in-ready spaces built for operations.',
      },
    ],
  }

  const marketing = categoryDoc.marketingContent
  const heroImage =
    categoryDoc.heroBackgroundImage && typeof categoryDoc.heroBackgroundImage === 'object'
      ? categoryDoc.heroBackgroundImage.url
      : null

  const heroTitle = marketing?.heroTitle || categoryDoc.heroTitle || marketingFallback.heroTitle
  const heroDescription =
    marketing?.heroSubheadline ||
    categoryDoc.heroDescription ||
    categoryDoc.description ||
    marketingFallback.heroSubheadline
  const quickSpecs =
    marketing?.quickSpecs?.length === 4 ? marketing.quickSpecs : marketingFallback.quickSpecs
  const CategoryIcon = heroCategoryIconMap[categoryDoc.slug] ?? Building2

  return (
    <div className="sharp-edges">
      <section className="relative overflow-visible bg-[#111111] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage ?? defaultHeroImage})` }}
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto max-w-7xl px-4 pb-30 pt-44 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D48B28]">
            <CategoryIcon className="h-4 w-4" />
            {categoryDoc.name.toUpperCase()} SPACES
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">{heroTitle}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            {heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/leasing/book-a-tour"
              className="border border-white bg-white px-5 py-3 text-xs font-semibold tracking-wide text-black transition-colors hover:bg-neutral-100 rounded-none"
            >
              SCHEDULE A TOUR
            </Link>
            <Link
              href="/contact"
              className="border border-white/60 bg-transparent px-5 py-3 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-white/10 rounded-none"
            >
              CONTACT LEASING
            </Link>
          </div>

          <div className="mt-8  grid grid-cols-2 gap-3 md:grid-cols-4">
            {quickSpecs.map((spec, index) => {
              const SpecIcon = quickSpecIconMap[spec.icon] ?? Building2

              return (
                <article
                  key={`${spec.title}-${index}`}
                  className="border border-white/20 bg-black/40 p-4 backdrop-blur-sm rounded-none"
                >
                  <SpecIcon className="h-5 w-5 text-[#D48B28]" />
                  <h3 className="mt-3 text-sm font-semibold tracking-wide text-white">
                    {spec.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/70">{spec.subtitle}</p>
                </article>
              )
            })}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <LeasingFiltersBar availableCount={units.length} showTypeFilter={false} />
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

      <PostSearchCTA segment={categoryDoc.slug} />
    </div>
  )
}
