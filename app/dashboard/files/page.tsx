"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { deletePdfFile, getPdfBlob, listPdfFiles, savePdfFile, type StoredPdfFile } from "@/lib/pdf-files-db"

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

export default function FilesPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [files, setFiles] = useState<StoredPdfFile[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selected = useMemo(
    () => files.find((f) => f.id === selectedId) ?? null,
    [files, selectedId],
  )

  async function refresh() {
    setLoading(true)
    try {
      const list = await listPdfFiles()
      setFiles(list)
      if (list.length > 0 && !selectedId) setSelectedId(list[0]!.id)
      if (list.length === 0) setSelectedId(null)
    } catch (e: any) {
      setError(e?.message || "Unable to load files.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let revokedUrl: string | null = null
    setError(null)

    async function loadPreview() {
      if (!selectedId) {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        return
      }
      const blob = await getPdfBlob(selectedId)
      if (!blob) {
        setPreviewUrl(null)
        return
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      const url = URL.createObjectURL(blob)
      revokedUrl = url
      setPreviewUrl(url)
    }

    loadPreview().catch((e: any) => setError(e?.message || "Unable to preview file."))

    return () => {
      if (revokedUrl) URL.revokeObjectURL(revokedUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  async function onUpload(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const input = fileInputRef.current
    const file = input?.files?.[0]
    if (!file) {
      setError("Please choose a PDF file.")
      return
    }

    try {
      await savePdfFile(file)
      if (input) input.value = ""
      await refresh()
    } catch (err: any) {
      setError(err?.message || "Unable to upload file.")
    }
  }

  async function onDelete(id: string) {
    setError(null)
    setBusyId(id)
    try {
      await deletePdfFile(id)
      if (selectedId === id) {
        setSelectedId(null)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      await refresh()
    } catch (err: any) {
      setError(err?.message || "Unable to delete file.")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          My Files
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload PDF documents and view what you’ve uploaded.
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-foreground">
            Upload PDF
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onUpload} className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="pdf">Choose a PDF</Label>
              <Input
                ref={fileInputRef}
                id="pdf"
                type="file"
                accept="application/pdf"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Stored locally in your browser (IndexedDB).
              </p>
            </div>
            <Button type="submit" size="lg" className="h-11 rounded-xl">
              Upload
            </Button>
          </form>
          {error && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selected && (
              <div className="text-sm text-muted-foreground">
                Select a file to preview.
              </div>
            )}

            {selected && !previewUrl && (
              <div className="text-sm text-muted-foreground">
                Loading preview…
              </div>
            )}

            {selected && previewUrl && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{selected.name}</div>
                    <div className="text-xs text-muted-foreground">{formatBytes(selected.size)}</div>
                  </div>
                  <Button asChild variant="outline" className="rounded-xl">
                    <a href={previewUrl} download={selected.name}>
                      Download
                    </a>
                  </Button>
                </div>

                <div className="rounded-xl border border-border overflow-hidden bg-muted/20">
                  <iframe
                    title="PDF preview"
                    src={previewUrl}
                    className="w-full h-[70vh] bg-background"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

