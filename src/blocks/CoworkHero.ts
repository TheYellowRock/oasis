import type { Block } from 'payload'

export const CoworkHero: Block = {
  slug: 'coworkHero',
  interfaceName: 'CoworkHeroBlock',
  fields: [
    {
      name: 'overTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'amenities',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Wifi', value: 'wifi' },
            { label: 'Coffee', value: 'coffee' },
            { label: 'Users', value: 'users' },
            { label: 'Shield', value: 'shield' },
            { label: 'Clock', value: 'clock' },
            { label: 'Building', value: 'building' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
