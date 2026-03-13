import React from 'react'
import '../(frontend)/globals.css'
import { NotificationBanner } from '@/components/NotificationBanner'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata = {
  description: 'Oasis District Leasing',
  title: 'Leasing | Oasis District',
}

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <NotificationBanner />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
