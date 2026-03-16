"use client"

import { useEffect, useState } from "react"
import { DashboardSummaryCards } from "@/components/dashboard-summary-cards"
import { DashboardNextAppointment } from "@/components/dashboard-next-appointment"
import { DashboardLatestTickets } from "@/components/dashboard-latest-tickets"
import { getCurrentUserProfile } from "@/lib/cognito"

export default function DashboardPage() {
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    getCurrentUserProfile()
      .then((profile) => {
        if (profile?.name) {
          setUserName(profile.name)
        }
      })
      .catch(() => {
        // ignore errors, fall back to generic title
      })
  }, [])

  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      {/* Welcome header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          {userName ? `Welcome back, ${userName}` : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {"Here\u2019s a summary of your health activity."}
        </p>
      </div>

      {/* Summary cards */}
      <DashboardSummaryCards />

      {/* Detail sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardNextAppointment />
        <DashboardLatestTickets />
      </div>
    </div>
  )
}
