'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const spaceTypes = [
  { label: 'Retail', value: 'retail' },
  { label: 'Office', value: 'office' },
  { label: 'Warehouse', value: 'warehouse' },
  { label: 'Self Storage', value: 'self-storage' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Coworking', value: 'coworking' },
  { label: 'Residential', value: 'residential' },
] as const

const availabilityOptions = [
  { label: 'Available', value: 'available' },
  { label: 'Under Offer', value: 'under-offer' },
  { label: 'Leased', value: 'leased' },
] as const

const sortOptions = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price.amount' },
] as const

export function FilterSidebar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  function updateParam(key: string, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString())

    if (!value.trim()) {
      nextParams.delete(key)
    } else {
      nextParams.set(key, value)
    }

    const query = nextParams.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  function handleReset() {
    router.push(pathname)
  }

  return (
    <aside className="sticky top-6 space-y-5 border bg-white p-4">
      <div>
        <h2 className="text-lg font-semibold">Filters</h2>
        <p className="text-sm text-gray-500">Narrow available leasing options.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Space Type</label>
        <select
          className="w-full border bg-white px-3 py-2 text-sm"
          value={searchParams.get('type') ?? ''}
          onChange={(e) => updateParam('type', e.target.value)}
        >
          <option value="">All Space Types</option>
          {spaceTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Availability</label>
        <select
          className="w-full border bg-white px-3 py-2 text-sm"
          value={searchParams.get('status') ?? ''}
          onChange={(e) => updateParam('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          {availabilityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">SqFt Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            className="w-full border px-3 py-2 text-sm"
            value={searchParams.get('minSqFt') ?? ''}
            onChange={(e) => updateParam('minSqFt', e.target.value)}
          />
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            className="w-full border px-3 py-2 text-sm"
            value={searchParams.get('maxSqFt') ?? ''}
            onChange={(e) => updateParam('maxSqFt', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Price Range (Monthly)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            className="w-full border px-3 py-2 text-sm"
            value={searchParams.get('minPrice') ?? ''}
            onChange={(e) => updateParam('minPrice', e.target.value)}
          />
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            className="w-full border px-3 py-2 text-sm"
            value={searchParams.get('maxPrice') ?? ''}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <select
          className="w-full border bg-white px-3 py-2 text-sm"
          value={searchParams.get('sort') ?? '-createdAt'}
          onChange={(e) => updateParam('sort', e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="w-full border px-3 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Reset Filters
      </button>
    </aside>
  )
}
