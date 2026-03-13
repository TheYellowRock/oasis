'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  availableCount: number
  showTypeFilter?: boolean
  typeSelectionMode?: 'query' | 'dedicated-route'
}

const sortOptions = [
  { label: 'Newest Listings', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price.amount' },
] as const

const typeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Office', value: 'office' },
  { label: 'Warehouse', value: 'warehouse' },
  { label: 'Retail', value: 'retail' },
  { label: 'Self Storage', value: 'self-storage' },
] as const

const priceOptions = [
  { label: 'Any Price', value: '' },
  { label: 'Up to $3,000', value: '0-3000' },
  { label: '$3,000 - $10,000', value: '3000-10000' },
  { label: '$10,000 - $30,000', value: '10000-30000' },
  { label: '$30,000+', value: '30000-999999999' },
] as const

const sqFtOptions = [
  { label: 'Any Size', value: '' },
  { label: 'Under 2,000 SF', value: '0-2000' },
  { label: '2,000 - 10,000 SF', value: '2000-10000' },
  { label: '10,000 - 25,000 SF', value: '10000-25000' },
  { label: '25,000+ SF', value: '25000-999999999' },
] as const

const buildingOptions = [
  { label: 'Any Building', value: '' },
  { label: 'Building A', value: 'building-a' },
  { label: 'Building B', value: 'building-b' },
  { label: 'Annex', value: 'annex' },
] as const

const amenityOptions = [
  { label: 'Any Amenities', value: '' },
  { label: 'Loading Dock', value: 'loading dock' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Parking', value: 'parking' },
  { label: 'Private Restroom', value: 'private restroom' },
] as const

export function LeasingFiltersBar({
  availableCount,
  showTypeFilter = true,
  typeSelectionMode = 'query',
}: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '')

  function updateParams(updates: Record<string, string>) {
    const nextParams = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(updates)) {
      if (!value.trim()) {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }
    }

    const query = nextParams.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  function handleTypeChange(nextType: string) {
    if (typeSelectionMode !== 'dedicated-route') {
      updateParams({ type: nextType })
      return
    }

    if (!nextType.trim()) {
      updateParams({ type: '' })
      return
    }

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('type')
    const query = nextParams.toString()
    const targetPath = `/spaces/${nextType}`
    router.push(query ? `${targetPath}?${query}` : targetPath)
  }

  useEffect(() => {
    setSearchValue(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = searchParams.get('q') ?? ''
      if (searchValue !== current) {
        updateParams({ q: searchValue })
      }
    }, 250)

    return () => clearTimeout(timeout)
  }, [searchValue])

  const availableLabel = useMemo(() => {
    return `${availableCount} available`
  }, [availableCount])

  return (
    <section className="border border-neutral-800 bg-[#111111] p-4 text-white shadow-sm">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search by building, address, suite, or keyword..."
          className="h-12 w-full rounded-full border border-neutral-700 bg-[#1A1A1A] pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-neutral-500"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={searchParams.get('sort') ?? '-createdAt'}
          onChange={(event) => updateParams({ sort: event.target.value })}
          className="h-10 rounded-full border border-neutral-700 bg-[#1A1A1A] px-4 text-sm text-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {showTypeFilter && (
          <select
            value={searchParams.get('type') ?? ''}
            onChange={(event) => handleTypeChange(event.target.value)}
            className="h-10 rounded-full border border-neutral-700 bg-[#1A1A1A] px-4 text-sm text-white"
          >
            {typeOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        <select
          value={searchParams.get('price') ?? ''}
          onChange={(event) => updateParams({ price: event.target.value })}
          className="h-10 rounded-full border border-neutral-700 bg-[#1A1A1A] px-4 text-sm text-white"
        >
          {priceOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get('sqFt') ?? ''}
          onChange={(event) => updateParams({ sqFt: event.target.value })}
          className="h-10 rounded-full border border-neutral-700 bg-[#1A1A1A] px-4 text-sm text-white"
        >
          {sqFtOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get('building') ?? ''}
          onChange={(event) => updateParams({ building: event.target.value })}
          className="h-10 rounded-full border border-neutral-700 bg-[#1A1A1A] px-4 text-sm text-white"
        >
          {buildingOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get('amenity') ?? ''}
          onChange={(event) => updateParams({ amenity: event.target.value })}
          className="h-10 rounded-full border border-neutral-700 bg-[#1A1A1A] px-4 text-sm text-white"
        >
          {amenityOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <p className="ml-auto text-sm text-neutral-300">{availableLabel}</p>
      </div>
    </section>
  )
}
