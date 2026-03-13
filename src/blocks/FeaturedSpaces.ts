import type { Block } from 'payload'

export const FeaturedSpaces: Block = {
  slug: 'featuredSpaces',
  interfaceName: 'FeaturedSpacesBlock',
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Featured Spaces' },
    { name: 'viewAllText', type: 'text', required: true, defaultValue: 'View All Spaces' },
    { name: 'viewAllHref', type: 'text', required: true, defaultValue: '/leasing' },
    {
      name: 'bottomButtonLabel',
      type: 'text',
      required: true,
      defaultValue: 'VIEW ALL AVAILABLE SPACES',
    },
    { name: 'bottomButtonHref', type: 'text', required: true, defaultValue: '/leasing' },
  ],
}
