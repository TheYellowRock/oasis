import type { Block } from 'payload'

export const InventoryGrid: Block = {
  slug: 'inventoryGrid',
  interfaceName: 'InventoryGridBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
  ],
}
