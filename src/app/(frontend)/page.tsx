import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Oasis District
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Premium Commercial Real Estate
        </p>
        {user && (
          <p className="mt-2 text-sm text-gray-500">
            Welcome back, {user.email}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
            href="/admin"
            rel="noopener noreferrer"
            target="_blank"
          >
            Admin Panel
          </a>
          <a
            className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  )
}
