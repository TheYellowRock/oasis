import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { UnitEditorClient } from '@/components/dashboard/UnitEditorClient'

type Props = {
  params: Promise<{ id: string }>
}

export default async function UnitEditPage({ params }: Props) {
  const { id } = await params
  const parsedId = Number(id)

  if (!Number.isFinite(parsedId)) return notFound()

  const payload = await getPayload({ config })
  const [unit, categories] = await Promise.all([
    payload.findByID({ collection: 'units', id: parsedId, depth: 1 }),
    payload.find({ collection: 'categories', limit: 100, sort: 'name' }),
  ])

  if (!unit) return notFound()

  return (
    <UnitEditorClient
      unit={JSON.parse(JSON.stringify(unit))}
      categories={JSON.parse(JSON.stringify(categories.docs))}
    />
  )
}
