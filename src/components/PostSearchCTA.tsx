import Link from 'next/link'

type SegmentKey = 'all' | 'office' | 'warehouse' | 'retail'

type Props = {
  segment?: string
}

const contentBySegment: Record<
  SegmentKey,
  {
    title: string
    description: string
    buttonLabel: string
    subject: string
    buttonStyle: 'gold' | 'white'
  }
> = {
  all: {
    title: 'Not finding the right spot?',
    description: 'Our district is evolving daily. Let our team find a space that grows with you.',
    buttonLabel: 'Consult with an Expert',
    subject: 'Consultation request for available spaces',
    buttonStyle: 'white',
  },
  office: {
    title: 'Looking for the right office?',
    description:
      'From private suites to floor-wide headquarters, our leasing team is ready to help you find the perfect fit.',
    buttonLabel: 'Talk to Leasing Team',
    subject: 'Office leasing inquiry',
    buttonStyle: 'gold',
  },
  warehouse: {
    title: 'Need more than just square footage?',
    description: "We specialize in industrial logistics and high-capacity power needs. Let's discuss your specs.",
    buttonLabel: 'Discuss Requirements',
    subject: 'Warehouse requirements discussion',
    buttonStyle: 'gold',
  },
  retail: {
    title: 'Want to be the next big destination?',
    description: 'Join a curated list of shops and restaurants in the heart of the district.',
    buttonLabel: 'Inquire About Retail',
    subject: 'Retail leasing inquiry',
    buttonStyle: 'gold',
  },
}

function getSegmentKey(segment?: string): SegmentKey {
  if (!segment) return 'all'
  const normalized = segment.toLowerCase()
  if (normalized === 'office') return 'office'
  if (normalized === 'warehouse') return 'warehouse'
  if (normalized === 'retail') return 'retail'
  return 'all'
}

export function PostSearchCTA({ segment }: Props) {
  const key = getSegmentKey(segment)
  const content = contentBySegment[key]
  const contactHref = `/contact?subject=${encodeURIComponent(content.subject)}`
  const backgroundImage =
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=80'
  const buttonClass =
    content.buttonStyle === 'gold'
      ? 'border border-[#D48B28] bg-[#D48B28] text-black hover:bg-[#c17d23]'
      : 'border border-white bg-white text-black hover:bg-neutral-100'

  return (
    <section className="rounded-none border-y border-neutral-700 bg-black py-20 text-white relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 45%), radial-gradient(circle at 85% 20%, rgba(212,139,40,0.16), rgba(0,0,0,0) 40%)',
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[1.6fr_1fr] md:items-center">
        <div>
          <h2 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{content.title}</h2>
          <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{content.description}</p>
        </div>

        <div className="md:justify-self-end">
          <Link
            href={contactHref}
            className={`inline-flex w-full items-center justify-center px-8 py-4 text-sm font-semibold tracking-wide transition-colors rounded-none md:w-auto ${buttonClass}`}
          >
            {content.buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
