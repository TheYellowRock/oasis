import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { RenderBlocks } from '@/components/RenderBlocks'

const districtPlaceholders: Record<string, { title: string; description: string }> = {
  'self-storage': {
    title: 'Self Storage',
    description: 'Sample page mapped for district navigation.',
  },
  'food-drink': {
    title: 'Food & Drink',
    description: 'Sample page mapped for district navigation.',
  },
  shops: {
    title: 'Shops',
    description: 'Sample page mapped for district navigation.',
  },
  warehouse: {
    title: 'Warehouse',
    description: 'Sample page mapped for district navigation.',
  },
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function DistrictPage({ params }: Props) {
  const { slug } = await params

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const page = result.docs[0]
  if (page?.layout?.length) {
    return (
      <article>
        <RenderBlocks layout={page.layout} />
      </article>
    )
  }

  const placeholder = districtPlaceholders[slug]
  if (!placeholder) return notFound()

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">The District</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900">{placeholder.title}</h1>
      <p className="mt-4 text-gray-600">{placeholder.description}</p>
    </section>
  )
}
