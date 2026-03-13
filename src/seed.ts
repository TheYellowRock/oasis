import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

const CATEGORY_NAMES = [
  'Retail',
  'Office',
  'Warehouse',
  'Restaurant',
  'Coworking',
  'Self Storage',
  'Residential',
] as const

const QUICK_SPEC_ICONS = [
  'users',
  'building-2',
  'package',
  'shopping-bag',
  'wifi',
  'shield',
  'truck',
  'zap',
  'store',
  'map-pin',
  'tag',
  'lock',
  'camera',
  'star',
  'check',
] as const

type QuickSpecIcon = (typeof QUICK_SPEC_ICONS)[number]

const CATEGORY_CONTENT: Record<
  (typeof CATEGORY_NAMES)[number],
  {
    description: string
    heroTitle: string
    heroDescription: string
    marketingContent: {
      heroTitle: string
      heroSubheadline: string
      quickSpecs: Array<{ icon: QuickSpecIcon; title: string; subtitle: string }>
    }
  }
> = {
  Retail: {
    description: 'Street-facing retail suites in a high-traffic commercial district.',
    heroTitle: 'Premium Retail Spaces',
    heroDescription: 'Launch or expand your retail concept with high-visibility storefronts in Las Vegas.',
    marketingContent: {
      heroTitle: 'Retail Space Built for Visibility',
      heroSubheadline:
        "Capture attention with premium storefront opportunities in one of Las Vegas's active commercial corridors.",
      quickSpecs: [
        { icon: 'users', title: 'High Foot Traffic', subtitle: 'Consistent exposure to daily visitors.' },
        { icon: 'map-pin', title: 'Street Visibility', subtitle: 'Positioned for discovery and repeat visits.' },
        { icon: 'star', title: 'Signage Rights', subtitle: 'Prominent branding opportunities available.' },
        { icon: 'shopping-bag', title: 'Modern Storefronts', subtitle: 'Contemporary spaces ready for merchandising.' },
      ],
    },
  },
  Office: {
    description: 'Flexible office suites for growing teams and established brands.',
    heroTitle: 'Premium Office Spaces',
    heroDescription: 'Discover modern office spaces designed for productivity and business growth.',
    marketingContent: {
      heroTitle: 'Professional Office Space for Lease',
      heroSubheadline: 'Flexible office suites built for productivity, client confidence, and long-term growth in Las Vegas.',
      quickSpecs: [
        { icon: 'building-2', title: 'Private Suites', subtitle: 'Move-in ready layouts for teams of all sizes.' },
        { icon: 'wifi', title: 'Fiber Internet', subtitle: 'High-speed connectivity for modern operations.' },
        { icon: 'shield', title: 'Secure Access', subtitle: 'Controlled entry for staff and clients.' },
        { icon: 'users', title: 'Meeting Rooms', subtitle: 'Professional shared spaces for collaboration.' },
      ],
    },
  },
  Warehouse: {
    description: 'Large-format warehouse and logistics spaces with convenient access.',
    heroTitle: 'Premium Warehouse Spaces',
    heroDescription: 'Scale operations with efficient warehouse inventory near major Las Vegas corridors.',
    marketingContent: {
      heroTitle: 'Industrial Warehouse Space That Scales',
      heroSubheadline:
        'Optimize logistics and fulfillment with high-capacity warehouse inventory in a strategic Las Vegas location.',
      quickSpecs: [
        { icon: 'package', title: 'High Ceilings', subtitle: 'Vertical capacity for efficient storage design.' },
        { icon: 'truck', title: 'Loading Docks', subtitle: 'Smooth inbound and outbound operations.' },
        { icon: 'zap', title: '3-Phase Power', subtitle: 'Infrastructure for heavy equipment and machinery.' },
        { icon: 'shield', title: '24/7 Security', subtitle: 'Monitored access for peace of mind.' },
      ],
    },
  },
  Restaurant: {
    description: 'Restaurant-ready spaces ideal for food and beverage operators.',
    heroTitle: 'Restaurant Opportunities',
    heroDescription: 'Open your next food concept in a destination built for hospitality and foot traffic.',
    marketingContent: {
      heroTitle: 'Restaurant Space Ready for Service',
      heroSubheadline: 'Build a standout dining experience in high-traffic locations made for hospitality brands.',
      quickSpecs: [
        { icon: 'users', title: 'Strong Footfall', subtitle: 'Consistent local and visitor demand.' },
        { icon: 'map-pin', title: 'Prime Positioning', subtitle: 'Located near active destination corridors.' },
        { icon: 'check', title: 'Flexible Buildout', subtitle: 'Configurations for varied service models.' },
        { icon: 'star', title: 'Brand Visibility', subtitle: 'Signage and frontage opportunities available.' },
      ],
    },
  },
  Coworking: {
    description: 'Collaborative workspace inventory for modern hybrid teams.',
    heroTitle: 'Coworking Inventory',
    heroDescription: 'Work in flexible, amenity-rich coworking environments built for creators and founders.',
    marketingContent: {
      heroTitle: 'Coworking Spaces for Modern Teams',
      heroSubheadline: 'Join a flexible, amenity-rich environment built for creators, startups, and scaling companies.',
      quickSpecs: [
        { icon: 'wifi', title: 'Fast Connectivity', subtitle: 'Business-grade internet for daily workflows.' },
        { icon: 'users', title: 'Community Access', subtitle: 'Networking and collaboration opportunities.' },
        { icon: 'building-2', title: 'Private Offices', subtitle: 'Dedicated rooms alongside open desks.' },
        { icon: 'shield', title: 'Secure Entry', subtitle: 'Controlled access across shared facilities.' },
      ],
    },
  },
  'Self Storage': {
    description: 'Secure self-storage units for personal and business needs.',
    heroTitle: 'Self Storage Inventory',
    heroDescription: 'Choose secure, accessible self-storage options in the heart of Las Vegas.',
    marketingContent: {
      heroTitle: 'Secure Self Storage With Flexible Access',
      heroSubheadline: 'Protect inventory, equipment, and personal items with clean, secure storage solutions in Las Vegas.',
      quickSpecs: [
        { icon: 'lock', title: 'Secure Units', subtitle: 'Controlled and monitored storage environment.' },
        { icon: 'check', title: 'Flexible Terms', subtitle: 'Lease options to match your timeline.' },
        { icon: 'truck', title: 'Easy Loading', subtitle: 'Convenient access for vehicles and moving teams.' },
        { icon: 'shield', title: 'Safe Facility', subtitle: 'Designed for reliability and peace of mind.' },
      ],
    },
  },
  Residential: {
    description: 'Live-work residential options connected to the district.',
    heroTitle: 'Residential Inventory',
    heroDescription: 'Find practical residential options near work, retail, and community amenities.',
    marketingContent: {
      heroTitle: 'Residential Options Near the District',
      heroSubheadline: 'Explore practical residential inventory with convenient access to work, retail, and daily essentials.',
      quickSpecs: [
        { icon: 'map-pin', title: 'Central Location', subtitle: 'Connected to the district and key corridors.' },
        { icon: 'shield', title: 'Secure Access', subtitle: 'Designed for resident safety and comfort.' },
        { icon: 'check', title: 'Flexible Layouts', subtitle: 'Options for different lifestyle needs.' },
        { icon: 'star', title: 'Modern Interiors', subtitle: 'Clean, updated spaces built for daily living.' },
      ],
    },
  },
}

