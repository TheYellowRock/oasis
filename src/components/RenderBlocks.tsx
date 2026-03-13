import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Page, Category, Post, Unit } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { LeadInquiryForm } from '@/components/LeadInquiryForm'
import { Building2, Clock3, Coffee, ShieldCheck, Users, Wifi } from 'lucide-react'
import { HomeHeroSection } from '@/components/blocks/HomeHeroSection'
import { ServicesGridSection } from '@/components/blocks/ServicesGridSection'
import { FeaturedSpacesSection } from '@/components/blocks/FeaturedSpacesSection'
import { StatsSectionBlock } from '@/components/blocks/StatsSectionBlock'
import { FinalCTASection } from '@/components/blocks/FinalCTASection'

type LayoutBlock = NonNullable<Page['layout']>[number]

const amenityIcons = {
  wifi: Wifi,
  coffee: Coffee,
  users: Users,
  shield: ShieldCheck,
  clock: Clock3,
  building: Building2,
} as const

function HeroBlock({ block }: { block: Extract<LayoutBlock, { blockType: 'hero' }> }) {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center bg-gray-50 px-6 py-24">
      {block.image && typeof block.image === 'object' && block.image.url && (
        <img
          src={block.image.url}
          alt={block.image.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {block.title}
        </h1>
        {block.subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">{block.subtitle}</p>
        )}
      </div>
    </section>
  )
}

function InventoryGridBlock({
  block,
}: {
  block: Extract<LayoutBlock, { blockType: 'inventoryGrid' }>
}) {
  const categories = block.categories as (number | Category)[] | null | undefined

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">{block.title}</h2>
        {Array.isArray(categories) && categories.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              if (typeof cat === 'number') return null
              return (
                <div
                  key={cat.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
                  {cat.description && (
                    <p className="mt-2 text-sm text-gray-500">{cat.description}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function ContentBlock({ block }: { block: Extract<LayoutBlock, { blockType: 'content' }> }) {
  return (
    <section className="px-6 py-16">
      <div className="prose prose-gray mx-auto max-w-3xl">
        <RichText data={block.richText} />
      </div>
    </section>
  )
}

function CoworkHeroBlock({
  block,
}: {
  block: Extract<LayoutBlock, { blockType: 'coworkHero' }>
}) {
  const bg = block.backgroundImage && typeof block.backgroundImage === 'object' ? block.backgroundImage : null

  return (
    <section className="relative isolate overflow-hidden">
      {bg?.url && (
        <img
          src={bg.url}
          alt={bg.alt || block.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-20">
        <div className="max-w-3xl text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            {block.overTitle}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{block.title}</h1>
          <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">{block.description}</p>

          {Array.isArray(block.amenities) && block.amenities.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {block.amenities.map((item, index) => {
                const Icon = amenityIcons[item.icon as keyof typeof amenityIcons]
                return (
                  <div
                    key={item.id ?? index}
                    className="flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2"
                  >
                    {Icon && <Icon className="h-4 w-4 text-amber-300" />}
                    <span className="text-sm text-white">{item.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function PricingCardsBlock({
  block,
}: {
  block: Extract<LayoutBlock, { blockType: 'pricingCards' }>
}) {
  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {block.overTitle && (
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
            {block.overTitle}
          </p>
        )}
        <h2 className="mx-auto mt-3 max-w-3xl text-center text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {block.title}
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {block.plans?.map((plan, index) => (
            <article
              key={plan.id ?? index}
              className={`relative rounded-xl bg-white p-6 shadow-sm ${plan.isFeatured ? 'border-2 border-amber-500' : 'border border-gray-200'}`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-black">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${plan.price?.toLocaleString()}
                <span className="ml-1 text-base font-medium text-gray-500">{plan.frequency}</span>
              </p>

              <ul className="mt-6 space-y-2 text-sm text-gray-700">
                {plan.features?.map((feature, featureIndex) => (
                  <li key={feature.id ?? featureIndex} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>{feature.feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-8 w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black/90"
              >
                Choose Plan
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SplitLeadSectionBlock({
  block,
}: {
  block: Extract<LayoutBlock, { blockType: 'splitLeadSection' }>
}) {
  const image = block.image && typeof block.image === 'object' ? block.image : null

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border">
          {image?.url ? (
            <img src={image.url} alt={image.alt || block.title} className="h-full min-h-105 w-full object-cover" />
          ) : (
            <div className="flex min-h-105 items-center justify-center bg-gray-100 text-sm text-gray-500">
              Image unavailable
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-2">
          {block.overTitle && (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">{block.overTitle}</p>
          )}
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">{block.title}</h3>
          <p className="mt-4 text-sm leading-7 text-gray-600">{block.description}</p>
          <div className="mt-8">
            <h4 className="text-xl font-semibold text-gray-900">{block.formTitle}</h4>
            {block.formDescription && (
              <p className="mt-1 text-sm text-gray-500">{block.formDescription}</p>
            )}
            <div className="mt-4">
              <LeadInquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const blockComponents: Record<string, React.FC<{ block: any }>> = {
  hero: HeroBlock,
  inventoryGrid: InventoryGridBlock,
  content: ContentBlock,
  coworkHero: CoworkHeroBlock,
  pricingCards: PricingCardsBlock,
  splitLeadSection: SplitLeadSectionBlock,
  homeHero: HomeHeroSection,
  statsSection: StatsSectionBlock,
  finalCTA: FinalCTASection,
}

export async function RenderBlocks({ layout }: { layout: Page['layout'] }) {
  if (!layout || layout.length === 0) return null

  let featuredUnits: Unit[] = []
  let latestPosts: Post[] = []
  const hasFeaturedSpaces = layout.some((block) => block.blockType === 'featuredSpaces')
  const hasServicesGrid = layout.some((block) => block.blockType === 'servicesGrid')
  const hasHomeHero = layout.some((block) => block.blockType === 'homeHero')

  if (hasFeaturedSpaces || hasServicesGrid) {
    const payload = await getPayload({ config })
    if (hasFeaturedSpaces) {
      const result = await payload.find({
        collection: 'units',
        limit: 4,
        sort: '-createdAt',
        depth: 1,
        where: {
          status: {
            equals: 'available',
          },
        },
      })
      featuredUnits = result.docs as Unit[]
    }

    if (hasServicesGrid) {
      const postsResult = await payload.find({
        collection: 'posts',
        limit: 3,
        sort: '-publishedAt',
        depth: 1,
      })
      latestPosts = postsResult.docs as Post[]
    }
  }

  const orderedLayout =
    hasHomeHero && hasFeaturedSpaces && hasServicesGrid
      ? [...layout].sort((a, b) => {
          const rank: Record<string, number> = {
            homeHero: 1,
            featuredSpaces: 2,
            statsSection: 3,
            servicesGrid: 4,
          }
          return (rank[a.blockType] ?? 100) - (rank[b.blockType] ?? 100)
        })
      : layout

  return (
    <>
      {orderedLayout.map((block, index) => {
        if (block.blockType === 'featuredSpaces') {
          return (
            <FeaturedSpacesSection
              key={block.id ?? index}
              block={block as Extract<LayoutBlock, { blockType: 'featuredSpaces' }>}
              units={featuredUnits}
            />
          )
        }
        if (block.blockType === 'servicesGrid') {
          return (
            <ServicesGridSection
              key={block.id ?? index}
              block={block as Extract<LayoutBlock, { blockType: 'servicesGrid' }>}
              posts={latestPosts}
            />
          )
        }
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={block.id ?? index} block={block} />
      })}
    </>
  )
}
