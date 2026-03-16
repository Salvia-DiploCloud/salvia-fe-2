import { DoctorSummaryCards } from "@/components/doctor-summary-cards"
import { DoctorCalendarPreview } from "@/components/doctor-calendar-preview"
import { DoctorUpcomingAppointments } from "@/components/doctor-upcoming-appointments"
import { DoctorTicketPriority } from "@/components/doctor-ticket-priority"

export default function DoctorDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      {/* Welcome header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          {"Good morning, Dr. Alvarez"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {"Here\u2019s your schedule and pending tasks for today."}
        </p>
      </div>

      {/* Summary cards */}
      <DoctorSummaryCards />

      {/* Calendar + Appointments row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <DoctorCalendarPreview />
        </div>
        <div className="lg:col-span-3">
          <DoctorUpcomingAppointments />
        </div>
      </div>

      {/* Ticket priority section */}
      <DoctorTicketPriority />
    </div>
  )
}
