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
  // Example: forward to an external service when env var is set.
  // You can remove this and implement your own persistence logic.
  const externalUrl = process.env.TICKET_SERVICE_URL

  if (externalUrl) {
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) {
      headers.Authorization = token
    }

    const resp = await fetch(externalUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(ticket),
    })

    if (!resp.ok) {
      const err = await resp.json().catch(() => null)
      throw new Error(err?.message || `Remote service returned ${resp.status}`)
    }

    return (await resp.json()) as Ticket
  }

  // Default in-memory fallback for local development.
  // Replace with DB insert logic (Prisma, Sequelize, Mongo, etc.).
  return {
    id: Math.random().toString(16).slice(2),
    createdAt: new Date().toISOString(),
    ...ticket,
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

    return NextResponse.json({ success: true, ticket }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
