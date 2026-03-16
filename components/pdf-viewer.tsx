"use client"

import { pdfjs } from "react-pdf"
import { Document, Page } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { useState } from "react"

// Configure PDF.js worker for browser
const pdfjsVersion = (pdfjs as { version?: string }).version ?? "5.4.296"
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`

type PdfViewerProps = {
  url: string
  className?: string
}

export function PdfViewer({ url, className = "" }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)

  return (
    <div className={`overflow-auto ${className}`}>
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(e) => console.error("PDF load error:", e)}
        loading={
          <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
            Loading PDF…
          </div>
        }
      >
        {numPages != null &&
          Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={800}
              renderTextLayer
              renderAnnotationLayer
              className="mb-4 shadow-sm"
            />
          ))}
      </Document>
    </div>
  )
}
