import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@/payload.config'

function plainTextToLexical(text: string) {
  const paragraphs = text.split('\n').filter(Boolean)
  const rows = paragraphs.length > 0 ? paragraphs : ['']

  return {
    root: {
      type: 'root',
      children: rows.map((line) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: line, version: 1, format: 0, mode: 'normal', style: '' }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

const pagesToEnsure = [
  { slug: 'home', title: 'Home' },
  { slug: 'blog', title: 'Blog' },
  { slug: 'contact', title: 'Contact' },
  { slug: 'privacy', title: 'Privacy Policy' },
  { slug: 'terms', title: 'Terms of Service' },
  { slug: 'self-storage', title: 'Self Storage' },
  { slug: 'food-drink', title: 'Food & Drink' },
  { slug: 'shops', title: 'Shops' },
  { slug: 'warehouse', title: 'Warehouse' },
] as const

async function run() {
  const payload = await getPayload({ config })

  for (const page of pagesToEnsure) {
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: page.slug },
      },
      limit: 1,
      depth: 0,
    })

    if (existing.docs[0]) continue

    await payload.create({
      collection: 'pages',
      data: {
        title: page.title,
        slug: page.slug,
        layout: [
          {
            blockType: 'hero',
            title: page.title,
            subtitle: 'This page is now managed in the client portal dashboard.',
          },
          {
            blockType: 'content',
            richText: plainTextToLexical(
              `${page.title}\n\nUse the dashboard Content editor to add, reorder, and update blocks for this page.`,
            ),
          },
        ],
      },
    })
  }

  console.log('Navigation pages ensured in pages collection.')
}

void run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
