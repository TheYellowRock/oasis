import { WebsitePageBySlug } from '@/components/WebsitePageBySlug'

export default async function HomePage() {
  return (
    <WebsitePageBySlug
      slug="home"
      fallbackTitle="Home"
      fallbackDescription="Sample Home page. Add a page entry with slug 'home' in the dashboard to fully customize this route."
    />
  )
}
