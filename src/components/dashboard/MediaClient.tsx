'use client'

import { useState, useRef, useCallback } from 'react'
import type { Media } from '@/payload-types'
import { uploadMedia, deleteMedia } from '@/actions/media'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, Trash2, FileImage } from 'lucide-react'

interface Props {
  initialMedia: Media[]
}

export function MediaClient({ initialMedia }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.set('file', file)
        formData.set('alt', file.name.replace(/\.[^.]+$/, ''))
        await uploadMedia(formData)
      }
    } finally {
      setUploading(false)
    }
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this media item?')) return
    await deleteMedia(id)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Media</h1>
        <p className="text-sm text-muted-foreground">Upload and manage images and files</p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <Upload className={`mb-3 h-10 w-10 ${dragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-sm font-medium">
          {uploading ? 'Uploading...' : 'Drag & drop files here, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Images and PDFs accepted</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {initialMedia.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No media uploaded yet. Drag files above to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {initialMedia.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden">
              {item.mimeType?.startsWith('image/') && item.url ? (
                <img
                  src={item.url}
                  alt={item.alt}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-muted">
                  <FileImage className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex w-full items-center justify-between p-3">
                  <span className="truncate text-sm font-medium text-white">{item.filename}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="shrink-0 text-white hover:bg-white/20 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
