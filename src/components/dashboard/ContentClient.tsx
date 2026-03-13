'use client'

import { useState, useCallback } from 'react'
import type { Page, Category, Media } from '@/payload-types'
import { saveDraft, publishPage, getPageById } from '@/actions/pages'
import { uploadMedia } from '@/actions/media'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Globe,
  FileText,
  Type,
  ImageIcon,
  LayoutGrid,
  AlignLeft,
  Loader2,
  Gem,
  Columns2,
  FormInput,
} from 'lucide-react'

interface Props {
  initialPages: Page[]
  categories: Category[]
  mediaItems: Media[]
}

type BlockData = NonNullable<Page['layout']>[number]

function lexicalToPlainText(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const root = (data as Record<string, unknown>).root as Record<string, unknown> | undefined
  if (!root?.children) return ''
  const children = root.children as Array<Record<string, unknown>>
  return children
    .map((node) => {
      const nodeChildren = node.children as Array<Record<string, unknown>> | undefined
      if (!nodeChildren) return ''
      return nodeChildren.map((child) => (child.text as string) ?? '').join('')
    })
    .join('\n')
}

function plainTextToLexical(text: string) {
  const paragraphs = text.split('\n').filter((line) => line.length > 0)
  if (paragraphs.length === 0) {
    paragraphs.push('')
  }
  return {
    root: {
      type: 'root',
      children: paragraphs.map((para) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: para, version: 1, format: 0, mode: 'normal', style: '' }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

const blockIcons: Record<string, typeof Type> = {
  hero: Type,
  inventoryGrid: LayoutGrid,
  content: AlignLeft,
  coworkHero: Gem,
  pricingCards: Columns2,
  splitLeadSection: FormInput,
}

const blockLabels: Record<string, string> = {
  hero: 'Hero',
  inventoryGrid: 'Inventory Grid',
  content: 'Content',
  coworkHero: 'Cowork Hero',
  pricingCards: 'Pricing Cards',
  splitLeadSection: 'Split Lead Section',
}

export function ContentClient({ initialPages, categories, mediaItems }: Props) {
  function getBlockKey(block: BlockData, index: number) {
    return block.id ?? `block-${index}`
  }

  const [selectedPageId, setSelectedPageId] = useState<number | null>(null)
  const [pageData, setPageData] = useState<Page | null>(null)
  const [editedBlocks, setEditedBlocks] = useState<Record<string, Record<string, unknown>>>({})
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const selectPage = useCallback(async (page: Page) => {
    setSelectedPageId(page.id)
    const freshPage = await getPageById(page.id)
    setPageData(freshPage)
    setEditedBlocks({})
  }, [])

  function updateBlockField(blockId: string, field: string, value: unknown) {
    setEditedBlocks((prev) => ({
      ...prev,
      [blockId]: { ...(prev[blockId] ?? {}), [field]: value },
    }))
  }

  function getMergedLayout(): Record<string, unknown>[] {
    if (!pageData?.layout) return []
    return pageData.layout.map((block, index) => {
      const edits = editedBlocks[getBlockKey(block, index)]
      if (!edits) return block as unknown as Record<string, unknown>
      return { ...block, ...edits } as Record<string, unknown>
    })
  }

  async function handleSaveDraft() {
    if (!pageData) return
    setSaving(true)
    try {
      const layout = getMergedLayout()
      await saveDraft(pageData.id, layout)
      const freshPage = await getPageById(pageData.id)
      setPageData(freshPage)
      setEditedBlocks({})
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    if (!pageData) return
    setPublishing(true)
    try {
      const layout = getMergedLayout()
      await saveDraft(pageData.id, layout)
      await publishPage(pageData.id)
      const freshPage = await getPageById(pageData.id)
      setPageData(freshPage)
      setEditedBlocks({})
    } finally {
      setPublishing(false)
    }
  }

  if (!selectedPageId || !pageData) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Site Content</h1>
          <p className="text-sm text-muted-foreground">Select a page to edit its layout blocks</p>
        </div>
        {initialPages.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No pages found. Create pages in the Payload Admin to manage them here.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {initialPages.map((page) => (
              <Card
                key={page.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => selectPage(page)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">{page.title}</p>
                        <p className="text-sm text-muted-foreground">/{page.slug}</p>
                      </div>
                    </div>
                    <Badge variant={page._status === 'published' ? 'default' : 'secondary'}>
                      {page._status ?? 'draft'}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {page.layout?.length ?? 0} block{(page.layout?.length ?? 0) !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="-m-6 flex h-screen flex-col lg:-m-8">
      {/* Top toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedPageId(null); setPageData(null) }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="font-semibold">{pageData.title}</h2>
            <p className="text-xs text-muted-foreground">/{pageData.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            Save Draft
          </Button>
          <Button onClick={handlePublish} disabled={publishing}>
            {publishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
            Publish
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Layout Blocks
          </p>
          {!pageData.layout || pageData.layout.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              This page has no blocks. Add blocks in the Payload Admin first.
            </p>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={pageData.layout.map((b, i) => getBlockKey(b, i))}
              className="space-y-2"
            >
              {pageData.layout.map((block, index) => {
                const Icon = blockIcons[block.blockType] ?? FileText
                const blockKey = getBlockKey(block, index)
                return (
                  <AccordionItem
                    key={blockKey}
                    value={blockKey}
                    className="rounded-lg border px-3"
                  >
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {blockLabels[block.blockType] ?? block.blockType}
                        </span>
                        {block.blockName && (
                          <span className="text-muted-foreground">— {block.blockName}</span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <BlockEditor
                        block={block}
                        edits={editedBlocks[blockKey] ?? {}}
                        onFieldChange={(field, value) =>
                          updateBlockField(blockKey, field, value)
                        }
                        categories={categories}
                        mediaItems={mediaItems}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  )
}

function BlockEditor({
  block,
  edits,
  onFieldChange,
  categories,
  mediaItems,
}: {
  block: BlockData
  edits: Record<string, unknown>
  onFieldChange: (field: string, value: unknown) => void
  categories: Category[]
  mediaItems: Media[]
}) {
  switch (block.blockType) {
    case 'hero':
      return (
        <HeroEditor
          block={block}
          edits={edits}
          onFieldChange={onFieldChange}
          mediaItems={mediaItems}
        />
      )
    case 'inventoryGrid':
      return (
        <InventoryGridEditor
          block={block}
          edits={edits}
          onFieldChange={onFieldChange}
          categories={categories}
        />
      )
    case 'content':
      return <ContentBlockEditor block={block} edits={edits} onFieldChange={onFieldChange} />
    case 'coworkHero':
      return (
        <CoworkHeroEditor
          block={block}
          edits={edits}
          onFieldChange={onFieldChange}
          mediaItems={mediaItems}
        />
      )
    case 'pricingCards':
      return <PricingCardsEditor block={block} edits={edits} onFieldChange={onFieldChange} />
    case 'splitLeadSection':
      return (
        <SplitLeadSectionEditor
          block={block}
          edits={edits}
          onFieldChange={onFieldChange}
          mediaItems={mediaItems}
        />
      )
    default:
      return <p className="text-sm text-muted-foreground">Unknown block type</p>
  }
}

function HeroEditor({
  block,
  edits,
  onFieldChange,
  mediaItems,
}: {
  block: Extract<BlockData, { blockType: 'hero' }>
  edits: Record<string, unknown>
  onFieldChange: (field: string, value: unknown) => void
  mediaItems: Media[]
}) {
  const currentImage = block.image && typeof block.image === 'object' ? block.image : null

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Title</Label>
        <Input
          value={(edits.title as string) ?? block.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Subtitle</Label>
        <Input
          value={(edits.subtitle as string) ?? block.subtitle ?? ''}
          onChange={(e) => onFieldChange('subtitle', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Image</Label>
        {currentImage?.url && !edits.image && (
          <div className="mb-2 overflow-hidden rounded border">
            <img src={currentImage.url} alt={currentImage.alt} className="h-24 w-full object-cover" />
          </div>
        )}
        <Select
          value={String((edits.image as number) ?? (currentImage?.id ?? ''))}
          onValueChange={(val) => onFieldChange('image', Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select image" />
          </SelectTrigger>
          <SelectContent>
            {mediaItems
              .filter((m) => m.mimeType?.startsWith('image/'))
              .map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.filename ?? m.alt}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function InventoryGridEditor({
  block,
  edits,
  onFieldChange,
  categories,
}: {
  block: Extract<BlockData, { blockType: 'inventoryGrid' }>
  edits: Record<string, unknown>
  onFieldChange: (field: string, value: unknown) => void
  categories: Category[]
}) {
  const currentCats = Array.isArray(block.categories) ? block.categories : []
  const selectedIds =
    (edits.categories as number[]) ??
    currentCats.map((c) => (typeof c === 'number' ? c : c.id))

  function toggleCategory(catId: number) {
    const current = [...selectedIds]
    const idx = current.indexOf(catId)
    if (idx >= 0) current.splice(idx, 1)
    else current.push(catId)
    onFieldChange('categories', current)
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Title</Label>
        <Input
          value={(edits.title as string) ?? block.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Categories</Label>
        <div className="max-h-40 space-y-1 overflow-y-auto rounded border p-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted">
              <input
                type="checkbox"
                checked={selectedIds.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="rounded"
              />
              {cat.name}
            </label>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-muted-foreground">No categories available</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ContentBlockEditor({
  block,
  edits,
  onFieldChange,
}: {
  block: Extract<BlockData, { blockType: 'content' }>
  edits: Record<string, unknown>
  onFieldChange: (field: string, value: unknown) => void
}) {
  const plainText =
    edits._richTextPlain !== undefined
      ? (edits._richTextPlain as string)
      : lexicalToPlainText(block.richText)

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Content</Label>
      <Textarea
        rows={8}
        value={plainText}
        onChange={(e) => {
          onFieldChange('_richTextPlain', e.target.value)
          onFieldChange('richText', plainTextToLexical(e.target.value))
        }}
        placeholder="Enter content..."
      />
      <p className="text-xs text-muted-foreground">
        Plain text editing — use Payload Admin for rich formatting.
      </p>
    </div>
  )
}

function CoworkHeroEditor({
  block,
  edits,
  onFieldChange,
  mediaItems,
}: {
  block: Extract<BlockData, { blockType: 'coworkHero' }>
  edits: Record<string, unknown>
  onFieldChange: (field: string, value: unknown) => void
  mediaItems: Media[]
}) {
  const currentImage = block.backgroundImage && typeof block.backgroundImage === 'object'
    ? block.backgroundImage
    : null

  const amenities =
    (edits.amenities as Array<{ icon?: string; label?: string; id?: string }> | undefined) ??
    (block.amenities ?? []).map((item) => ({
      id: item.id ?? crypto.randomUUID(),
      icon: item.icon,
      label: item.label,
    }))

  function updateAmenity(index: number, field: 'icon' | 'label', value: string) {
    const next = [...amenities]
    next[index] = { ...next[index], [field]: value }
    onFieldChange('amenities', next)
  }

  function addAmenity() {
    onFieldChange('amenities', [...amenities, { id: crypto.randomUUID(), icon: 'wifi', label: '' }])
  }

  function removeAmenity(index: number) {
    const next = amenities.filter((_, i) => i !== index)
    onFieldChange('amenities', next)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Over-title</Label>
        <Input
          value={(edits.overTitle as string) ?? block.overTitle}
          onChange={(e) => onFieldChange('overTitle', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Main Title</Label>
        <Input
          value={(edits.title as string) ?? block.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Description</Label>
        <Textarea
          rows={4}
          value={(edits.description as string) ?? block.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Background Image</Label>
        {currentImage?.url && !edits.backgroundImage && (
          <div className="mb-2 overflow-hidden rounded border">
            <img src={currentImage.url} alt={currentImage.alt} className="h-24 w-full object-cover" />
          </div>
        )}
        <Select
          value={String((edits.backgroundImage as number) ?? (currentImage?.id ?? ''))}
          onValueChange={(val) => onFieldChange('backgroundImage', Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select image" />
          </SelectTrigger>
          <SelectContent>
            {mediaItems
              .filter((m) => m.mimeType?.startsWith('image/'))
              .map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.filename ?? m.alt}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Amenities</Label>
          <Button type="button" variant="outline" size="sm" onClick={addAmenity}>
            Add Amenity
          </Button>
        </div>
        {amenities.map((item, index) => (
          <div key={item.id ?? index} className="space-y-2 rounded border p-3">
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={item.icon ?? 'wifi'}
                onValueChange={(val) => updateAmenity(index, 'icon', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wifi">Wifi</SelectItem>
                  <SelectItem value="coffee">Coffee</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="shield">Shield</SelectItem>
                  <SelectItem value="clock">Clock</SelectItem>
                  <SelectItem value="building">Building</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Label"
                value={item.label ?? ''}
                onChange={(e) => updateAmenity(index, 'label', e.target.value)}
              />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeAmenity(index)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PricingCardsEditor({
  block,
  edits,
  onFieldChange,
}: {
  block: Extract<BlockData, { blockType: 'pricingCards' }>
  edits: Record<string, unknown>
  onFieldChange: (field: string, value: unknown) => void
}) {
  const plans =
    (edits.plans as Array<{
      id?: string
      name?: string
      price?: number
      frequency?: string
      isFeatured?: boolean
      features?: Array<{ id?: string; feature?: string }>
    }> | undefined) ??
    (block.plans ?? []).map((plan) => ({
      id: plan.id ?? crypto.randomUUID(),
      name: plan.name,
      price: plan.price,
      frequency: plan.frequency,
      isFeatured: plan.isFeatured,
      features: (plan.features ?? []).map((feature) => ({
        id: feature.id ?? crypto.randomUUID(),
        feature: feature.feature,
      })),
    }))

  function updatePlan(index: number, field: string, value: unknown) {
    const next = [...plans]
    next[index] = { ...next[index], [field]: value }
    onFieldChange('plans', next)
  }

  function addPlan() {
    onFieldChange('plans', [
      ...plans,
      {
        id: crypto.randomUUID(),
        name: '',
        price: 0,
        frequency: '/month',
        isFeatured: false,
        features: [],
      },
    ])
  }

  function removePlan(index: number) {
    onFieldChange('plans', plans.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Over-title</Label>
        <Input
          value={(edits.overTitle as string) ?? block.overTitle ?? ''}
          onChange={(e) => onFieldChange('overTitle', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Section Title</Label>
        <Input
          value={(edits.title as string) ?? block.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
        />
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Plans</Label>
          <Button type="button" variant="outline" size="sm" onClick={addPlan}>
            Add Plan
          </Button>
        </div>
        {plans.map((plan, index) => (
          <div key={plan.id ?? index} className="space-y-2 rounded border p-3">
            <Input
              placeholder="Plan name"
              value={plan.name ?? ''}
              onChange={(e) => updatePlan(index, 'name', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Price"
                value={plan.price ?? 0}
                onChange={(e) => updatePlan(index, 'price', Number(e.target.value))}
              />
              <Input
                placeholder="Frequency (e.g. /month)"
                value={plan.frequency ?? ''}
                onChange={(e) => updatePlan(index, 'frequency', e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(plan.isFeatured)}
                onChange={(e) => updatePlan(index, 'isFeatured', e.target.checked)}
              />
              Featured Plan
            </label>
            <Textarea
              rows={4}
              placeholder="Features (one per line)"
              value={(plan.features ?? []).map((f) => f.feature ?? '').join('\n')}
              onChange={(e) =>
                updatePlan(
                  index,
                  'features',
                  e.target.value
                    .split('\n')
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((feature) => ({ id: crypto.randomUUID(), feature })),
                )
              }
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removePlan(index)}>
              Remove Plan
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SplitLeadSectionEditor({
  block,
  edits,
  onFieldChange,
  mediaItems,
}: {
  block: Extract<BlockData, { blockType: 'splitLeadSection' }>
  edits: Record<string, unknown>
  onFieldChange: (field: string, value: unknown) => void
  mediaItems: Media[]
}) {
  const currentImage = block.image && typeof block.image === 'object' ? block.image : null

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Image</Label>
        {currentImage?.url && !edits.image && (
          <div className="mb-2 overflow-hidden rounded border">
            <img src={currentImage.url} alt={currentImage.alt} className="h-24 w-full object-cover" />
          </div>
        )}
        <Select
          value={String((edits.image as number) ?? (currentImage?.id ?? ''))}
          onValueChange={(val) => onFieldChange('image', Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select image" />
          </SelectTrigger>
          <SelectContent>
            {mediaItems
              .filter((m) => m.mimeType?.startsWith('image/'))
              .map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.filename ?? m.alt}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Over-title</Label>
        <Input
          value={(edits.overTitle as string) ?? block.overTitle ?? ''}
          onChange={(e) => onFieldChange('overTitle', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Title</Label>
        <Input
          value={(edits.title as string) ?? block.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Description</Label>
        <Textarea
          rows={4}
          value={(edits.description as string) ?? block.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Form Title</Label>
          <Input
            value={(edits.formTitle as string) ?? block.formTitle}
            onChange={(e) => onFieldChange('formTitle', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Form Description</Label>
          <Input
            value={(edits.formDescription as string) ?? block.formDescription ?? ''}
            onChange={(e) => onFieldChange('formDescription', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
