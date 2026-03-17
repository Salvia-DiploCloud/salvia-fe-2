import { NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId } = await params
    const baseUrl = config.medicalFilesBackendUrl

    const encodedId = encodeURIComponent(fileId)
    const url = `${baseUrl.replace(/\/+$/, "")}/files/download/${encodedId}`
    const headers: Record<string, string> = {}
    const auth = request.headers.get("authorization") ?? request.headers.get("Authorization")
    if (auth) headers.Authorization = auth

    const resp = await fetch(url, { headers })
    if (!resp.ok) {
      const err = await resp.json().catch(() => null)
      const msg = err?.message || err?.detail || `Download failed (${resp.status})`
      return NextResponse.json({ message: msg }, { status: resp.status })
    }

    const ct = resp.headers.get("content-type") || ""
    // Backend returns JSON with presigned URL when using S3
    if (ct.includes("application/json")) {
      const data = (await resp.json()) as { download_url?: string }
      const downloadUrl = data?.download_url
      if (!downloadUrl || typeof downloadUrl !== "string") {
        return NextResponse.json({ message: "Invalid download response" }, { status: 502 })
      }
      const fileResp = await fetch(downloadUrl)
      if (!fileResp.ok) {
        return NextResponse.json({ message: `Failed to fetch file (${fileResp.status})` }, { status: 502 })
      }
      const blob = await fileResp.blob()
      const fileCt = fileResp.headers.get("content-type") || "application/octet-stream"
      return new NextResponse(blob, {
        headers: {
          "Content-Type": fileCt,
          "Content-Disposition": fileResp.headers.get("content-disposition") || "inline",
        },
      })
    }

    // Direct file response (e.g. local storage)
    const blob = await resp.blob()
    const contentType = ct || "application/octet-stream"
    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": resp.headers.get("content-disposition") || "inline",
      },
    })
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Download failed" },
      { status: 500 },
    )
  }
}
