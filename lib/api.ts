import { getCurrentUserToken } from "./cognito"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

function normalizeUrl(base: string, path: string) {
  const trimmedBase = base.replace(/\/+$/, "")
  const trimmedPath = path.replace(/^\/+/, "")
  return `${trimmedBase}/${trimmedPath}`
}

function getGatewayUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error("Missing environment variable NEXT_PUBLIC_API_BASE_URL")
  }
  return normalizeUrl(API_BASE_URL, path)
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

export async function createTicket(payload: TicketPayload): Promise<Ticket> {
  const response = await fetchWithAuth(getGatewayUrl("/tickets"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || `Failed to create ticket (${response.status})`)
  }

  return (await response.json()) as Ticket
}

export async function uploadTicketFile(ticketId: string, file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetchWithAuth(getGatewayUrl(`/tickets/${ticketId}/files`), {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || `Failed to upload file (${response.status})`)
  }

  return response.json()
}
