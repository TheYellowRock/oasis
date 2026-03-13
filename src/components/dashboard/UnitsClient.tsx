'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Unit, Category } from '@/payload-types'
import { createUnit, deleteUnit } from '@/actions/units'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'

const statusColors: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  'under-offer': 'bg-amber-100 text-amber-800',
  leased: 'bg-blue-100 text-blue-800',
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

const statusLabels: Record<string, string> = {
  available: 'Available',
  'under-offer': 'Under Offer',
  leased: 'Leased',
}

interface Props {
  initialUnits: Unit[]
  categories: Category[]
}

export function UnitsClient({ initialUnits, categories }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleCreate(formData: FormData) {
    setLoading(true)
    try {
      await createUnit(formData)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this unit?')) return
    await deleteUnit(id)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Units</h1>
          <p className="text-sm text-muted-foreground">Manage commercial units inventory</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Unit</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitNumber">Unit #</Label>
                  <Input id="unitNumber" name="unitNumber" required placeholder="e.g. A-101" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue="available">
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
                  <Label htmlFor="sqFt">Sq Ft</Label>
                  <Input id="sqFt" name="sqFt" type="number" placeholder="1200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leaseType">Lease Type</Label>
                  <Select name="leaseType" required defaultValue="nnn">
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
                <div className="space-y-2">
                  <Label htmlFor="building">Building</Label>
                  <Select name="building" required defaultValue="building-a">
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceAmount">Monthly Rent</Label>
                <Input id="priceAmount" name="priceAmount" type="number" required placeholder="2500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediaFiles">Media</Label>
                <Input id="mediaFiles" name="mediaFiles" type="file" accept="image/*" multiple />
                <p className="text-xs text-muted-foreground">
                  Upload one or more images. They will be linked to this unit automatically.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Unit'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit #</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lease</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Sq Ft</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  No units yet. Add your first unit to get started.
                </TableCell>
              </TableRow>
            ) : (
              initialUnits.map((unit) => (
                <TableRow
                  key={unit.id}
                  onClick={() => router.push(`/dashboard/units/${unit.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                  <TableCell>
                    {typeof unit.type === 'object' && unit.type ? unit.type.name : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[unit.status ?? ''] ?? ''}>
                      {statusLabels[unit.status ?? ''] ?? unit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{leaseTypeLabels[unit.leaseType ?? ''] ?? '—'}</TableCell>
                  <TableCell>{buildingLabels[unit.building ?? ''] ?? '—'}</TableCell>
                  <TableCell>{unit.sqFt ? `${unit.sqFt.toLocaleString()} sqft` : '—'}</TableCell>
                  <TableCell>
                    {unit.price?.amount
                      ? `$${unit.price.amount.toLocaleString()}/mo`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleDelete(unit.id)
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
