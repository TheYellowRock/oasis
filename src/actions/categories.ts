'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
  const payload = await getPayload({ config })
  return payload.find({ collection: 'categories', limit: 100, sort: 'name' })
}

export async function createCategory(formData: FormData) {
  const payload = await getPayload({ config })
  const name = formData.get('name') as string

  await payload.create({
    collection: 'categories',
    data: {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: (formData.get('description') as string) || undefined,
    },
  })
  revalidatePath('/dashboard/categories')
}

export async function updateCategory(id: number, formData: FormData) {
  const payload = await getPayload({ config })
  const name = formData.get('name') as string

  await payload.update({
    collection: 'categories',
    id,
    data: {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: (formData.get('description') as string) || undefined,
    },
  })
  revalidatePath('/dashboard/categories')
}

export async function deleteCategory(id: number) {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'categories', id })
  revalidatePath('/dashboard/categories')
}