type UnitSeed = {
  unitNumber: string
  type: (typeof CATEGORY_NAMES)[number]
  status: 'available' | 'under-offer' | 'leased'
  leaseType: 'nnn' | 'full-service' | 'modified-gross'
  building: 'building-a' | 'building-b' | 'annex'
  sqFt: number
  monthlyRent: number
}

type PostSeed = {
  title: string
  slug: string
  excerpt: string
  categoryTag: 'news' | 'leasing' | 'community' | 'insights'
  publishedAt: string
}

const UNIT_SEEDS: UnitSeed[] = [
  { unitNumber: 'A-101', type: 'Retail', status: 'available', leaseType: 'nnn', building: 'building-a', sqFt: 1200, monthlyRent: 3200 },
  { unitNumber: 'B-204', type: 'Retail', status: 'leased', leaseType: 'full-service', building: 'building-b', sqFt: 2400, monthlyRent: 6800 },
  { unitNumber: 'A-301', type: 'Office', status: 'available', leaseType: 'full-service', building: 'building-a', sqFt: 3500, monthlyRent: 9800 },
  { unitNumber: 'B-110', type: 'Office', status: 'under-offer', leaseType: 'modified-gross', building: 'building-b', sqFt: 8000, monthlyRent: 19500 },
  { unitNumber: 'WH-01', type: 'Warehouse', status: 'available', leaseType: 'nnn', building: 'annex', sqFt: 45000, monthlyRent: 90000 },
  { unitNumber: 'WH-02', type: 'Warehouse', status: 'leased', leaseType: 'modified-gross', building: 'building-b', sqFt: 22000, monthlyRent: 41000 },
  { unitNumber: 'R-12', type: 'Restaurant', status: 'available', leaseType: 'nnn', building: 'building-a', sqFt: 1800, monthlyRent: 7000 },
  { unitNumber: 'R-20', type: 'Restaurant', status: 'leased', leaseType: 'full-service', building: 'annex', sqFt: 3200, monthlyRent: 12400 },
  { unitNumber: 'CW-01', type: 'Coworking', status: 'available', leaseType: 'full-service', building: 'building-a', sqFt: 9500, monthlyRent: 27000 },
  { unitNumber: 'CW-02', type: 'Coworking', status: 'under-offer', leaseType: 'modified-gross', building: 'building-b', sqFt: 14000, monthlyRent: 36000 },
  { unitNumber: 'ST-01', type: 'Self Storage', status: 'available', leaseType: 'nnn', building: 'annex', sqFt: 500, monthlyRent: 1000 },
  { unitNumber: 'ST-07', type: 'Self Storage', status: 'leased', leaseType: 'nnn', building: 'building-b', sqFt: 1200, monthlyRent: 2600 },
  { unitNumber: 'RS-3A', type: 'Residential', status: 'available', leaseType: 'full-service', building: 'building-a', sqFt: 900, monthlyRent: 2100 },
  { unitNumber: 'RS-8C', type: 'Residential', status: 'leased', leaseType: 'modified-gross', building: 'building-b', sqFt: 1500, monthlyRent: 3300 },
  { unitNumber: 'ANN-5', type: 'Office', status: 'available', leaseType: 'nnn', building: 'annex', sqFt: 6000, monthlyRent: 14500 },
]

