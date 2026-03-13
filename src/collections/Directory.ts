import type { CollectionConfig } from 'payload'

export const Directory: CollectionConfig = {
  slug: 'directory',
  admin: {
    useAsTitle: 'shopName',
    defaultColumns: ['shopName', 'unit', 'category'],
  },
  fields: [
    {
      name: 'shopName',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'unit',
      type: 'relationship',
      relationTo: 'units',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
  ],
}
