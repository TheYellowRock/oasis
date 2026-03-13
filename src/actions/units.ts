'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function getUnits() {
  const payload = await getPayload({ config })
  return payload.find({ collection: 'units', limit: 100, sort: '-createdAt', depth: 1 })
}

export async function getUnitById(id: number) {
  const payload = await getPayload({ config })
  return payload.findByID({ collection: 'units', id, depth: 1 })
}

function parseSelectedMediaIds(formData: FormData) {
  const raw = (formData.get('mediaIds') as string | null) ?? ''
  if (!raw.trim()) return []

  return raw
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0)
}

async function uploadFilesToMedia(formData: FormData) {
  const payload = await getPayload({ config })
  const files = formData.getAll('mediaFiles').filter((entry): entry is File => entry instanceof File && entry.size > 0)

  const createdIds: number[] = []

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const created = await payload.create({
      collection: 'media',
      data: { alt: file.name.replace(/\.[^.]+$/, '') },
      file: {
        data: Buffer.from(arrayBuffer),
        name: file.name,
        mimetype: file.type || 'application/octet-stream',
        size: file.size,
      },
    })
    createdIds.push(created.id)
  }

  return createdIds
}

export async function uploadMediaAndLink(formData: FormData) {
  const payload = await getPayload({ config })
  const file = formData.get('file')

  if (!(file instanceof File) || file.size === 0) {
    throw new Error('No file provided.')
  }

  const alt = ((formData.get('alt') as string | null) ?? file.name.replace(/\.[^.]+$/, '')).trim()
  const arrayBuffer = await file.arrayBuffer()

  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: Buffer.from(arrayBuffer),
      name: file.name,
      mimetype: file.type || 'application/octet-stream',
      size: file.size,
    },
  })

  revalidatePath('/dashboard/media')
  return { id: media.id, url: media.url, alt: media.alt }
}

export async function createUnit(formData: FormData) {
  const payload = await getPayload({ config })
  const uploadedMediaIds = await uploadFilesToMedia(formData)
  const selectedMediaIds = parseSelectedMediaIds(formData)
  const media = [...new Set([...selectedMediaIds, ...uploadedMediaIds])]

  const data: Record<string, unknown> = {
    unitNumber: formData.get('unitNumber') as string,
    type: formData.get('type') ? Number(formData.get('type')) : undefined,
    status: formData.get('status') as string,
    leaseType: formData.get('leaseType') as string,
    building: formData.get('building') as string,
    sqFt: formData.get('sqFt') ? Number(formData.get('sqFt')) : undefined,
    price: {
      amount: formData.get('priceAmount') ? Number(formData.get('priceAmount')) : undefined,
    },
    media: media.length ? media : undefined,
  }

  await payload.create({ collection: 'units', data: data as any })
  revalidatePath('/dashboard/units')
}

export async function updateUnit(id: number, formData: FormData) {
  const payload = await getPayload({ config })
  const uploadedMediaIds = await uploadFilesToMedia(formData)
  const selectedMediaIds = parseSelectedMediaIds(formData)
  const media = [...new Set([...selectedMediaIds, ...uploadedMediaIds])]

  const data: Record<string, unknown> = {
    unitNumber: formData.get('unitNumber') as string,
    type: formData.get('type') ? Number(formData.get('type')) : undefined,
    status: formData.get('status') as string,
    leaseType: formData.get('leaseType') as string,
    building: formData.get('building') as string,
    sqFt: formData.get('sqFt') ? Number(formData.get('sqFt')) : undefined,
    price: {
      amount: formData.get('priceAmount') ? Number(formData.get('priceAmount')) : undefined,
    },
    media,
  }

  await payload.update({ collection: 'units', id, data: data as any })
  revalidatePath('/dashboard/units')
  revalidatePath(`/dashboard/units/${id}`)
}

export async function deleteUnit(id: number) {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'units', id })
  revalidatePath('/dashboard/units')
  revalidatePath(`/dashboard/units/${id}`)
}
