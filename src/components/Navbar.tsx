'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'

const spacesLinks = [
  { href: '/leasing', label: 'All Spaces' },
  { href: '/spaces/office', label: 'Office' },
  { href: '/spaces/warehouse', label: 'Warehouse' },
  { href: '/spaces/retail', label: 'Retail' },
  { href: '/spaces/self-storage', label: 'Self Storage' },
]

const exploreLinks = [
  { href: '/explore/cowork-lounge', label: 'Cowork Lounge' },
  { href: '/explore/food-and-drink', label: 'Food & Drink' },
  { href: '/explore/shops', label: 'Shops' },
  { href: '/explore/warehouse-info', label: 'Warehouse Info' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSpacesOpen, setMobileSpacesOpen] = useState(false)
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false)
  const [desktopDropdown, setDesktopDropdown] = useState<'spaces' | 'explore' | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const shouldForceDarkHeader =
    /^\/spaces\/[^/]+\/[^/]+$/.test(pathname) || pathname === '/leasing/book-a-tour'

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0 || shouldForceDarkHeader)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [shouldForceDarkHeader])

  return (
    <header
      className={`sticky top-0 z-50 -mb-24 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? 'w-full border-b border-white/10 bg-[#111111]/95 backdrop-blur-md'
          : 'w-full border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-80">
          <Image
            src="/oasis-rent-logo.png"
            alt="Oasis Rent"
            width={230}
            height={64}
            className="h-8 w-auto sm:h-10"
            priority
          />
          <span className="sr-only">Oasis Rent</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-white md:flex">
          <Link href="/" className="hover:text-white/75">
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setDesktopDropdown('spaces')}
            onMouseLeave={() => setDesktopDropdown((current) => (current === 'spaces' ? null : current))}
          >
            <button
              type="button"
              className="flex items-center gap-1 hover:text-white/75"
              aria-haspopup="menu"
              aria-expanded={desktopDropdown === 'spaces'}
            >
              Spaces <ChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {desktopDropdown === 'spaces' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 w-56 border border-white/10 bg-[#111111] p-2 shadow-lg rounded-none"
                >
                  {spacesLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white rounded-none"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setDesktopDropdown('explore')}
            onMouseLeave={() => setDesktopDropdown((current) => (current === 'explore' ? null : current))}
          >
            <button
              type="button"
              className="flex items-center gap-1 hover:text-white/75"
              aria-haspopup="menu"
              aria-expanded={desktopDropdown === 'explore'}
            >
              Explore <ChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {desktopDropdown === 'explore' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 w-56 border border-white/10 bg-[#111111] p-2 shadow-lg rounded-none"
                >
                  {exploreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white rounded-none"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/blog" className="hover:text-white/75">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-white/75">
            Contact
          </Link>
        </nav>

        <div className="hidden md:block">
          <Link
            href="/leasing"
            className="inline-flex items-center border border-white bg-white px-6 py-3 text-xs font-semibold tracking-wide text-black transition-colors hover:bg-gray-100 rounded-none"
          >
            VIEW SPACES
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center border border-white/30 p-2 text-white md:hidden rounded-none"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[86vw] max-w-sm border-l border-white/10 bg-[#111111] p-5 text-white transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Image src="/oasis-rent-logo.png" alt="Oasis Rent" width={190} height={52} className="h-7 w-auto" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="border border-white/30 p-2 rounded-none"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <Link href="/" className="px-2 py-2 hover:bg-white/10" onClick={() => setMobileOpen(false)}>
            Home
          </Link>

          <button
            type="button"
            onClick={() => setMobileSpacesOpen((prev) => !prev)}
            className="flex items-center justify-between px-2 py-2 text-left hover:bg-white/10"
            aria-expanded={mobileSpacesOpen}
          >
            Spaces
            <ChevronDown className={`h-4 w-4 transition-transform ${mobileSpacesOpen ? 'rotate-180' : ''}`} />
          </button>

          {mobileSpacesOpen && (
            <div className="ml-2 space-y-1 border-l border-white/20 pl-3">
              {spacesLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-2 py-2 text-white/85 hover:bg-white/10 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileExploreOpen((prev) => !prev)}
            className="flex items-center justify-between px-2 py-2 text-left hover:bg-white/10"
            aria-expanded={mobileExploreOpen}
          >
            Explore
            <ChevronDown className={`h-4 w-4 transition-transform ${mobileExploreOpen ? 'rotate-180' : ''}`} />
          </button>

          {mobileExploreOpen && (
            <div className="ml-2 space-y-1 border-l border-white/20 pl-3">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-2 py-2 text-white/85 hover:bg-white/10 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <Link href="/blog" className="px-2 py-2 hover:bg-white/10" onClick={() => setMobileOpen(false)}>
            Blog
          </Link>
          <Link href="/contact" className="px-2 py-2 hover:bg-white/10" onClick={() => setMobileOpen(false)}>
            Contact
          </Link>

          <Link
            href="/leasing"
            onClick={() => setMobileOpen(false)}
            className="mt-4 inline-flex items-center justify-center border border-white bg-white px-4 py-2 text-xs font-semibold tracking-wide text-black hover:bg-gray-100 rounded-none"
          >
            VIEW SPACES
          </Link>
        </div>
      </aside>
    </header>
  )
}
