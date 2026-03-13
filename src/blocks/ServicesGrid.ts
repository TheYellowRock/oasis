import type { Block } from 'payload'

export const ServicesGrid: Block = {
  slug: 'servicesGrid',
  interfaceName: 'ServicesGridBlock',
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Everything You Need, All in One Place' },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'items',
      type: 'array',
      minRows: 4,
      maxRows: 4,
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
