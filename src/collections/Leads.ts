import type { CollectionConfig } from 'payload'

function detectInterestFromMetadata(metadata?: string): string | undefined {
  if (!metadata) return undefined
  const text = metadata.toLowerCase()

  if (text.includes('self storage') || text.includes('self-storage') || text.includes('storage')) return 'self-storage'
  if (text.includes('warehouse') || text.includes('industrial')) return 'warehouse'
  if (text.includes('office')) return 'office'
  if (text.includes('retail') || text.includes('storefront') || text.includes('shop')) return 'retail'
  if (text.includes('cowork') || text.includes('co-work')) return 'coworking'
  if (text.includes('restaurant') || text.includes('food')) return 'restaurant'
  if (text.includes('residential')) return 'residential'

  return undefined
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'interest', 'sourceMetadata', 'createdAt'],
    listSearchableFields: ['fullName', 'email'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (!data.interest) {
          const inferredInterest = detectInterestFromMetadata(
            typeof data.sourceMetadata === 'string' ? data.sourceMetadata : undefined,
          )
          if (inferredInterest) {
            data.interest = inferredInterest
          }
        }

        return data
      },
    ],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'quickSummary',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/leads/QuickSummaryBanner',
        },
      },
    },
    {
      name: 'contactInfoHeader',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/leads/ContactInfoHeader',
        },
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        components: {
          Cell: '/components/admin/leads/LeadDetailsCell',
        },
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'squareFootageNeeded',
      type: 'number',
      admin: {
        description: 'Requested square footage from lead magnet step 2.',
      },
    },
    {
      name: 'desiredMoveInDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'businessType',
      type: 'text',
    },
    {
      name: 'budgetRange',
      type: 'text',
    },
    {
      name: 'desiredLeaseTerm',
      type: 'text',
    },
    {
      name: 'decisionTimeline',
      type: 'text',
    },
    {
      name: 'inquiryDetailsHeader',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/leads/InquiryDetailsHeader',
        },
      },
    },
    {
      name: 'interest',
      type: 'select',
      options: [
        { label: 'Office', value: 'office' },
        { label: 'Warehouse', value: 'warehouse' },
        { label: 'Retail', value: 'retail' },
        { label: 'Self Storage', value: 'self-storage' },
        { label: 'Coworking', value: 'coworking' },
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Residential', value: 'residential' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'sourcePage',
      type: 'text',
    },
    {
      name: 'sourceMetadata',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Highlighted inquiry context (e.g., unit inquiry subject line).',
      },
    },
    {
      name: 'formType',
      type: 'select',
      options: [
        { label: 'Contact Form', value: 'contact-form' },
        { label: 'Book a Tour', value: 'book-a-tour' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
