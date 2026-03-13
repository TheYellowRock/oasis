import type { CollectionConfig } from 'payload'

export const Units: CollectionConfig = {
  slug: 'units',
  admin: {
    useAsTitle: 'unitNumber',
    defaultColumns: ['unitNumber', 'type', 'status', 'leaseType', 'building', 'sqFt', 'price.amount'],
  },
  fields: [
    {
      name: 'unitNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'available',
      required: true,
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Under Offer', value: 'under-offer' },
        { label: 'Leased', value: 'leased' },
      ],
    },
    {
      name: 'leaseType',
      type: 'select',
      required: true,
      options: [
        { label: 'NNN', value: 'nnn' },
        { label: 'Full Service', value: 'full-service' },
        { label: 'Modified Gross', value: 'modified-gross' },
      ],
    },
    {
      name: 'building',
      type: 'select',
      required: true,
      options: [
        { label: 'Building A', value: 'building-a' },
        { label: 'Building B', value: 'building-b' },
        { label: 'Annex', value: 'annex' },
      ],
    },
    {
      name: 'sqFt',
      type: 'number',
      label: 'Square Footage',
      required: true,
      min: 1,
    },
    {
      name: 'price',
      type: 'group',
      fields: [
        { name: 'amount', type: 'number', required: true, min: 0, label: 'Monthly Rent' },
      ],
    },
    {
      name: 'floorPlan',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
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
  ],
}
