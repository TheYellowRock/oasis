import Link from 'next/link'
import type { FinalCTABlock } from '@/payload-types'

export function FinalCTASection({ block }: { block: FinalCTABlock }) {
  const bg =
    block.backgroundImage && typeof block.backgroundImage === 'object'
      ? block.backgroundImage
      : null

  return (
    <section className="relative isolate overflow-hidden px-6 py-20">
      {bg?.url && (
        <img
          src={bg.url}
          alt={bg.alt || block.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-neutral-950/88" />
      <div className="relative mx-auto max-w-5xl text-center text-white">
        <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">{block.title}</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={block.primaryButtonHref}
            className=" bg-white px-5 py-2.5 text-sm font-semibold tracking-wide text-black hover:bg-white/90"
          >
            {block.primaryButtonLabel}
          </Link>
          <Link
            href={block.secondaryButtonHref}
            className="border border-white/60 px-5 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-white/10"
          >
            {block.secondaryButtonLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
