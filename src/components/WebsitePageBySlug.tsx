import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/components/RenderBlocks'

type Props = {
  slug: string
  fallbackTitle: string
  fallbackDescription: string
}

export async function WebsitePageBySlug({ slug, fallbackTitle, fallbackDescription }: Props) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const page = result.docs[0]

  if (page?.layout?.length) {
    return <RenderBlocks layout={page.layout} />
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-gray-900">{fallbackTitle}</h1>
      <p className="mt-4 text-gray-600">{fallbackDescription}</p>
    </section>
  )
}
