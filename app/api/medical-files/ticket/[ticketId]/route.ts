import { NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  try {
    const { ticketId } = await params
    const baseUrl = config.medicalFilesBackendUrl

    const url = `${baseUrl.replace(/\/+$/, "")}/files/ticket/${ticketId}`
    const headers: Record<string, string> = {}
    const auth = request.headers.get("authorization") ?? request.headers.get("Authorization")
    if (auth) headers.Authorization = auth

    const resp = await fetch(url, { headers })
    if (!resp.ok) {
      const err = await resp.json().catch(() => null)
      const msg = err?.message || err?.detail || `Failed to fetch files (${resp.status})`
      return NextResponse.json({ message: msg }, { status: resp.status })
    }

    const data = await resp.json()
    return NextResponse.json(Array.isArray(data) ? data : data?.files ?? data ?? [])
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Failed to fetch files" },
      { status: 500 },
    )
  }
}
