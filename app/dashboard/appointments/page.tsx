import { ScheduleAppointmentForm } from "@/components/schedule-appointment-form"

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Create Ticket
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in the ticket details and submit your request to the backend.
        </p>
      </div>

      {/* Form */}
      <ScheduleAppointmentForm />
    </div>
  )
}
