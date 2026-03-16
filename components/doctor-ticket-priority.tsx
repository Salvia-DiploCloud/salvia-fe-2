import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const tickets = [
  {
    id: "TK-1050",
    patient: "Ana Rivera",
    subject: "Abnormal lab results - urgent review needed",
    priority: "High",
    priorityColor: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    dotColor: "bg-rose-500",
    date: "Feb 16, 2026",
    status: "Open",
  },
  {
    id: "TK-1048",
    patient: "Carlos Gutierrez",
    subject: "Post-surgery follow-up questions",
    priority: "High",
    priorityColor: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    dotColor: "bg-rose-500",
    date: "Feb 15, 2026",
    status: "Open",
  },
  {
    id: "TK-1045",
    patient: "Maria Castillo",
    subject: "Prescription renewal request - Metformin 500mg",
    priority: "Medium",
    priorityColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    dotColor: "bg-amber-500",
    date: "Feb 14, 2026",
    status: "In Progress",
  },
  {
    id: "TK-1042",
    patient: "Jorge Mendez",
    subject: "Insurance pre-authorization for MRI",
    priority: "Medium",
    priorityColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    dotColor: "bg-amber-500",
    date: "Feb 13, 2026",
    status: "In Progress",
  },
  {
    id: "TK-1039",
    patient: "Lucia Paredes",
    subject: "Referral request to dermatology",
    priority: "Low",
    priorityColor: "bg-primary/10 text-primary border-primary/20",
    dotColor: "bg-primary",
    date: "Feb 12, 2026",
    status: "Open",
  },
]

export function DoctorTicketPriority() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold text-foreground">Tickets by Priority</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs">
          View all
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex flex-col gap-2.5 rounded-xl border border-border p-4 hover:bg-accent/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`size-2 rounded-full shrink-0 ${ticket.dotColor}`} />
                <span className="text-xs font-mono text-muted-foreground shrink-0">{ticket.id}</span>
                <span className="font-medium text-sm text-foreground truncate">{ticket.patient}</span>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] rounded-full px-2 py-0 shrink-0 ${ticket.priorityColor}`}
              >
                {ticket.priority}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 pl-[18px]">{ticket.subject}</p>
            <div className="flex items-center justify-between pl-[18px]">
              <span className="text-[10px] text-muted-foreground">{ticket.date}</span>
              <Badge variant="secondary" className="text-[10px] rounded-full px-2 py-0">
                {ticket.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
