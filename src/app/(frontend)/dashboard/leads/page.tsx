import { getPayload } from 'payload'
import config from '@payload-config'
import type { Lead } from '@/payload-types'
import { LeadsClient } from '@/components/dashboard/LeadsClient'

export default async function LeadsDashboardPage() {
  const payload = await getPayload({ config })
  const leadsResult = await payload.find({
    collection: 'leads',
    limit: 200,
    sort: '-createdAt',
  })

  const leads = leadsResult.docs as Lead[]

  return <LeadsClient initialLeads={JSON.parse(JSON.stringify(leads))} />
}
