import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page } from '@/payload-types'

async function upsertCoworkLoungePage() {
  const payload = await getPayload({ config })

  const media = await payload.find({
    collection: 'media',
    limit: 2,
    sort: '-createdAt',
    depth: 0,
  })

  const heroImageId = media.docs[0]?.id
  const splitImageId = media.docs[1]?.id ?? media.docs[0]?.id

  const layout: NonNullable<Page['layout']> = [
    {
      blockType: 'coworkHero' as const,
      overTitle: 'Oasis District',
      title: 'Cowork Lounge',
      description:
        'A premium workspace built for teams, founders, and creators who need flexibility, design, and community in one destination.',
      backgroundImage: heroImageId,
      amenities: [
        { icon: 'wifi', label: 'High-Speed Wi-Fi' },
        { icon: 'coffee', label: 'Coffee & Refreshments' },
        { icon: 'users', label: 'Community Events' },
        { icon: 'clock', label: '24/7 Member Access' },
      ],
    },
    {
      blockType: 'pricingCards' as const,
      overTitle: 'Memberships',
      title: 'Choose the Plan That Fits Your Workflow',
      plans: [
        {
          name: 'Day Pass',
          price: 39,
          frequency: '/day',
          features: [
            { feature: 'Open lounge seating' },
            { feature: 'High-speed internet' },
            { feature: 'Coffee bar access' },
          ],
          isFeatured: false,
        },
        {
          name: 'Dedicated Desk',
          price: 499,
          frequency: '/month',
          features: [
            { feature: 'Reserved desk' },
            { feature: 'Mail handling' },
            { feature: 'Conference room credits' },
            { feature: 'Community event access' },
          ],
          isFeatured: true,
        },
        {
          name: 'Private Studio',
          price: 1299,
          frequency: '/month',
          features: [
            { feature: 'Lockable private suite' },
            { feature: '24/7 secure access' },
            { feature: 'Dedicated business address' },
            { feature: 'Team guest passes' },
          ],
          isFeatured: false,
        },
      ],
    },
    {
      blockType: 'splitLeadSection' as const,
      image: splitImageId,
      overTitle: 'Request Information',
      title: 'Tour the Cowork Lounge',
      description:
        'Our team will walk you through workspace options, membership tiers, and custom solutions for your business.',
      formTitle: 'Request Information',
      formDescription: 'Share your needs and we will contact you within one business day.',
    },
  ]

  const existing = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'cowork-lounge',
      },
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: {
        title: 'Cowork Lounge',
        slug: 'cowork-lounge',
        layout,
      },
    })
    console.log('Updated existing /cowork-lounge page')
    return
  }

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Cowork Lounge',
      slug: 'cowork-lounge',
      layout,
    },
  })
  console.log('Created /cowork-lounge page')
}

void upsertCoworkLoungePage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
