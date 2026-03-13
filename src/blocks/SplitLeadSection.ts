import type { Block } from 'payload'

export const SplitLeadSection: Block = {
  slug: 'splitLeadSection',
  interfaceName: 'SplitLeadSectionBlock',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
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
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'formTitle',
      type: 'text',
      required: true,
      defaultValue: 'Request Information',
    },
    {
      name: 'formDescription',
      type: 'textarea',
      defaultValue: 'Tell us what you need and our leasing team will contact you shortly.',
    },
  ],
}
