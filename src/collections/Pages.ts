import type { CollectionConfig } from 'payload'
import { Hero } from '../blocks/Hero'
import { InventoryGrid } from '../blocks/InventoryGrid'
import { Content } from '../blocks/Content'
import { CoworkHero } from '../blocks/CoworkHero'
import { PricingCards } from '../blocks/PricingCards'
import { SplitLeadSection } from '../blocks/SplitLeadSection'
import { HomeHero } from '../blocks/HomeHero'
import { ServicesGrid } from '../blocks/ServicesGrid'
import { FeaturedSpaces } from '../blocks/FeaturedSpaces'
import { StatsSection } from '../blocks/StatsSection'
import { FinalCTA } from '../blocks/FinalCTA'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        Hero,
        InventoryGrid,
        Content,
        CoworkHero,
        PricingCards,
        SplitLeadSection,
        HomeHero,
        ServicesGrid,
        FeaturedSpaces,
        StatsSection,
        FinalCTA,
      ],
    },
  ],
}
