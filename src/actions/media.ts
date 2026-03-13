'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function getMediaItems() {
  const payload = await getPayload({ config })
  return payload.find({ collection: 'media', limit: 100, sort: '-createdAt' })
}

export async function uploadMedia(formData: FormData) {
  const payload = await getPayload({ config })
  const file = formData.get('file') as File
  const alt = (formData.get('alt') as string) || file.name.replace(/\.[^.]+$/, '')

  const arrayBuffer = await file.arrayBuffer()

  await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: Buffer.from(arrayBuffer),
      name: file.name,
      mimetype: file.type,
      size: file.size,
    },
  })
  revalidatePath('/dashboard/media')
}

export async function deleteMedia(id: number) {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'media', id })
  revalidatePath('/dashboard/media')
}
