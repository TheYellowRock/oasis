'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function getPages() {
  const payload = await getPayload({ config })
  return payload.find({
    collection: 'pages',
    limit: 100,
    sort: '-updatedAt',
    draft: true,
  })
}

export async function getPageById(id: number) {
  const payload = await getPayload({ config })
  return payload.findByID({ collection: 'pages', id, depth: 2, draft: true })
}

export async function saveDraft(id: number, layout: Record<string, unknown>[]) {
  const payload = await getPayload({ config })
  await payload.update({
    collection: 'pages',
    id,
    data: { layout },
    draft: true,
  })
  revalidatePath('/dashboard/content')
}

export async function publishPage(id: number) {
  const payload = await getPayload({ config })
  const page = await payload.findByID({ collection: 'pages', id, draft: true })

  await payload.update({
    collection: 'pages',
    id,
    data: {
      title: page.title,
      slug: page.slug,
      layout: page.layout as unknown as Record<string, unknown>[],
    },
    draft: false,
  })

  revalidatePath('/dashboard/content')
  if (page.slug) revalidatePath(`/${page.slug}`)
}
