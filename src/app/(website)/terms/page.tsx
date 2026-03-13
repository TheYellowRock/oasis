import { WebsitePageBySlug } from '@/components/WebsitePageBySlug'

export default async function TermsPage() {
  return (
    <WebsitePageBySlug
      slug="terms"
      fallbackTitle="Terms of Service"
      fallbackDescription="Sample Terms page. Add a page entry with slug 'terms' in the dashboard to fully customize this route."
    />
  )
}
