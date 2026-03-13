import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Link href="/home" className="inline-flex items-center">
            <Image src="/oasis-rent-logo.png" alt="Oasis Rent" width={230} height={64} className="h-9 w-auto" />
          </Link>
          <p className="max-w-xs text-sm text-neutral-400">
            A curated destination for flexible work, retail, storage, and community-driven business growth.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full border border-neutral-700 p-2 hover:bg-neutral-800">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="rounded-full border border-neutral-700 p-2 hover:bg-neutral-800">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">The District</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/district/cowork-lounge" className="hover:text-white">Cowork Lounge</Link></li>
            <li><Link href="/district/self-storage" className="hover:text-white">Self Storage</Link></li>
            <li><Link href="/district/food-drink" className="hover:text-white">Food &amp; Drink</Link></li>
            <li><Link href="/district/shops" className="hover:text-white">Shops</Link></li>
            <li><Link href="/district/warehouse" className="hover:text-white">Warehouse</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Leasing</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/leasing" className="hover:text-white">Available Spaces</Link></li>
            <li><Link href="/contact" className="hover:text-white">Schedule a Tour</Link></li>
            <li><Link href="/blog" className="hover:text-white">News &amp; Updates</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Contact</h4>
          <div className="space-y-2 text-sm text-neutral-400">
            <p>3355 Spring Mountain Rd</p>
            <p>
              <a href="tel:+17025551234" className="hover:text-white">
                (702) 555-1234
              </a>
            </p>
            <p>
              <a href="mailto:hello@oasisdistrict.com" className="hover:text-white">
                hello@oasisdistrict.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-neutral-500 sm:flex-row sm:px-6 lg:px-8">
          <p>Copyright 2026 Oasis District. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-neutral-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
