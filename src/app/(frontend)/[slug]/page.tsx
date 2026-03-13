import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { RenderBlocks } from '@/components/RenderBlocks'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function PageRoute({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const page = result.docs[0]

  if (!page) {
    return notFound()
  }

  return (
    <article>
      <RenderBlocks layout={page.layout} />
    </article>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
    select: { slug: true },
  })

  return pages.docs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
    select: { title: true },
  })

  const page = result.docs[0]

  return {
    title: page?.title ? `${page.title} | Oasis District` : 'Oasis District',
  }
}
