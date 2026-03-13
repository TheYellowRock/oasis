import { notFound } from 'next/navigation'
import { WebsitePageBySlug } from '@/components/WebsitePageBySlug'

const explorePlaceholders: Record<string, { title: string; description: string }> = {
  'cowork-lounge': {
    title: 'Cowork Lounge',
    description: "Sample Explore page. Add a page entry with slug 'cowork-lounge' to fully customize this route.",
  },
  'food-and-drink': {
    title: 'Food & Drink',
    description: "Sample Explore page. Add a page entry with slug 'food-and-drink' to fully customize this route.",
  },
  shops: {
    title: 'Shops',
    description: "Sample Explore page. Add a page entry with slug 'shops' to fully customize this route.",
  },
  'warehouse-info': {
    title: 'Warehouse Info',
    description: "Sample Explore page. Add a page entry with slug 'warehouse-info' to fully customize this route.",
  },
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ExplorePage({ params }: Props) {
  const { slug } = await params
  const placeholder = explorePlaceholders[slug]

  if (!placeholder) {
    notFound()
  }

  return (
    <WebsitePageBySlug
      slug={slug}
      fallbackTitle={placeholder.title}
      fallbackDescription={placeholder.description}
    />
  )
}
