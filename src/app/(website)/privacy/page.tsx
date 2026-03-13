import { WebsitePageBySlug } from '@/components/WebsitePageBySlug'

export default async function PrivacyPage() {
  return (
    <WebsitePageBySlug
      slug="privacy"
      fallbackTitle="Privacy Policy"
      fallbackDescription="Sample Privacy Policy page. Add a page entry with slug 'privacy' in the dashboard to fully customize this route."
    />
  )
}
