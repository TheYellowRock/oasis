import type { Block } from 'payload'

export const HomeHero: Block = {
  slug: 'homeHero',
  interfaceName: 'HomeHeroBlock',
  fields: [
    { name: 'announcementText', type: 'text', required: true, defaultValue: 'Now Leasing' },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea', required: true },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'primaryButtonLabel', type: 'text', required: true, defaultValue: 'VIEW AVAILABLE SPACES' },
    { name: 'primaryButtonHref', type: 'text', required: true, defaultValue: '/leasing' },
    { name: 'secondaryButtonLabel', type: 'text', required: true, defaultValue: 'OUR STORY' },
    { name: 'secondaryButtonHref', type: 'text', required: true, defaultValue: '/home' },
  ],
}
