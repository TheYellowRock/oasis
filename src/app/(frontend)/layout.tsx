import React from 'react'
import './globals.css'

export const metadata = {
  description: 'Oasis District — Premium Commercial Real Estate',
  title: 'Oasis District',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}
