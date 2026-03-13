import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page } from '@/payload-types'

async function run() {
  const payload = await getPayload({ config })

  const layout: NonNullable<Page['layout']> = [
    {
      blockType: 'homeHero',
      announcementText: 'Now Leasing',
      title: 'Where Vision Meets Oasis',
      subtitle:
        'Discover a modern mixed-use district designed for ambitious businesses, creators, and community-first brands.',
      primaryButtonLabel: 'VIEW AVAILABLE SPACES',
      primaryButtonHref: '/leasing',
      secondaryButtonLabel: 'OUR STORY',
      secondaryButtonHref: '/home',
    },
    {
      blockType: 'servicesGrid',
      title: 'Everything You Need, All in One Place',
      description:
        'From flexible warehouse operations to vibrant lifestyle destinations, Oasis District is built to support every stage of growth.',
      items: [
        { title: 'Industrial & Flex Space', href: '/district/warehouse' },
        { title: 'Professional Workspace', href: '/district/cowork-lounge' },
        { title: 'Self Storage Units', href: '/district/self-storage' },
        { title: 'Shop & Dine', href: '/district/food-drink' },
      ],
    },
    {
      blockType: 'featuredSpaces',
      title: 'Featured Spaces',
      viewAllText: 'View All Spaces',
      viewAllHref: '/leasing',
      bottomButtonLabel: 'VIEW ALL AVAILABLE SPACES',
      bottomButtonHref: '/leasing',
    },
    {
      blockType: 'statsSection',
      estBadge: 'Est. 2024',
      title: 'A New Standard for Mixed-Use Living',
      description:
        'Oasis District combines premium design, strategic location, and secure access to create an unmatched commercial experience.',
      stats: [
        { value: '500k+ SQ FT' },
        { value: '65+ TENANTS' },
        { value: '24/7 ACCESS' },
        { value: '100% SECURE' },
      ],
    },
    {
      blockType: 'finalCTA',
      title: 'Find Your Perfect Space at Oasis District',
      primaryButtonLabel: 'VIEW AVAILABLE SPACES',
      primaryButtonHref: '/leasing',
      secondaryButtonLabel: 'CONTACT SALES',
      secondaryButtonHref: '/contact',
    },
  ]

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: {
        title: 'Home',
        slug: 'home',
        layout,
      },
    })
    console.log('Updated /home page')
    return
  }

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      layout,
    },
  })
  console.log('Created /home page')
}

void run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
