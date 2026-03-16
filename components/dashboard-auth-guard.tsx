"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUserToken } from "@/lib/cognito"

export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    getCurrentUserToken()
      .then((token) => {
        if (!token) {
          router.replace("/")
          return
        }
        setReady(true)
      })
      .catch(() => {
        router.replace("/")
      })
  }, [router, pathname])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
