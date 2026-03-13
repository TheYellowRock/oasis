import { getPayload } from 'payload'
import config from '@payload-config'
import { UnitsClient } from '@/components/dashboard/UnitsClient'

export default async function UnitsPage() {
  const payload = await getPayload({ config })

  const [units, categories] = await Promise.all([
    payload.find({ collection: 'units', limit: 100, sort: '-createdAt', depth: 1 }),
    payload.find({ collection: 'categories', limit: 100, sort: 'name' }),
  ])

  return (
    <UnitsClient
      initialUnits={JSON.parse(JSON.stringify(units.docs))}
      categories={JSON.parse(JSON.stringify(categories.docs))}
    />
  )
}
