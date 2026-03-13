import { getPayload } from 'payload'
import config from '@payload-config'
import { ContentClient } from '@/components/dashboard/ContentClient'

export default async function ContentPage() {
  const payload = await getPayload({ config })

  const [pages, categories, media] = await Promise.all([
    payload.find({ collection: 'pages', limit: 100, sort: '-updatedAt', draft: true, depth: 2 }),
    payload.find({ collection: 'categories', limit: 100, sort: 'name' }),
    payload.find({ collection: 'media', limit: 100, sort: '-createdAt' }),
  ])

  return (
    <ContentClient
      initialPages={JSON.parse(JSON.stringify(pages.docs))}
      categories={JSON.parse(JSON.stringify(categories.docs))}
      mediaItems={JSON.parse(JSON.stringify(media.docs))}
    />
  )
}
