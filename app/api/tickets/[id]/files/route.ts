import { NextResponse } from "next/server"

function getSubFromJwt(token: string): string | null {
  try {
    const bearer = token.replace(/^Bearer\s+/i, "").trim()
    const parts = bearer.split(".")
    if (parts.length < 2) return null
    const payload = JSON.parse(Buffer.from(parts[1]!, "base64url").toString())
    return payload.sub ?? null
  } catch {
    return null
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: ticketId } = await params

    const formData = await request.formData()
    const file = formData.get("file") as unknown

    if (!file || typeof (file as File)?.name !== "string") {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 })
    }

    const baseUrl = process.env.MEDICAL_FILES_BACKEND_URL
    if (baseUrl) {
      const uploadUrl = `${baseUrl.replace(/\/+$/, "")}/upload/${ticketId}`
      const headers: Record<string, string> = {}
      const auth = request.headers.get("authorization") ?? request.headers.get("Authorization")
      if (auth) {
        headers.Authorization = auth
        const userId = getSubFromJwt(auth)
        if (userId) headers["X-User-ID"] = userId
      }

      const backendFormData = new FormData()
      backendFormData.append("file", file as File)

      const resp = await fetch(uploadUrl, {
        method: "POST",
        headers,
        body: backendFormData,
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => null)
        const msg =
          (Array.isArray(err) ? err[0]?.msg : err?.message ?? err?.detail) ||
          (typeof err === "string" ? err : `Upload failed (${resp.status})`)
        return NextResponse.json({ message: msg }, { status: resp.status })
      }

      const result = await resp.json().catch(() => ({}))
      return NextResponse.json(result, { status: resp.status >= 200 && resp.status < 300 ? 201 : resp.status })
    }

    // Fallback: mock response when no backend configured
    const uploadedFileData = file as { name: string; size: number; type: string }
    console.log(`[api/tickets/files] Mock upload for ticket ${ticketId}:`, uploadedFileData.name)
    return NextResponse.json(
      { success: true, file: { ticketId, name: uploadedFileData.name, size: uploadedFileData.size, type: uploadedFileData.type, uploadedAt: new Date().toISOString() } },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
