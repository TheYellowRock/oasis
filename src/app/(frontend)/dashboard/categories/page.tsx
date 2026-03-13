import { getPayload } from 'payload'
import config from '@payload-config'
import { CategoriesClient } from '@/components/dashboard/CategoriesClient'

export default async function CategoriesPage() {
  const payload = await getPayload({ config })
  const categories = await payload.find({ collection: 'categories', limit: 100, sort: 'name' })

  return <CategoriesClient initialCategories={JSON.parse(JSON.stringify(categories.docs))} />
}
