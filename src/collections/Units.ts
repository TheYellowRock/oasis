import type { CollectionConfig } from 'payload'

export const Units: CollectionConfig = {
  slug: 'units',
  admin: {
    useAsTitle: 'unitNumber',
    defaultColumns: ['unitNumber', 'type', 'status', 'sqFt'],
  },
  fields: [
    {
      name: 'unitNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Retail', value: 'retail' },
        { label: 'Office', value: 'office' },
        { label: 'Warehouse', value: 'warehouse' },
        { label: 'Coworking', value: 'coworking' },
        { label: 'Storage', value: 'storage' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'available',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Under Offer', value: 'under-offer' },
        { label: 'Leased', value: 'leased' },
        { label: 'Maintenance', value: 'maintenance' },
      ],
    },
    {
      name: 'sqFt',
      type: 'number',
      label: 'Square Footage',
    },
    {
      name: 'price',
      type: 'group',
      fields: [
        { name: 'amount', type: 'number' },
        {
          name: 'frequency',
          type: 'select',
          options: [
            { label: 'Monthly', value: 'monthly' },
            { label: 'Yearly', value: 'yearly' },
            { label: 'Per Sq Ft / Year', value: 'sqft-yearly' },
          ],
        },
      ],
    },
    {
      name: 'floorPlan',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'features',
      type: 'array',
      fields: [{ name: 'feature', type: 'text' }],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
  ],
}
