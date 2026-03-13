import React from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'

export const metadata = {
  title: 'Dashboard | Oasis District',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
