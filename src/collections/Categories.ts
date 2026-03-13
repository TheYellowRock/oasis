import type { CollectionConfig } from 'payload'

function normalizeCategorySlug(input: string) {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (normalized === 'storage') return 'self-storage'
  return normalized
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        const baseSlug =
          typeof data.slug === 'string' && data.slug.trim().length > 0
            ? data.slug
            : typeof data.name === 'string'
              ? data.name
              : undefined

        if (baseSlug) {
          data.slug = normalizeCategorySlug(baseSlug)
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'heroTitle',
      type: 'text',
      admin: {
        description: 'Landing hero title for /spaces/[category].',
      },
    },
    {
      name: 'heroDescription',
      type: 'textarea',
      admin: {
        description: 'Landing hero description for /spaces/[category].',
      },
    },
    {
      name: 'heroBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional custom background image for category landing hero.',
      },
    },
    {
      name: 'marketingContent',
      type: 'group',
      admin: {
        description: 'SEO and campaign content for dedicated /spaces/[category] pages.',
      },
      fields: [
        {
          name: 'heroTitle',
          type: 'text',
        },
        {
          name: 'heroSubheadline',
          type: 'textarea',
        },
        {
          name: 'quickSpecs',
          type: 'array',
          minRows: 4,
          maxRows: 4,
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Building 2', value: 'building-2' },
                { label: 'Package', value: 'package' },
                { label: 'Shopping Bag', value: 'shopping-bag' },
                { label: 'Wifi', value: 'wifi' },
                { label: 'Shield', value: 'shield' },
                { label: 'Users', value: 'users' },
                { label: 'Truck', value: 'truck' },
                { label: 'Zap', value: 'zap' },
                { label: 'Store', value: 'store' },
                { label: 'Map Pin', value: 'map-pin' },
                { label: 'Tag', value: 'tag' },
                { label: 'Lock', value: 'lock' },
                { label: 'Camera', value: 'camera' },
                { label: 'Star', value: 'star' },
                { label: 'Check', value: 'check' },
              ],
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'subtitle',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
