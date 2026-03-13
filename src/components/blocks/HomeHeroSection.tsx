import Link from 'next/link'
import { Building2, Lock, Package, ShoppingBag } from 'lucide-react'
import type { HomeHeroBlock } from '@/payload-types'

export function HomeHeroSection({ block }: { block: HomeHeroBlock }) {
  const bg = block.backgroundImage && typeof block.backgroundImage === 'object' ? block.backgroundImage : null
  const fallbackHeroImage =
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2200&q=80'

  const quickLinks = [
    { href: '/spaces/office', label: 'Office', icon: Building2 },
    { href: '/spaces/warehouse', label: 'Warehouse', icon: Package },
    { href: '/spaces/retail', label: 'Retail', icon: ShoppingBag },
    { href: '/spaces/self-storage', label: 'Self Storage', icon: Lock },
  ]

  return (
    <section data-home-hero="true" className="relative isolate min-h-screen overflow-visible">
      <img
        src={bg?.url || fallbackHeroImage}
        alt={bg?.alt || block.title}
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 pt-40 pb-24 text-center">
        <div className="max-w-4xl text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D48B28] sm:text-sm">
            LAS VEGAS — 3355 SPRING MOUNTAIN RD
          </p>
          <h1 className="mt-6 font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
            Choose the Right Space for Your Business
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/90 sm:text-lg">
            Explore available office, warehouse, retail, and storage spaces at Oasis.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 w-full max-w-6xl -translate-x-1/2 translate-y-1/2 px-4 sm:px-6">
        <div className="pointer-events-auto grid grid-cols-4 border border-neutral-200 bg-white shadow-xl rounded-none">
          {quickLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex min-h-24 flex-col items-center justify-center gap-2 border-r border-neutral-200 text-neutral-900 transition-colors hover:bg-neutral-50 last:border-r-0 rounded-none"
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
