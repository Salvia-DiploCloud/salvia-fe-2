"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getAllTickets,
  getDownloadFilename,
  getFileBlob,
  getTicketFiles,
  uploadTicketFile,
  type Ticket,
  type TicketFile,
} from "@/lib/api"

const PdfViewer = dynamic(() => import("@/components/pdf-viewer").then((m) => m.PdfViewer), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
      Loading PDF viewer…
    </div>
  ),
})

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"]

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export default function FilesPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string>("")
  const [files, setFiles] = useState<TicketFile[]>([])
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [filesLoading, setFilesLoading] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const loadTickets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await getAllTickets()
      setTickets(list)
      if (list.length > 0 && !selectedTicketId) {
        setSelectedTicketId(list[0]!.id)
      }
    } catch (e: unknown) {
      setError((e as Error)?.message || "Unable to load tickets.")
    } finally {
      setLoading(false)
    }
  }, [selectedTicketId])

  const loadFiles = useCallback(async (ticketId: string) => {
    if (!ticketId) {
      setFiles([])
      setSelectedFileId(null)
      setPreviewUrl(null)
      return
    }
    setFilesLoading(true)
    setError(null)
    try {
      const list = await getTicketFiles(ticketId)
      setFiles(list)
      setSelectedFileId(null)
      setPreviewUrl(null)
    } catch (e: unknown) {
      setError((e as Error)?.message || "Unable to load files.")
      setFiles([])
    } finally {
      setFilesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedTicketId) {
      loadFiles(selectedTicketId)
    } else {
      setFiles([])
      setSelectedFileId(null)
      setPreviewUrl(null)
    }
  }, [selectedTicketId, loadFiles])

  useEffect(() => {
    let revokedUrl: string | null = null

    async function loadPreview() {
      if (!selectedFileId) {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        return
      }
      const file = files.find((f) => f.id === selectedFileId)
      // Backend expects file_id (UUID), not S3 path
      const downloadKey = file?.id ?? selectedFileId
      setPreviewLoading(true)
      try {
        const blob = await getFileBlob(downloadKey)
        if (revokedUrl) URL.revokeObjectURL(revokedUrl)
        const url = URL.createObjectURL(blob)
        revokedUrl = url
        setPreviewUrl(url)
      } catch (e: unknown) {
        setError((e as Error)?.message || "Unable to load preview.")
        setPreviewUrl(null)
      } finally {
        setPreviewLoading(false)
      }
    }

    loadPreview()
    return () => {
      if (revokedUrl) URL.revokeObjectURL(revokedUrl)
    }
  }, [selectedFileId, files])

  async function onUpload(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!selectedTicketId) {
      setError("Please select a ticket.")
      return
    }

    const input = fileInputRef.current
    const file = input?.files?.[0]
    if (!file) {
      setError("Please choose a file.")
      return
    }

    setUploading(true)
    try {
      await uploadTicketFile(selectedTicketId, file)
      setSuccess(`File "${file.name}" uploaded successfully.`)
      if (input) input.value = ""
      setSelectedFileName(null)
      await loadFiles(selectedTicketId)
    } catch (err: unknown) {
      setError((err as Error)?.message || "Unable to upload file.")
    } finally {
      setUploading(false)
    }
  }

  async function handleDownload(file: TicketFile) {
    try {
      // Backend expects file_id (UUID), not S3 path
      const downloadKey = file.id
      const blob = await getFileBlob(downloadKey)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = getDownloadFilename(file, blob)
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: unknown) {
      setError((e as Error)?.message || "Download failed")
    }
  }

  const selectedFile = files.find((f) => f.id === selectedFileId)
  const isImage = selectedFile?.content_type
    ? IMAGE_TYPES.includes(selectedFile.content_type)
    : (selectedFile?.name || selectedFile?.filename || "").match(/\.(png|jpe?g|gif|webp|svg)$/i)
  const isPdf = selectedFile?.content_type === "application/pdf" ||
    (selectedFile?.name || selectedFile?.filename || "").toLowerCase().endsWith(".pdf")

  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          My Files
        </h1>
        <p className="text-sm text-muted-foreground">
          Select a ticket, upload documents, and preview or download them.
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-foreground">
            Upload File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onUpload} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ticket">Ticket</Label>
              <Select
                value={selectedTicketId}
                onValueChange={setSelectedTicketId}
                disabled={loading}
              >
                <SelectTrigger id="ticket" className="h-11 rounded-xl w-full sm:max-w-md">
                  <SelectValue placeholder={loading ? "Loading tickets…" : "Select a ticket"} />
                </SelectTrigger>
                <SelectContent>
                  {tickets.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title} {t.category && `(${t.category})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="file">Document</Label>
              <input
                ref={fileInputRef}
                id="file"
                type="file"
                accept="application/pdf,image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  setSelectedFileName(f?.name ?? null)
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file && fileInputRef.current) {
                    const dt = new DataTransfer()
                    dt.items.add(file)
                    fileInputRef.current.files = dt.files
                    setSelectedFileName(file.name)
                  }
                }}
                className={`
                  relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10
                  transition-all duration-200 cursor-pointer
                  hover:border-primary hover:bg-primary/5
                  ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/30"}
                  ${selectedFileName ? "border-primary/50 bg-primary/5" : ""}
                `}
              >
                <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-7">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    {selectedFileName ? selectedFileName : "Click or drag file here"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {selectedFileName ? "Click to change" : "PDF or images (PNG, JPG, etc.)"}
                  </p>
                </div>
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-xl w-full sm:w-auto"
              disabled={uploading || !selectedTicketId || loading}
            >
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-3 text-sm text-green-600 dark:text-green-400" role="status">
              {success}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-foreground">
            Files & Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!selectedTicketId ? (
            <p className="text-sm text-muted-foreground">Select a ticket to view its files.</p>
          ) : filesLoading ? (
            <p className="text-sm text-muted-foreground">Loading files…</p>
          ) : files.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files for this ticket yet.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">Files</Label>
                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto rounded-lg border border-border p-2">
                  {files.map((f, i) => (
                    <button
                      key={f.id ?? `file-${i}`}
                      type="button"
                      onClick={() => setSelectedFileId(f.id)}
                      className={`text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                        selectedFileId === f.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted"
                      }`}
                    >
                      {f.name || f.filename || f.id}
                      {f.size != null && (
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {formatBytes(f.size)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Preview</Label>
                  {selectedFile && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => handleDownload(selectedFile)}
                    >
                      Download
                    </Button>
                  )}
                </div>
                <div className="rounded-xl border border-border overflow-hidden bg-muted/20 min-h-[300px] flex items-center justify-center">
                  {!selectedFileId && (
                    <p className="text-sm text-muted-foreground">Select a file to preview.</p>
                  )}
                  {selectedFileId && previewLoading && (
                    <p className="text-sm text-muted-foreground">Loading preview…</p>
                  )}
                  {selectedFileId && previewUrl && !previewLoading && (
                    <>
                      {isImage && (
                        <img
                          src={previewUrl}
                          alt={selectedFile?.name || selectedFile?.filename || "Preview"}
                          className="max-w-full max-h-[70vh] object-contain"
                        />
                      )}
                      {isPdf && (
                        <PdfViewer
                          url={previewUrl}
                          className="w-full min-h-[70vh] max-h-[70vh] bg-background"
                        />
                      )}
                      {!isImage && !isPdf && (
                        <div className="flex flex-col items-center gap-3 p-6">
                          <p className="text-sm text-muted-foreground">
                            Preview not available for this file type.
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => selectedFile && handleDownload(selectedFile)}
                          >
                            Download
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
