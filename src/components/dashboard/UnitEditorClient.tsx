'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category, Media, Unit } from '@/payload-types'
import { deleteUnit, updateUnit, uploadMediaAndLink } from '@/actions/units'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Trash2, Upload } from 'lucide-react'

const statusLabels: Record<string, string> = {
  available: 'Available',
  'under-offer': 'Under Offer',
  leased: 'Leased',
}

const leaseTypeLabels: Record<string, string> = {
  nnn: 'NNN',
  'full-service': 'Full Service',
  'modified-gross': 'Modified Gross',
}

const buildingLabels: Record<string, string> = {
  'building-a': 'Building A',
  'building-b': 'Building B',
  annex: 'Annex',
}

interface Props {
  unit: Unit
  categories: Category[]
}

type AttachedMedia = Pick<Media, 'id' | 'url' | 'alt' | 'filename'>

export function UnitEditorClient({ unit, categories }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [media, setMedia] = useState<AttachedMedia[]>(() => {
    const source = Array.isArray(unit.media) ? unit.media : []
    return source
      .filter((item): item is Media => typeof item === 'object' && item !== null)
      .map((item) => ({
        id: item.id,
        url: item.url,
        alt: item.alt,
        filename: item.filename,
      }))
  })

  const mediaIds = useMemo(() => media.map((item) => item.id), [media])

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.set('file', file)
        formData.set('alt', file.name.replace(/\.[^.]+$/, ''))
        const uploaded = await uploadMediaAndLink(formData)
        setMedia((prev) => [
          ...prev,
          {
            id: uploaded.id,
            url: uploaded.url ?? null,
            alt: uploaded.alt ?? file.name,
            filename: file.name,
          },
        ])
      }
    } finally {
      setUploading(false)
    }
  }

  function removeMedia(id: number) {
    setMedia((prev) => prev.filter((item) => item.id !== id))
  }

  async function handleSave(formData: FormData) {
    setSaving(true)
    try {
      formData.set('mediaIds', mediaIds.join(','))
      await updateUnit(unit.id, formData)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteUnit(unit.id)
      router.push('/dashboard/units')
      router.refresh()
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => router.push('/dashboard/units')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Units
          </Button>
          <h1 className="text-2xl font-bold">Edit Unit #{unit.unitNumber}</h1>
        </div>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this unit?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone and will permanently remove Unit #{unit.unitNumber}.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <form action={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unitNumber">Unit #</Label>
              <Input id="unitNumber" name="unitNumber" defaultValue={unit.unitNumber} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={unit.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Category</Label>
              <Select
                name="type"
                defaultValue={
                  typeof unit.type === 'object' && unit.type
                    ? String(unit.type.id)
                    : String(unit.type)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Select name="building" defaultValue={unit.building}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(buildingLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leasing Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sqFt">Sq Ft</Label>
              <Input id="sqFt" name="sqFt" type="number" defaultValue={unit.sqFt ?? undefined} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceAmount">Price (Monthly)</Label>
              <Input
                id="priceAmount"
                name="priceAmount"
                type="number"
                defaultValue={unit.price?.amount ?? undefined}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leaseType">Lease Type</Label>
              <Select name="leaseType" defaultValue={unit.leaseType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(leaseTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="rounded-lg border-2 border-dashed p-6 text-center"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                handleUpload(event.dataTransfer.files)
              }}
            >
              <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium">
                {uploading ? 'Uploading...' : 'Drag and drop images, or click to upload'}
              </p>
              <Input
                name="mediaFiles"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => handleUpload(event.target.files)}
                className="mt-3"
              />
            </div>

            {media.length === 0 ? (
              <p className="text-sm text-muted-foreground">No images attached.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {media.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-md border">
                    {item.url ? (
                      <img src={item.url} alt={item.alt || 'Unit media'} className="h-32 w-full object-cover" />
                    ) : (
                      <div className="flex h-32 items-center justify-center bg-muted text-xs text-muted-foreground">
                        Media #{item.id}
                      </div>
                    )}
                    <div className="flex items-center justify-between p-2">
                      <p className="truncate text-xs text-muted-foreground">{item.filename ?? item.alt}</p>
                      <Button type="button" size="sm" variant="ghost" onClick={() => removeMedia(item.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving || uploading}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
