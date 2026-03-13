import { getPayload } from 'payload'
import config from '@payload-config'
import { MediaClient } from '@/components/dashboard/MediaClient'

export default async function MediaPage() {
  const payload = await getPayload({ config })
  const media = await payload.find({ collection: 'media', limit: 100, sort: '-createdAt' })

  return <MediaClient initialMedia={JSON.parse(JSON.stringify(media.docs))} />
}
