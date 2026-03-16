import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const appointments = [
  {
    id: 1,
    patient: "Maria Castillo",
    initials: "MC",
    type: "General Checkup",
    time: "10:00 AM",
    room: "Room 204",
    status: "Confirmed",
    statusColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  {
    id: 2,
    patient: "Jorge Mendez",
    initials: "JM",
    type: "Follow-up Consultation",
    time: "11:30 AM",
    room: "Room 204",
    status: "Confirmed",
    statusColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  {
    id: 3,
    patient: "Ana Rivera",
    initials: "AR",
    type: "Lab Results Review",
    time: "1:00 PM",
    room: "Room 105",
    status: "Pending",
    statusColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  },
  {
    id: 4,
    patient: "Carlos Gutierrez",
    initials: "CG",
    type: "Cardiology Evaluation",
    time: "2:30 PM",
    room: "Room 301",
    status: "Confirmed",
    statusColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  {
    id: 5,
    patient: "Lucia Paredes",
    initials: "LP",
    type: "Prescription Renewal",
    time: "3:45 PM",
    room: "Room 204",
    status: "Pending",
    statusColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  },
]

export function DoctorUpcomingAppointments() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold text-foreground">Upcoming Appointments</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs">
          View all
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-accent/30 transition-colors"
          >
            {/* Patient avatar */}
            <Avatar className="size-10 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {apt.initials}
              </AvatarFallback>
            </Avatar>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground truncate">{apt.patient}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] rounded-full px-2 py-0 shrink-0 ${apt.statusColor}`}
                >
                  {apt.status}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{apt.type}</span>
            </div>

            {/* Time and room */}
            <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
              <span className="text-sm font-semibold text-foreground">{apt.time}</span>
              <span className="text-xs text-muted-foreground">{apt.room}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