const POST_SEEDS: PostSeed[] = [
  {
    title: 'New Leasing Opportunities at Oasis District',
    slug: 'new-leasing-opportunities',
    excerpt: 'Explore fresh inventory and recently updated units now available across the district.',
    categoryTag: 'leasing',
    publishedAt: new Date('2026-03-01').toISOString(),
  },
  {
    title: 'District News: Expanding Retail and Food Concepts',
    slug: 'district-news-retail-food',
    excerpt: 'Learn how Oasis District is evolving with curated retail experiences and new dining concepts.',
    categoryTag: 'news',
    publishedAt: new Date('2026-02-20').toISOString(),
  },
  {
    title: 'How Smart Space Planning Supports Business Growth',
    slug: 'smart-space-planning-growth',
    excerpt: 'Practical insights for choosing flexible commercial space that scales with your operations.',
    categoryTag: 'insights',
    publishedAt: new Date('2026-02-10').toISOString(),
  },
]

async function deleteAllByCollection(collection: 'units' | 'categories' | 'posts') {
  const payload = await getPayload({ config })
  const docs = await payload.find({
    collection,
    limit: 1000,
    depth: 0,
    pagination: false,
  })

  for (const doc of docs.docs) {
    await payload.delete({
      collection,
      id: doc.id,
    })
  }
}

async function run() {
  const payload = await getPayload({ config })

  console.log('Seeding: wiping units...')
  await deleteAllByCollection('units')

  console.log('Seeding: wiping categories...')
  await deleteAllByCollection('categories')

  console.log('Seeding: wiping posts...')
  await deleteAllByCollection('posts')

  console.log('Seeding: creating categories...')
  const categoryByName = new Map<string, number>()

  for (const name of CATEGORY_NAMES) {
    const content = CATEGORY_CONTENT[name]
    const category = await payload.create({
      collection: 'categories',
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: content.description,
        heroTitle: content.heroTitle,
        heroDescription: content.heroDescription,
        marketingContent: content.marketingContent,
      },
    })
    categoryByName.set(name, Number(category.id))
  }

  console.log('Seeding: creating units...')
  for (const unit of UNIT_SEEDS) {
    const categoryId = categoryByName.get(unit.type)
    if (!categoryId) {
      throw new Error(`Missing category id for "${unit.type}"`)
    }

    await payload.create({
      collection: 'units',
      data: {
        unitNumber: unit.unitNumber,
        type: categoryId,
        status: unit.status,
        leaseType: unit.leaseType,
        building: unit.building,
        sqFt: unit.sqFt,
        price: {
          amount: unit.monthlyRent,
        },
      },
    })
  }

  console.log('Seeding: creating posts...')
  for (const post of POST_SEEDS) {
    await payload.create({
      collection: 'posts',
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        categoryTag: post.categoryTag,
        publishedAt: post.publishedAt,
      },
    })
  }

  console.log(`Seed complete: ${CATEGORY_NAMES.length} categories, ${UNIT_SEEDS.length} units, ${POST_SEEDS.length} posts.`)
}

void run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
