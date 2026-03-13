import type { Block } from 'payload'

export const StatsSection: Block = {
  slug: 'statsSection',
  interfaceName: 'StatsSectionBlock',
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'A New Standard for Mixed-Use Living' },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'primaryImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'secondaryImage',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'estBadge', type: 'text', required: true, defaultValue: 'Est. 2024' },
    {
      name: 'stats',
      type: 'array',
      minRows: 4,
      maxRows: 4,
      required: true,
      fields: [{ name: 'value', type: 'text', required: true }],
    },
  ],
}
