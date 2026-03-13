import type { Block } from 'payload'

export const FinalCTA: Block = {
  slug: 'finalCTA',
  interfaceName: 'FinalCTABlock',
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Find Your Perfect Space at Oasis District' },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'primaryButtonLabel', type: 'text', required: true, defaultValue: 'VIEW AVAILABLE SPACES' },
    { name: 'primaryButtonHref', type: 'text', required: true, defaultValue: '/leasing' },
    { name: 'secondaryButtonLabel', type: 'text', required: true, defaultValue: 'CONTACT SALES' },
    { name: 'secondaryButtonHref', type: 'text', required: true, defaultValue: '/contact' },
  ],
}
