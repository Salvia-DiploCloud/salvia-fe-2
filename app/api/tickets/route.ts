import { NextResponse } from "next/server"

/**
 * Ticket payload posted from the frontend.
 */
export type TicketPayload = {
  title: string
  description: string
  category: string
  priority: string
}

/**
 * The shape of a ticket returned by the backend.
 */
export type Ticket = TicketPayload & {
  id: string
  createdAt: string
}

/**
 * Persist a ticket to a real backend.
 *
 * Replace the implementation of this function to integrate with your database,
 * external API, or any other persistence layer.
 */
async function saveTicket(ticket: TicketPayload, token?: string): Promise<Ticket> {
  const baseUrl = process.env.TICKETS_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.TICKET_SERVICE_URL
  const apiUrl = baseUrl ? `${baseUrl.replace(/\/+$/, "")}/v1/tickets` : null

  if (apiUrl) {
    console.log("[api/tickets] Forwarding to:", apiUrl)
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) {
      headers.Authorization = token
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)

    let resp: Response
    try {
      resp = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(ticket),
        signal: controller.signal,
      })
    } catch (fetchErr) {
      clearTimeout(timeoutId)
      const isTimeout = (fetchErr as Error).name === "AbortError"
      console.error("[api/tickets] Fetch failed:", apiUrl, isTimeout ? "TIMEOUT" : (fetchErr as Error).message)
      const err = new Error(isTimeout ? "Backend timeout (60s). Check if ALB is reachable from this server." : (fetchErr as Error).message) as Error & { status?: number }
      err.status = 504
      throw err
    }
    clearTimeout(timeoutId)

    if (!resp.ok) {
      const err = await resp.json().catch(() => null)
      const msg = err?.message || err?.error || (typeof err === "string" ? err : JSON.stringify(err)) || `API returned ${resp.status}`
      const errWithStatus = new Error(msg) as Error & { status?: number; body?: unknown }
      errWithStatus.status = resp.status
      errWithStatus.body = err
      throw errWithStatus
    }

    return (await resp.json()) as Ticket
  }

  return {
    id: Math.random().toString(16).slice(2),
    createdAt: new Date().toISOString(),
    ...ticket,
  }
}

async function fetchTickets(token?: string): Promise<Ticket[]> {
  const baseUrl = process.env.TICKETS_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.TICKET_SERVICE_URL
  const apiUrl = baseUrl ? `${baseUrl.replace(/\/+$/, "")}/v1/tickets` : null

  if (!apiUrl) {
    return []
  }

  const headers: Record<string, string> = {}
  if (token) headers.Authorization = token

  const resp = await fetch(apiUrl, { headers })
  if (!resp.ok) {
    const err = await resp.json().catch(() => null)
    const msg = err?.message || err?.error || `API returned ${resp.status}`
    throw new Error(msg) as Error & { status?: number }
  }
  return (await resp.json()) as Ticket[]
}

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization") ?? request.headers.get("Authorization")
    const tickets = await fetchTickets(authorization ?? undefined)
    return NextResponse.json(tickets)
  } catch (error) {
    const err = error as Error & { status?: number }
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500
    return NextResponse.json({ message: err.message || "Failed to fetch tickets" }, { status })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<TicketPayload>

    const { title, description, category, priority } = body || {}

    if (!title || !description || !category || !priority) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: title, description, category, and priority are required.",
        },
        { status: 400 },
      )
    }

    const authorization = request.headers.get("authorization") ?? request.headers.get("Authorization")
    const ticket = await saveTicket({ title, description, category, priority }, authorization ?? undefined)

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    const err = error as Error & { status?: number; body?: unknown }
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500
    const message = err.message || "An unexpected error occurred"
    console.error("[api/tickets] Error:", status, message, err.body)
    return NextResponse.json(
      { message, details: err.body },
      { status },
    )
  }
}
