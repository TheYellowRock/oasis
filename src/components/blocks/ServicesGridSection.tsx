import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Media, Post, ServicesGridBlock } from '@/payload-types'

type NewsCard = {
  id: number | string
  slug: string
  title: string
  excerpt: string
  categoryTag: string
  publishedAt: string
  featuredImage?: number | Media | null
}

const categoryTagLabel: Record<string, string> = {
  news: 'NEWS',
  leasing: 'LEASING',
  community: 'COMMUNITY',
  insights: 'INSIGHTS',
}

function formatDate(dateValue?: string | null) {
  if (!dateValue) return 'Recently published'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(dateValue),
  )
}

function getPostImage(post: NewsCard): Media | null {
  if (post.featuredImage && typeof post.featuredImage === 'object') return post.featuredImage
  return null
}

export function ServicesGridSection({ block: _block, posts }: { block: ServicesGridBlock; posts: Post[] }) {
  const cards: NewsCard[] =
    posts.length > 0
      ? posts
      : [
          {
            id: 'placeholder-news',
            slug: 'news-updates',
            title: 'Leasing Updates and District Highlights',
            excerpt: 'Get the latest announcements on openings, availability, and district growth.',
            categoryTag: 'news',
            publishedAt: new Date().toISOString(),
            featuredImage: null,
          },
          {
            id: 'placeholder-leasing',
            slug: 'leasing-insights',
            title: 'How to Choose the Right Commercial Space',
            excerpt: 'A quick guide to evaluating size, location, and lease structure for your next move.',
            categoryTag: 'leasing',
            publishedAt: new Date().toISOString(),
            featuredImage: null,
          },
          {
            id: 'placeholder-community',
            slug: 'community-story',
            title: 'Building a Business Community at Oasis',
            excerpt: 'See how tenants are collaborating across retail, office, and industrial spaces.',
            categoryTag: 'community',
            publishedAt: new Date().toISOString(),
            featuredImage: null,
          },
        ]

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#35c4b5]">Content Hub</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight text-gray-900 sm:text-5xl">News & Insights</h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-900 hover:text-black"
          >
            VIEW ALL ARTICLES
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((post) => {
            const image = getPostImage(post)
            const tag = categoryTagLabel[post.categoryTag ?? ''] ?? 'NEWS'
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden border border-gray-200 bg-white shadow-sm rounded-none"
              >
                <div className="relative">
                  {image?.url ? (
                    <img src={image.url} alt={image.alt || post.title} className="h-56 w-full object-cover" />
                  ) : (
                    <div className="h-56 bg-linear-to-br from-gray-200 to-gray-300" />
                  )}
                  <span className="absolute left-3 top-3 border border-black/20 bg-white px-2.5 py-1 text-[11px] font-semibold tracking-wide text-gray-900 rounded-none">
                    {tag}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">{formatDate(post.publishedAt)}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-gray-900">{post.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>
                  <p className="mt-5 text-xs font-semibold tracking-wide text-gray-900">READ MORE +</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
