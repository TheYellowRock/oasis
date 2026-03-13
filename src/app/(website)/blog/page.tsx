import { WebsitePageBySlug } from '@/components/WebsitePageBySlug'

export default async function BlogPage() {
  return (
    <WebsitePageBySlug
      slug="blog"
      fallbackTitle="Blog"
      fallbackDescription="Sample Blog page. Add a page entry with slug 'blog' in the dashboard to fully customize this route."
    />
  )
}
