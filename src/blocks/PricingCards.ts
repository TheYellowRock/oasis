import type { Block } from 'payload'

export const PricingCards: Block = {
  slug: 'pricingCards',
  interfaceName: 'PricingCardsBlock',
  fields: [
    {
      name: 'overTitle',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'plans',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'frequency',
          type: 'text',
          required: true,
          defaultValue: '/month',
        },
        {
          name: 'features',
          type: 'array',
          minRows: 1,
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}
