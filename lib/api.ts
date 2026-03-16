import { getCurrentUserToken } from "./cognito"

const API_KEY = process.env.NEXT_PUBLIC_API_KEY

// Proxy: browser llama a /api/tickets (mismo origen), Next.js reenvía al ALB (sin CORS)
function getTicketsUrl(path: string): string {
  if (typeof window !== "undefined") {
    const p = path.replace(/^\/?v1\//, "")
    return `/api/${p}`
  }
  const base = process.env.TICKETS_BACKEND_URL ?? ""
  if (!base) throw new Error("Missing TICKETS_BACKEND_URL")
  return `${base.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`
}

async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = await getCurrentUserToken()

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (API_KEY) {
    headers["x-api-key"] = API_KEY
  }

  return fetch(input, { ...init, headers })
}

export type TicketPayload = {
  title: string
  description: string
  category: string
  priority: string
}

export type Ticket = TicketPayload & {
  id: string
  createdAt: string
}

export async function getAllTickets(): Promise<Ticket[]> {
  const response = await fetchWithAuth(getTicketsUrl("/v1/tickets"), { method: "GET" })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    const msg = error?.message || `Failed to fetch tickets (${response.status})`
    throw new Error(msg) as Error & { status?: number }
  }
  return (await response.json()) as Ticket[]
}

export async function createTicket(payload: TicketPayload): Promise<Ticket> {
  const response = await fetchWithAuth(getTicketsUrl("/v1/tickets"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    const msg = error?.message || `Failed to create ticket (${response.status})`
    const err = new Error(msg) as Error & { status?: number }
    err.status = response.status
    throw err
  }

  return (await response.json()) as Ticket
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (!error) return fallback
  if (typeof error === "string") return error
  if (Array.isArray(error) && error[0]) {
    return (error[0] as { msg?: string }).msg ?? fallback
  }
  return (error as { message?: string })?.message ?? fallback
}

export async function uploadTicketFile(ticketId: string, file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetchWithAuth(getTicketsUrl(`/v1/tickets/${ticketId}/files`), {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(getErrorMessage(error, `Failed to upload file (${response.status})`))
  }

  return response.json()
}

export type TicketFile = {
  id: string
  /** Full S3 path for download (ticket_id/filename) - use when backend expects it */
  path?: string
  name?: string
  filename?: string
  size?: number
  content_type?: string
  uploaded_at?: string
}

const MIME_TO_EXT: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
}

function ensureExtension(name: string, contentType?: string): string {
  if (/\.\w+$/.test(name)) return name
  const ext = contentType ? MIME_TO_EXT[contentType.split(";")[0]?.trim() || ""] : ""
  return ext ? `${name}${ext}` : name
}

function normalizeFile(raw: Record<string, unknown>, index: number, ticketId?: string): TicketFile {
  const id = (raw.id ?? raw.file_id ?? raw._id ?? `file-${index}`) as string
  const name = (raw.name ?? raw.filename ?? raw.original_filename ?? raw.original_name ?? raw.filename_original) as string | undefined
  const contentType = (raw.content_type ?? raw.mime_type) as string | undefined
  const s3Path = (raw.path ?? raw.s3_key ?? raw.key ?? raw.storage_path) as string | undefined
  const filename = ensureExtension((raw.filename ?? raw.filename_storage ?? raw.name ?? raw.filename_original ?? name ?? id) as string, contentType)
  const path =
    s3Path ??
    (ticketId && filename ? `${ticketId}/${filename}`.replace(/\/\/+/g, "/") : undefined) ??
    (ticketId && !id.includes("/") ? `${ticketId}/${ensureExtension(id, contentType)}` : undefined)
  return {
    id,
    path,
    name,
    filename: (raw.filename ?? raw.name ?? name) as string | undefined,
    size: (raw.size ?? raw.file_size) as number | undefined,
    content_type: (raw.content_type ?? raw.mime_type) as string | undefined,
    uploaded_at: (raw.uploaded_at ?? raw.created_at) as string | undefined,
  }
}

export async function getTicketFiles(ticketId: string): Promise<TicketFile[]> {
  const response = await fetchWithAuth(`/api/medical-files/ticket/${ticketId}`, { method: "GET" })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(getErrorMessage(error, `Failed to fetch files (${response.status})`))
  }
  const data = await response.json()
  const arr = Array.isArray(data) ? data : data?.files ?? []
  return arr.map((item: Record<string, unknown>, i: number) => normalizeFile(item, i, ticketId))
}

export function getDownloadFilename(file: TicketFile, blob?: Blob): string {
  let name = file.name || file.filename || "download"
  if (!/\.\w+$/.test(name)) {
    const raw = file.content_type || blob?.type || ""
    const mime = raw.split(";")[0]?.trim() || ""
    const ext = MIME_TO_EXT[mime] || ""
    if (ext) name += ext
  }
  return name
}

export async function getFileBlob(fileId: string): Promise<Blob> {
  const encodedId = encodeURIComponent(fileId)
  const response = await fetchWithAuth(`/api/medical-files/download/${encodedId}`, { method: "GET" })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(getErrorMessage(error, `Failed to download file (${response.status})`))
  }
  const blob = await response.blob()
  const ct = response.headers.get("content-type") || blob.type
  if (ct?.includes("application/json")) {
    const text = await blob.text()
    try {
      const parsed = JSON.parse(text) as { message?: string; detail?: string }
      throw new Error(parsed?.message || parsed?.detail || "Server returned JSON instead of file")
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error("Server returned invalid response")
      throw e
    }
  }
  return blob
}
